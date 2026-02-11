import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, doc, updateDoc, onSnapshot, getDocs } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    Loader2
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
    const [mediaLoading, setMediaLoading] = useState<'logo' | 'cover' | null>(null);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

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
                where("meta.createdBy", "==", user.uid)
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
                    <div className="text-center max-w-md mx-auto">
                        <div className="w-20 h-20 rounded-full bg-accent mx-auto mb-6 flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="font-display text-2xl font-bold mb-3">No Madarsa Found</h1>
                        <p className="text-muted-foreground mb-8">
                            You haven't registered any madarsa yet. Register your madarsa to access the dashboard.
                        </p>
                        <Link to="/add-madarsa">
                            <Button size="lg" className="w-full gap-2">
                                <Plus className="w-4 h-4" />
                                Add New Madarsa
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
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
                                    className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03] ${mediaLoading === 'cover' ? 'opacity-50 grayscale' : ''}`}
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
                                                    className={`w-full h-full object-cover ${mediaLoading === 'logo' ? 'opacity-50' : ''}`}
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
                                        <Link to={`/madarsa/${madarsa.id}`} className="flex-grow sm:flex-none">
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
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className={`${item.color} p-3 rounded-xl text-white shadow-lg transition-transform group-hover:scale-110 group-active:scale-95`}>
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
                                    { title: "Teachers", value: madarsa.academic?.teachers || 0, sub: "Active Faculty", icon: Users, trend: null },
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
                            <Card>
                                <CardHeader>
                                    <CardTitle>Manage Teachers</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                                        <Users className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">No Teachers Added Yet</h3>
                                    <p className="text-muted-foreground max-w-sm mb-6">
                                        Share your Madarsa Code <strong>{madarsa.madarsaCode || "..."}</strong> with teachers so they can join your madarsa.
                                    </p>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Teacher Manually
                                    </Button>
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
        </div>
    );
};

export default MyMadarsa;
