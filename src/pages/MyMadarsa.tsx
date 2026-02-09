import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Loader2,
    MapPin,
    Calendar,
    Users,
    GraduationCap,
    BookOpen,
    Building2,
    Plus,
    Copy,
    Settings,
    Share2
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

            <main className="flex-grow py-8 bg-accent/10">
                <div className="container mx-auto px-4">
                    {/* Header Section with Code */}
                    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 card-elevated mb-8">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex items-start gap-4 md:gap-6">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border border-border flex-shrink-0 bg-muted">
                                    {madarsa.media?.logo ? (
                                        <img
                                            src={madarsa.media.logo}
                                            alt={madarsa.basicInfo?.nameEnglish}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Building2 className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <h1 className="font-display text-2xl md:text-3xl font-bold">
                                            {madarsa.basicInfo?.nameEnglish}
                                        </h1>
                                        {madarsa.meta?.status === "verified" && (
                                            <Badge variant="default" className="text-xs">Verified</Badge>
                                        )}
                                        {madarsa.meta?.status === "pending" && (
                                            <Badge variant="secondary" className="text-xs">Pending Review</Badge>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground flex items-center gap-1.5 mb-2 text-sm md:text-base">
                                        <MapPin className="w-4 h-4" />
                                        {madarsa.location?.city}, {madarsa.location?.state}
                                    </p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        Est. {madarsa.basicInfo?.established}
                                    </p>
                                </div>
                            </div>

                            {/* Madarsa Code Card */}
                            <div className="flex flex-col gap-3 md:items-end">
                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center min-w-[200px]">
                                    <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                                        Madarsa Code
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-2xl font-bold tracking-widest text-foreground">
                                            {madarsa.madarsaCode || "N/A"}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-primary/10"
                                            onClick={copyCode}
                                        >
                                            <Copy className="w-4 h-4 text-primary" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <Link to={`/madarsa/${madarsa.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full gap-2">
                                            <Share2 className="w-4 h-4" />
                                            View Public Profile
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => setIsEditModalOpen(true)}
                                    >
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Tabs */}
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="teachers">Teachers</TabsTrigger>
                            <TabsTrigger value="students">Students</TabsTrigger>
                            <TabsTrigger value="academics">Academics</TabsTrigger>
                        </TabsList>

                        {/* Overview Content */}
                        <TabsContent value="overview" className="space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{madarsa.academic?.totalStudents || 0}</div>
                                        <p className="text-xs text-muted-foreground">Enrolled students</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{madarsa.academic?.teachers || 0}</div>
                                        <p className="text-xs text-muted-foreground">Active faculty</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Staff</CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{madarsa.academic?.staff || 0}</div>
                                        <p className="text-xs text-muted-foreground">Support staff</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Classes</CardTitle>
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{madarsa.academic?.classes?.length || 0}</div>
                                        <p className="text-xs text-muted-foreground">Courses offered</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="col-span-1">
                                    <CardHeader>
                                        <CardTitle>About Madarsa</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {madarsa.description?.about || "No description provided."}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="col-span-1">
                                    <CardHeader>
                                        <CardTitle>Contact Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <span className="text-sm text-muted-foreground">Phone</span>
                                            <span className="text-sm font-medium">{madarsa.contact?.phone}</span>
                                        </div>
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <span className="text-sm text-muted-foreground">Email</span>
                                            <span className="text-sm font-medium">{madarsa.contact?.email}</span>
                                        </div>
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <span className="text-sm text-muted-foreground">Website</span>
                                            <span className="text-sm font-medium">{madarsa.contact?.website || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-sm text-muted-foreground">Mohatmim</span>
                                            <span className="text-sm font-medium">{madarsa.mohatmim?.name}</span>
                                        </div>
                                    </CardContent>
                                </Card>
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
                    onClose={() => setIsEditModalOpen(false)}
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
