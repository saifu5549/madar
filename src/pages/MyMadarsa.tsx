import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    MapPin,
    Calendar,
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

        // Check file size (2MB limit)
        if (file.size > 2 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "File size exceeds 2MB limit.",
                variant: "destructive",
            });
            return;
        }

        setMediaLoading(type);
        try {
            const fileRef = ref(storage, `madarsa-images/${madarsa.id}/${type}_${Date.now()}`);
            await uploadBytes(fileRef, file);
            const downloadUrl = await getDownloadURL(fileRef);

            const madarsaRef = doc(db, "madarsas", madarsa.id);
            await updateDoc(madarsaRef, {
                [`media.${type === 'logo' ? 'logo' : 'coverPhoto'}`]: downloadUrl,
                "meta.updatedAt": Date.now()
            });

            // Refresh data locally
            setMadarsa((prev: any) => ({
                ...prev,
                media: {
                    ...prev.media,
                    [type === 'logo' ? 'logo' : 'coverPhoto']: downloadUrl
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
                description: "Failed to upload image. Please try again.",
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

        const fetchMadarsa = async () => {
            if (!user) return;

            try {
                // Query madarsas where createdBy matches current user
                const q = query(
                    collection(db, "madarsas"),
                    where("meta.createdBy", "==", user.uid)
                );

                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    // For now, assume one madarsa per user
                    const madarsaDoc = querySnapshot.docs[0];
                    setMadarsa({ id: madarsaDoc.id, ...madarsaDoc.data() });
                }
            } catch (error) {
                console.error("Error fetching madarsa:", error);
                toast({
                    title: "Error",
                    description: "Failed to load madarsa details.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchMadarsa();
        }
    }, [user, authLoading, navigate, toast]);

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
                <div className="container mx-auto px-4 max-w-6xl">
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
                    {/* Integrated Header Section */}
                    <div className="premium-card rounded-3xl overflow-hidden mb-8 animate-fade-up shadow-2xl">
                        {/* Banner Area */}
                        <div className="relative h-48 md:h-64 group">
                            {madarsa.media?.coverPhoto ? (
                                <img
                                    src={`${madarsa.media.coverPhoto}?v=${madarsa.meta?.updatedAt || 1}`}
                                    alt="Cover"
                                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${mediaLoading === 'cover' ? 'opacity-50 grayscale' : ''}`}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-primary/80 via-primary to-primary/80 geometric-pattern opacity-90" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            {mediaLoading === 'cover' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                                </div>
                            )}

                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute top-4 right-4 gap-2 bg-white/20 backdrop-blur-md text-white border-white/20 hover:bg-white/40 rounded-full transition-all shadow-lg"
                                disabled={mediaLoading !== null}
                                onClick={() => coverInputRef.current?.click()}
                            >
                                <GalleryIcon className="w-4 h-4" />
                                <span>Gallery</span>
                            </Button>

                            {/* Logo Overlap (Inside Banner context for relative layout) */}
                            <div className="absolute -bottom-12 left-6 md:left-10 flex items-end gap-6 z-20">
                                <div className="relative group/logo">
                                    <div className="w-24 h-24 md:w-36 md:h-36 rounded-3xl p-1.5 bg-background shadow-2xl">
                                        <div className="w-full h-full rounded-2xl overflow-hidden bg-muted flex items-center justify-center border border-border/50 relative">
                                            {mediaLoading === 'logo' && (
                                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                                </div>
                                            )}
                                            {madarsa.media?.logo ? (
                                                <img
                                                    src={`${madarsa.media.logo}?v=${madarsa.meta?.updatedAt || 1}`}
                                                    alt={madarsa.basicInfo?.nameEnglish}
                                                    className={`w-full h-full object-cover ${mediaLoading === 'logo' ? 'opacity-50' : ''}`}
                                                />
                                            ) : (
                                                <Building2 className="w-12 h-12 text-primary/30" />
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        className="absolute bottom-0 right-0 p-3 bg-primary text-white rounded-xl shadow-xl transform translate-x-1/4 translate-y-1/4 opacity-100 transition-all hover:scale-110 border-4 border-background disabled:opacity-50 z-30"
                                        disabled={mediaLoading !== null}
                                        onClick={() => logoInputRef.current?.click()}
                                        title="Change Logo"
                                    >
                                        <Camera className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="mb-4 hidden md:block">
                                    <h1 className="font-display text-4xl font-bold text-white drop-shadow-lg mb-1">
                                        {madarsa.basicInfo?.nameEnglish}
                                    </h1>
                                    <div className="flex items-center gap-2 text-white/90 font-medium">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{madarsa.location?.city}, {madarsa.location?.state}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Area */}
                        <div className="p-6 md:p-10 pt-16 md:pt-12 bg-background/40 backdrop-blur-xl">
                            <div className="flex flex-col md:flex-row justify-between gap-8">
                                <div className="flex flex-col gap-4">
                                    <div className="md:hidden mb-2">
                                        <h1 className="font-display text-3xl font-bold text-gradient-primary mb-1">
                                            {madarsa.basicInfo?.nameEnglish}
                                        </h1>
                                        <p className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                                            <MapPin className="w-4 h-4 text-primary/60" />
                                            {madarsa.location?.city}, {madarsa.location?.state}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary rounded-full px-4 py-1 text-xs font-bold shadow-sm">
                                            {madarsa.meta?.status === "verified" ? (
                                                <><CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Verified Profile</>
                                            ) : (
                                                <><Clock className="w-3.5 h-3.5 mr-2" /> Pending Verification</>
                                            )}
                                        </Badge>
                                        <Badge variant="secondary" className="rounded-full px-4 py-1 text-xs font-bold border border-border shadow-sm">
                                            <Calendar className="w-3.5 h-3.5 mr-2 text-primary" />
                                            Since {madarsa.basicInfo?.established}
                                        </Badge>
                                        <Badge variant="secondary" className="rounded-full px-4 py-1 text-xs font-bold border border-border shadow-sm">
                                            <Users className="w-3.5 h-3.5 mr-2 text-primary" />
                                            {madarsa.academic?.totalStudents || 0} Students
                                        </Badge>
                                    </div>
                                </div>

                                {/* Madarsa Code & Quick Actions */}
                                <div className="flex flex-col gap-4 md:items-end w-full md:w-auto mt-2 md:mt-0">
                                    <div className="glass-card border-primary/20 bg-primary/[0.03] rounded-2xl p-4 flex flex-col items-center justify-center min-w-[240px] shadow-lg relative overflow-hidden group/code cursor-pointer" onClick={copyCode}>
                                        <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover/code:translate-y-0 transition-transform duration-300" />
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.25em] mb-2 opacity-80 relative z-10">
                                            OFFICIAL MADARSA CODE
                                        </span>
                                        <div className="flex items-center gap-4 relative z-10">
                                            <span className="font-mono text-3xl font-black tracking-[0.2em] text-foreground">
                                                {madarsa.madarsaCode || "N/A"}
                                            </span>
                                            <Copy className="w-5 h-5 text-primary group-hover/code:scale-110 transition-transform" />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 w-full md:w-auto">
                                        <Link to={`/madarsa/${madarsa.id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full gap-2 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all font-bold">
                                                <Share2 className="w-4 h-4" />
                                                Public View
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all font-bold"
                                            onClick={() => setIsEditModalOpen(true)}
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
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
                                    { title: "Total Students", value: madarsa.academic?.totalStudents || 0, sub: "Enrolled", icon: GraduationCap, trend: "+12%" },
                                    { title: "Teachers", value: madarsa.academic?.teachers || 0, sub: "Active Faculty", icon: Users, trend: "+2" },
                                    { title: "Staff", value: madarsa.academic?.staff || 0, sub: "Support", icon: Building2, trend: "Stable" },
                                    { title: "Courses", value: madarsa.academic?.classes?.length || 0, sub: "Active Classes", icon: BookOpen, trend: "4 New" },
                                ].map((stat, i) => (
                                    <Card key={i} className="premium-card overflow-hidden group">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary transition-colors">
                                                    <stat.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                                                </div>
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">
                                                    {stat.trend}
                                                </span>
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
                                            {[
                                                { type: "student", msg: "5 new students enrolled in Class 4", time: "2 hours ago" },
                                                { type: "update", msg: "Profile information updated", time: "5 hours ago" },
                                                { type: "teacher", msg: "Maulana Ahmed joined the faculty", time: "Yesterday" },
                                            ].map((activity, i) => (
                                                <div key={i} className="flex gap-4 group cursor-default">
                                                    <div className="w-1 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                                                    <div className="flex-grow">
                                                        <p className="text-sm font-medium">{activity.msg}</p>
                                                        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-tight font-semibold italic">{activity.time}</p>
                                                    </div>
                                                </div>
                                            ))}
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
                                            {[
                                                { title: "Exams Starting", date: "Feb 20", level: "Important" },
                                                { title: "Holiday Announcement", date: "Feb 15", level: "General" },
                                            ].map((notice, i) => (
                                                <div key={i} className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                                                            {notice.level}
                                                        </Badge>
                                                        <span className="text-[10px] font-bold text-muted-foreground">{notice.date}</span>
                                                    </div>
                                                    <p className="text-sm font-bold">{notice.title}</p>
                                                </div>
                                            ))}
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
