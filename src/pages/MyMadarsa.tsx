import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, updateDoc, getDocs, or, arrayUnion, setDoc, serverTimestamp } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    MapPin,
    Users,
    GraduationCap,
    BookOpen,
    Building2,
    Plus,
    Copy,
    Settings,
    Share2,
    UserPlus,
    FileText,
    Bell,
    ArrowRight,
    Activity,
    CheckCircle2,
    Clock,
    Camera,
    Image as GalleryIcon,
    Loader2,
    Book,
    User,
    ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EditMadarsaModal } from "@/components/EditMadarsaModal";

const MyMadarsa = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [madarsa, setMadarsa] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [mediaLoading, setMediaLoading] = useState<'logo' | 'cover' | 'teacher' | null>(null);
    const [joinStep, setJoinStep] = useState<1 | 2>(1);
    const [foundMadarsa, setFoundMadarsa] = useState<any>(null);
    const [teacherProfile, setTeacherProfile] = useState({
        name: user?.displayName || "",
        subject: "",
        photo: ""
    });
    const [staffList, setStaffList] = useState<any[]>([]);
    const [joinCode, setJoinCode] = useState("");
    const [isJoining, setIsJoining] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const teacherPhotoRef = useRef<HTMLInputElement>(null);

    const SUBJECT_CATEGORIES = [
        {
            label: "Madarsa (Religious)",
            subjects: ["Hifz", "Nazra", "Arabi", "Urdu", "Farsi", "Deeniyat", "Tajweed", "Ifta", "Alim", "Fazil"]
        },
        {
            label: "School (Academic)",
            subjects: ["Mathematics", "Science", "English", "Hindi", "Social Science", "Computer Science", "Sanskrit", "Physical Education"]
        },
        {
            label: "Management / Admin",
            subjects: ["Mohatmim", "Staff", "Other"]
        }
    ];

    const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
        const file = e.target.files?.[0];
        if (!file || !madarsa?.id) return;

        // Check file size (1MB limit for Base64 storage in Firestore)
        if (file.size > 1 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "File size exceeds 1MB limit for free storage workaround.",
                variant: "destructive",
            });
            return;
        }

        setMediaLoading(type);
        try {
            // Convert to Base64
            const reader = new FileReader();
            const base64Promise = new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const base64Data = await base64Promise as string;

            const madarsaRef = doc(db, "madarsas", madarsa.id);
            const field = type === 'logo' ? 'media.logo' : 'media.coverPhoto';

            await updateDoc(madarsaRef, {
                [field]: base64Data,
                "meta.updatedAt": Date.now()
            });

            // Refresh data locally
            setMadarsa((prev: any) => ({
                ...prev,
                media: {
                    ...prev.media,
                    [type === 'logo' ? 'logo' : 'coverPhoto']: base64Data
                },
                meta: {
                    ...prev.meta,
                    updatedAt: Date.now()
                }
            }));

            toast({
                title: "Success",
                description: `${type === 'logo' ? 'Logo' : 'Cover image'} updated successfully!`,
            });
        } catch (error) {
            console.error("Error uploading media:", error);
            toast({
                title: "Error",
                description: "Failed to update image. Please try again.",
                variant: "destructive",
            });
        } finally {
            setMediaLoading(null);
            if (e.target) e.target.value = ""; // Clear input for next selection
        }
    };

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/auth");
            return;
        }

        if (user && !authLoading) {
            const q = query(
                collection(db, "madarsas"),
                or(
                    where("meta.createdBy", "==", user.uid),
                    where("meta.staffUids", "array-contains", user.uid)
                )
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                if (!querySnapshot.empty) {
                    const madarsaDoc = querySnapshot.docs[0];
                    setMadarsa({ id: madarsaDoc.id, ...madarsaDoc.data() });
                } else {
                    setMadarsa(null);
                }
                setLoading(false);
            }, (error) => {
                console.error("Error listening to madarsa data:", error);
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (!madarsa?.id) return;

        const q = query(
            collection(db, "staff_profiles"),
            where("madarsaId", "==", madarsa.id)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const staff = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStaffList(staff);
        });

        return () => unsubscribe();
    }, [madarsa?.id]);

    const handleJoinMadarsaStep1 = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!joinCode.trim()) return;

        setIsJoining(true);
        try {
            const q = query(
                collection(db, "madarsas"),
                where("madarsaCode", "==", joinCode.trim().toUpperCase())
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                toast({
                    title: "Invalid Code",
                    description: "No Madarsa found with this code.",
                    variant: "destructive",
                });
                return;
            }

            const mDoc = querySnapshot.docs[0];
            setFoundMadarsa({ id: mDoc.id, ...mDoc.data() });
            setJoinStep(2);
        } catch (error: any) {
            console.error("Error finding madarsa:", error);
            toast({
                title: "Error",
                description: "Failed to verify code.",
                variant: "destructive",
            });
        } finally {
            setIsJoining(false);
        }
    };

    const handleJoinMadarsaStep2 = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !foundMadarsa) return;

        setIsJoining(true);
        try {
            // 1. Create staff profile
            await setDoc(doc(db, "staff_profiles", `${foundMadarsa.id}_${user.uid}`), {
                uid: user.uid,
                madarsaId: foundMadarsa.id,
                name: teacherProfile.name,
                subject: teacherProfile.subject,
                photo: teacherProfile.photo,
                role: "teacher",
                joinedAt: serverTimestamp(),
            });

            // 2. Link to madarsa
            await updateDoc(doc(db, "madarsas", foundMadarsa.id), {
                "meta.staffUids": arrayUnion(user.uid)
            });

            toast({
                title: "Profile Created!",
                description: `Successfully joined ${foundMadarsa.basicInfo.nameHindi}.`,
            });
            // Dashboard will auto-refresh via onSnapshot
        } catch (error: any) {
            console.error("Error creating profile:", error);
            toast({
                title: "Error",
                description: "Failed to create profile.",
                variant: "destructive",
            });
        } finally {
            setIsJoining(false);
        }
    };

    const handleTeacherPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 500 * 1024) { // 500KB limit for teacher photo
            toast({
                title: "File too large",
                description: "Teacher photo must be under 500KB.",
                variant: "destructive",
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setTeacherProfile(prev => ({ ...prev, photo: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const copyCode = () => {
        if (madarsa?.madarsaCode) {
            navigator.clipboard.writeText(madarsa.madarsaCode);
            toast({
                title: "Code Copied!",
                description: "Madarsa code copied to clipboard.",
            });
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!madarsa) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="text-center max-w-md mx-auto space-y-8">
                        <div>
                            <div className="w-20 h-20 rounded-full bg-accent mx-auto mb-6 flex items-center justify-center">
                                <Building2 className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="font-display text-2xl font-bold mb-3">Welcome to Madarsa Connect</h1>
                            <p className="text-muted-foreground">
                                Access your dashboard by joining an existing madarsa or registering a new one.
                            </p>
                        </div>

                        {/* Join Flow */}
                        <Card className="premium-card p-6 overflow-hidden relative">
                            {joinStep === 1 ? (
                                <>
                                    <h2 className="font-semibold text-lg mb-4">Join as Ustaad/Staff</h2>
                                    <form onSubmit={handleJoinMadarsaStep1} className="space-y-4">
                                        <div className="space-y-2 text-left">
                                            <Label htmlFor="joinCode">Madarsa Code</Label>
                                            <Input
                                                id="joinCode"
                                                placeholder="Enter code (e.g. MDR123)"
                                                value={joinCode}
                                                onChange={(e) => setJoinCode(e.target.value)}
                                                className="text-center font-bold tracking-widest uppercase"
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full gap-2" disabled={isJoining}>
                                            {isJoining ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            Verify Code
                                        </Button>
                                    </form>
                                </>
                            ) : (
                                <div className="animate-fade-in">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setJoinStep(1)}
                                            className="rounded-full hover:bg-primary/10"
                                        >
                                            <ArrowLeft className="w-5 h-5 text-primary" />
                                        </Button>
                                        <div className="text-left">
                                            <h2 className="font-display text-xl font-bold text-primary">Teacher Profile</h2>
                                            <p className="text-xs text-muted-foreground">Joining: <span className="font-bold text-foreground">{foundMadarsa?.basicInfo?.nameHindi}</span></p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleJoinMadarsaStep2} className="space-y-8">
                                        {/* Live Profile Preview */}
                                        <div className="p-4 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                                <GraduationCap className="w-12 h-12 rotate-12" />
                                            </div>
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className="relative">
                                                    <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-background shadow-lg border-2 border-primary/20 flex items-center justify-center">
                                                        {teacherProfile.photo ? (
                                                            <img src={teacherProfile.photo} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="w-10 h-10 text-muted-foreground/30" />
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => teacherPhotoRef.current?.click()}
                                                        className="absolute -bottom-1 -right-1 p-2 bg-primary text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                                                    >
                                                        <Camera className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="text-left min-w-0 flex-grow">
                                                    <h3 className="font-black text-lg truncate leading-tight">
                                                        {teacherProfile.name || "Apka Naam"}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 mt-1 text-primary">
                                                        <Book className="w-3.5 h-3.5" />
                                                        <p className="text-xs font-black uppercase tracking-tight truncate">
                                                            {teacherProfile.subject || "Subject"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                ref={teacherPhotoRef}
                                                onChange={handleTeacherPhotoUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>

                                        <div className="space-y-4 text-left">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="tName" className="text-xs font-bold text-muted-foreground uppercase ml-1">Naam (Name)</Label>
                                                <Input
                                                    id="tName"
                                                    value={teacherProfile.name}
                                                    onChange={(e) => setTeacherProfile(prev => ({ ...prev, name: e.target.value }))}
                                                    placeholder="e.g. Maulana Ahmad Raza"
                                                    className="rounded-xl border-primary/10 focus:border-primary/30 h-12"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="tSubject" className="text-xs font-bold text-muted-foreground uppercase ml-1">Subject / Department</Label>
                                                <Select
                                                    onValueChange={(value) => setTeacherProfile(prev => ({ ...prev, subject: value }))}
                                                    required
                                                >
                                                    <SelectTrigger id="tSubject" className="rounded-xl border-primary/10 focus:border-primary/30 h-12">
                                                        <SelectValue placeholder="Select Subject" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-primary/10 shadow-2xl">
                                                        {SUBJECT_CATEGORIES.map((cat) => (
                                                            <SelectGroup key={cat.label}>
                                                                <SelectLabel className="text-[10px] font-black uppercase tracking-widest text-primary/50 px-4 py-2">{cat.label}</SelectLabel>
                                                                {cat.subjects.map((sub) => (
                                                                    <SelectItem key={sub} value={sub} className="px-4 py-3 cursor-pointer hover:bg-primary/5 transition-colors">
                                                                        {sub}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full gap-3 h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all" disabled={isJoining}>
                                            {isJoining ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                                            Add Me to Madarsa
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </Card>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground uppercase">Or</span>
                            </div>
                        </div>

                        {/* Register New */}
                        <div className="space-y-4">
                            <h2 className="font-semibold text-lg">Are you a Mohatmim?</h2>
                            <Link to="/add-madarsa">
                                <Button size="lg" variant="outline" className="w-full gap-2">
                                    <Plus className="w-4 h-4" />
                                    Register New Madarsa
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />

                {/* Photo Preview Modal */}
                <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
                    <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                        <DialogHeader className="sr-only">
                            <DialogTitle>Photo Preview</DialogTitle>
                        </DialogHeader>
                        <div className="relative w-full h-[80vh] flex items-center justify-center p-4">
                            <div
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm -z-10"
                                onClick={() => setSelectedPhoto(null)}
                            />
                            {selectedPhoto && (
                                <img
                                    src={selectedPhoto}
                                    alt="Full Preview"
                                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
                                />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-grow py-8 bg-accent/5 geometric-pattern">
                {/* Full-bleed Header Background for Premium Look */}
                <div className="absolute top-0 left-0 right-0 h-[32rem] bg-gradient-to-b from-primary/10 via-primary/[0.03] to-transparent pointer-events-none" />

                <div className="container mx-auto px-4 max-w-7xl relative">
                    {/* Hidden File Inputs */}
                    <input
                        type="file"
                        ref={logoInputRef}
                        onChange={(e) => handleDirectUpload(e, 'logo')}
                        accept="image/*"
                        className="hidden"
                    />
                    <input
                        type="file"
                        ref={coverInputRef}
                        onChange={(e) => handleDirectUpload(e, 'cover')}
                        accept="image/*"
                        className="hidden"
                    />
                    {/* Highly Integrated Premium Header Container */}
                    <div className="premium-card rounded-[2.5rem] overflow-hidden mb-12 animate-fade-up shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border-2 border-primary/5">
                        {/* Immersive Banner Area */}
                        <div className="relative h-64 md:h-[26rem] group">
                            {madarsa.media?.coverPhoto ? (
                                <img
                                    src={madarsa.media.coverPhoto}
                                    alt="Cover"
                                    className={`w - full h - full object - cover transition - transform duration - 1000 group - hover: scale - [1.03] ${mediaLoading === 'cover' ? 'opacity-50 grayscale' : ''} `}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 geometric-pattern opacity-95" />
                            )}

                            {/* Cinematic Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                            <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />

                            {mediaLoading === 'cover' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-30">
                                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20">
                                        <Loader2 className="w-12 h-12 text-white animate-spin" />
                                    </div>
                                </div>
                            )}

                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute top-6 right-6 gap-2 bg-black/40 backdrop-blur-2xl text-white border-white/10 hover:bg-black/60 rounded-full transition-all shadow-2xl scale-110 active:scale-95 group/banner-btn"
                                disabled={mediaLoading !== null}
                                onClick={() => coverInputRef.current?.click()}
                            >
                                <GalleryIcon className="w-4 h-4 group-hover/banner-btn:scale-120 transition-transform" />
                                <span className="font-black text-xs uppercase tracking-wider">Change Header</span>
                            </Button>

                            {/* Elevated Logo & Identity Section */}
                            <div className="absolute -bottom-20 left-6 md:left-12 flex items-end gap-8 md:gap-12 z-20 w-full pr-12">
                                <div className="relative group/logo flex-shrink-0">
                                    <div className="w-32 h-32 md:w-52 md:h-52 rounded-[2.5rem] p-2.5 bg-background shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] transform transition-all duration-700 group-hover/logo:scale-[1.03] group-hover/logo:-rotate-1">
                                        <div className="w-full h-full rounded-[2rem] overflow-hidden bg-muted flex items-center justify-center border-2 border-border/50 relative shadow-inner">
                                            {mediaLoading === 'logo' && (
                                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                                                </div>
                                            )}
                                            {madarsa.media?.logo ? (
                                                <img
                                                    src={madarsa.media.logo}
                                                    alt={madarsa.basicInfo?.nameEnglish}
                                                    className={`w - full h - full object - cover ${mediaLoading === 'logo' ? 'opacity-50' : ''} `}
                                                />
                                            ) : (
                                                <Building2 className="w-20 h-20 text-primary/15" />
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        className="absolute bottom-3 right-3 p-4 bg-primary text-white rounded-[1.25rem] shadow-2xl transform translate-x-1/4 translate-y-1/4 opacity-100 transition-all hover:scale-110 hover:rotate-6 border-4 border-background disabled:opacity-50 z-30 group/cam-btn"
                                        disabled={mediaLoading !== null}
                                        onClick={() => logoInputRef.current?.click()}
                                    >
                                        <Camera className="w-6 h-6 group-hover/cam-btn:rotate-12 transition-transform" />
                                    </button>
                                </div>

                                <div className="mb-24 hidden md:block flex-grow max-w-4xl">
                                    <h1 className="font-display text-6xl font-black text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)] mb-4 tracking-tight leading-tight uppercase text-wrap">
                                        {madarsa.basicInfo?.nameEnglish}
                                    </h1>
                                    <div className="flex items-center gap-4 text-white/95 font-black bg-white/10 backdrop-blur-2xl border border-white/20 px-6 py-2.5 rounded-2xl w-fit shadow-2xl">
                                        <div className="p-1.5 bg-primary/20 rounded-lg">
                                            <MapPin className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="text-base tracking-widest">{madarsa.location?.city}, {madarsa.location?.state}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* High-End Details Hub */}
                        <div className="p-8 md:p-14 pt-24 md:pt-[6.5rem] bg-gradient-to-b from-background/50 via-background/80 to-background backdrop-blur-[40px]">
                            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12">
                                <div className="flex flex-col gap-8 w-full xl:w-auto">
                                    <div className="md:hidden">
                                        <h1 className="font-display text-4xl font-black text-gradient-primary mb-3 leading-none uppercase">
                                            {madarsa.basicInfo?.nameEnglish}
                                        </h1>
                                        <div className="flex items-center gap-2.5 text-muted-foreground font-black text-sm tracking-widest uppercase opacity-70">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            {madarsa.location?.city}, {madarsa.location?.state}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6">
                                        <Badge variant="outline" className="h-12 border-primary/20 bg-primary/5 text-primary rounded-[1.25rem] px-6 text-sm font-black tracking-widest shadow-xl border-2 flex items-center justify-center">
                                            {madarsa.meta?.status === "verified" ? (
                                                <><CheckCircle2 className="w-5 h-5 mr-3 text-primary animate-pulse" /> VERIFIED INSTITUTION</>
                                            ) : (
                                                <><Clock className="w-5 h-5 mr-3 text-amber-500" /> PENDING VERIFICATION</>
                                            )}
                                        </Badge>

                                        <div className="flex items-center gap-8 bg-muted/30 px-8 py-3 rounded-[1.25rem] border border-border/50">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">FOUNDED</span>
                                                <span className="text-base font-black text-foreground">{madarsa.basicInfo?.established}</span>
                                            </div>
                                            <div className="w-px h-10 bg-border/80" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">CAPACITY</span>
                                                <span className="text-base font-black text-primary">{madarsa.academic?.totalStudents || 0}+ STUDENTS</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Identity Card & Pro Actions */}
                                <div className="flex flex-col sm:flex-row xl:flex-col gap-6 items-stretch sm:items-center xl:items-end w-full xl:w-auto">
                                    <div
                                        className="relative group/code cursor-pointer overflow-hidden rounded-[2rem] p-6 bg-gradient-to-br from-primary/[0.08] via-primary/[0.04] to-transparent border-2 border-primary/20 shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.1)] transition-all hover:border-primary/50 hover:shadow-[0_25px_50px_-12px_rgba(var(--primary-rgb),0.2)]"
                                        onClick={copyCode}
                                    >
                                        <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover/code:opacity-10 transition-opacity">
                                            <Copy className="w-20 h-20" />
                                        </div>
                                        <span className="text-[11px] font-black text-primary uppercase tracking-[0.5em] mb-4 block opacity-80">
                                            OFFICIAL MADARSA CODE
                                        </span>
                                        <div className="flex items-center gap-8">
                                            <span className="font-mono text-4xl font-black tracking-[0.3em] text-foreground drop-shadow-sm select-none">
                                                {madarsa.madarsaCode || "N/A"}
                                            </span>
                                            <div className="h-12 w-12 rounded-[1.25rem] bg-primary text-white flex items-center justify-center shadow-xl transform active:scale-90 group-hover/code:rotate-3 transition-all">
                                                <Copy className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 w-full sm:w-auto">
                                        <Link to={`/ madarsa / ${madarsa.id} `} className="flex-grow sm:flex-none">
                                            <Button variant="outline" className="w-full gap-3 h-14 px-10 rounded-2xl border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 text-base font-black tracking-wider transition-all">
                                                <Share2 className="w-5 h-5" />
                                                PUBLIC PROFILE
                                            </Button>
                                        </Link>
                                        <Button
                                            className="gap-3 h-14 rounded-2xl shadow-xl font-black text-base px-10 active:scale-95 transition-all hover:shadow-primary/20"
                                            onClick={() => setIsEditModalOpen(true)}
                                        >
                                            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                                            SETTINGS
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { icon: UserPlus, label: "Add Student", color: "bg-blue-500", action: () => { } },
                            { icon: Users, label: "Add Teacher", color: "bg-emerald-500", action: () => { } },
                            { icon: FileText, label: "Post Notice", color: "bg-amber-500", action: () => { } },
                            { icon: Bell, label: "Send Update", color: "bg-purple-500", action: () => { } },
                        ].map((item, i) => (
                            <button
                                key={i}
                                onClick={item.action}
                                className="premium-card p-4 flex flex-col items-center justify-center gap-3 group text-center animate-fade-up"
                                style={{ animationDelay: `${i * 0.1} s` }}
                            >
                                <div className={`${item.color} p - 3 rounded - xl text - white shadow - lg transition - transform group - hover: scale - 110 group - active: scale - 95`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <span className="font-semibold text-sm">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Dashboard Tabs */}
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="bg-muted/50 p-1 rounded-full border border-border glass-card">
                            <TabsTrigger value="overview" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Overview</TabsTrigger>
                            <TabsTrigger value="teachers" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Teachers</TabsTrigger>
                            <TabsTrigger value="students" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Students</TabsTrigger>
                            <TabsTrigger value="academics" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Academics</TabsTrigger>
                        </TabsList>

                        {/* Overview Content */}
                        <TabsContent value="overview" className="space-y-8 animate-fade-up">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { title: "Total Students", value: madarsa.academic?.totalStudents || 0, sub: "Enrolled", icon: GraduationCap, trend: null },
                                    { title: "Teachers", value: staffList.length || madarsa.academic?.teachers || 0, sub: "Active Faculty", icon: Users, trend: null },
                                    { title: "Staff", value: madarsa.academic?.staff || 0, sub: "Support", icon: Building2, trend: null },
                                    { title: "Courses", value: madarsa.academic?.classes?.length || 0, sub: "Active Classes", icon: BookOpen, trend: null },
                                ].map((stat, i) => (
                                    <Card key={i} className="premium-card overflow-hidden group">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary transition-colors">
                                                    <stat.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                                                </div>
                                                {stat.trend && (
                                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">
                                                        {stat.trend}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-3xl font-bold tracking-tight mb-1">{stat.value}</div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.title}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    {/* About & Contact */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Card className="premium-card flex flex-col">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Activity className="w-5 h-5 text-primary" />
                                                    About Madarsa
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex-grow">
                                                <p className="text-sm text-muted-foreground leading-relaxed italic">
                                                    "{madarsa.description?.about || "Elevating education through tradition and technology."}"
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card className="premium-card">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <MapPin className="w-5 h-5 text-primary" />
                                                    Contact Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4 pt-2">
                                                {[
                                                    { label: "Phone", value: madarsa.contact?.phone },
                                                    { label: "Email", value: madarsa.contact?.email },
                                                    { label: "Mohatmim", value: madarsa.mohatmim?.name },
                                                ].map((detail, idx) => (
                                                    <div key={idx} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{detail.label}</span>
                                                        <span className="text-sm font-semibold truncate max-w-[150px]">{detail.value || "N/A"}</span>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Recent Activity Feed */}
                                    <Card className="premium-card">
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-primary" />
                                                Recent Activity
                                            </CardTitle>
                                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 gap-1">
                                                View All <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="flex flex-col items-center justify-center py-4 text-center">
                                                <p className="text-sm text-muted-foreground italic">Activity tracking system coming soon.</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-8">
                                    {/* Announcements / Notice Board */}
                                    <Card className="premium-card bg-primary/[0.02] border-primary/10 overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
                                            <Bell className="w-32 h-32" />
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Bell className="w-5 h-5 text-primary" />
                                                Notice Board
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex flex-col items-center justify-center py-4 text-center">
                                                <p className="text-sm text-muted-foreground">No active notices.</p>
                                            </div>
                                            <Button className="w-full mt-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold py-5 shadow-lg shadow-primary/20">
                                                Post New Notice
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    {/* Progress Card */}
                                    <div className="premium-card p-6 bg-gradient-to-br from-primary to-primary/80 text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all" />
                                        <h4 className="text-lg font-bold mb-1 relative z-10">Verification Progress</h4>
                                        <p className="text-white/70 text-xs mb-4 relative z-10 font-medium">Your madarsa profile is 85% complete.</p>
                                        <div className="h-2 w-full bg-white/20 rounded-full mb-6 relative z-10">
                                            <div className="h-full bg-secondary w-[85%] rounded-full shadow-lg" />
                                        </div>
                                        <Button variant="secondary" className="w-full font-bold text-sm bg-white text-primary hover:bg-white/90 border-0 h-11 relative z-10">
                                            Complete Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Placeholder Content for other tabs */}
                        <TabsContent value="teachers">
                            <Card className="premium-card">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                    <div>
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <Users className="w-6 h-6 text-primary" />
                                            Active Faculty
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">List of all ustaads and staff members.</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        MDR Code: {madarsa.madarsaCode}
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {staffList.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {staffList.map((staff, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 rounded-3xl bg-accent/5 border border-primary/5 hover:bg-accent/10 transition-all group overflow-hidden relative">
                                                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-120 transition-transform">
                                                        <GraduationCap className="w-16 h-16" />
                                                    </div>
                                                    <div
                                                        className="w-16 h-16 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border border-primary/10 cursor-pointer group/photo relative"
                                                        onClick={() => staff.photo && setSelectedPhoto(staff.photo)}
                                                    >
                                                        {staff.photo ? (
                                                            <>
                                                                <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover transition-transform group-hover/photo:scale-110" />
                                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <Camera className="w-4 h-4 text-white" />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                                <User className="w-8 h-8 text-primary/40" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-black text-sm text-foreground truncate">{staff.name}</h4>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <Book className="w-3.5 h-3.5 text-primary" />
                                                            <p className="text-xs font-bold text-primary truncate max-w-[120px]">{staff.subject}</p>
                                                        </div>
                                                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-primary/10 text-[9px] font-black text-primary uppercase tracking-tighter">
                                                            {staff.role || "Teacher"}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                                                <Users className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2">No Teachers Added Yet</h3>
                                            <p className="text-muted-foreground max-w-sm mb-6">
                                                Share your Madarsa Code <strong>{madarsa.madarsaCode || "..."}</strong> with teachers so they can join your madarsa.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="students">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Manage Students</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                                        <GraduationCap className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">No Students Added Yet</h3>
                                    <p className="text-muted-foreground max-w-sm mb-6">
                                        Students can join using the Madarsa Code <strong>{madarsa.madarsaCode || "..."}</strong>.
                                    </p>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Student Manually
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="academics">
                            <Card className="premium-card">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <BookOpen className="w-6 h-6 text-primary" />
                                        Academic Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { label: "Total Students", value: madarsa.academic?.totalStudents || 0 },
                                            { label: "Teachers", value: madarsa.academic?.teachers || 0 },
                                            { label: "Staff", value: madarsa.academic?.staff || 0 },
                                        ].map((item, i) => (
                                            <div key={i} className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                                                <p className="text-xs font-black text-muted-foreground uppercase mb-1">{item.label}</p>
                                                <p className="text-2xl font-black text-foreground">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-bold text-lg">Classes Offered</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {madarsa.academic?.classes?.length ? (
                                                madarsa.academic.classes.map((cls: string, i: number) => (
                                                    <Badge key={i} variant="secondary" className="px-4 py-2 rounded-xl text-sm font-bold bg-primary/5 text-primary border-primary/10">
                                                        {cls}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">No classes listed.</p>
                                            )}
                                        </div>
                                    </div>

                                    <Button onClick={() => setIsEditModalOpen(true)} variant="outline" className="w-full h-12 rounded-xl font-bold">
                                        Update Academic Info
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            <Footer />

            {madarsa && (
                <EditMadarsaModal
                    madarsa={madarsa}
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                    }}
                    onUpdate={async () => {
                        if (!user) return;
                        try {
                            const q = query(
                                collection(db, "madarsas"),
                                where("meta.createdBy", "==", user.uid)
                            );
                            const querySnapshot = await getDocs(q);
                            if (!querySnapshot.empty) {
                                const madarsaDoc = querySnapshot.docs[0];
                                setMadarsa({ id: madarsaDoc.id, ...madarsaDoc.data() });
                            }
                        } catch (error) {
                            console.error("Error refreshing madarsa:", error);
                        }
                    }}
                />
            )}

            {/* Photo Preview Modal */}
            <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Photo Preview</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full h-[80vh] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm -z-10"
                            onClick={() => setSelectedPhoto(null)}
                        />
                        {selectedPhoto && (
                            <img
                                src={selectedPhoto}
                                alt="Full Preview"
                                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MyMadarsa;
