import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, MapPin, Phone, Mail, Calendar, Users,
  GraduationCap, BookOpen, BadgeCheck, Building2, Loader2, Edit3
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const MadarsaDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [madarsa, setMadarsa] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMadarsa = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "madarsas", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMadarsa({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching madarsa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMadarsa();
  }, [id]);

  if (loading) {
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
            <h1 className="font-display text-2xl font-bold mb-3">Madarsa Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The madarsa you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/">
              <Button size="lg" className="w-full gap-2 border-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
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

      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-accent/30 drop-shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <Link
              to="/madarsas"
              className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              Explore All Madarsas
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-6 pb-20">
          {/* Cover Photo Area */}
          <div className="absolute inset-x-0 top-0 h-64 md:h-[22rem] w-full overflow-hidden">
            {madarsa.media?.coverPhoto ? (
              <img
                src={madarsa.media.coverPhoto}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 geometric-pattern opacity-95" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          <div className="container mx-auto px-4 relative pt-32 md:pt-40">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              {/* Logo/Icon */}
              <div className="w-32 h-32 md:w-52 md:h-52 rounded-[2.5rem] bg-background p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border-4 border-background flex-shrink-0 z-10 transform transition-transform hover:scale-105 duration-500">
                <div className="w-full h-full rounded-[2rem] bg-muted overflow-hidden flex items-center justify-center border border-border/50">
                  {madarsa.media?.logo ? (
                    <img
                      src={madarsa.media.logo}
                      alt={madarsa.basicInfo?.nameEnglish}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-20 h-20 text-primary/10" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-grow pb-4 z-10 w-full md:w-auto">
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] leading-none uppercase">
                      {madarsa.basicInfo?.nameEnglish}
                    </h1>
                    {madarsa.meta?.status === 'verified' && (
                      <Badge className="bg-primary text-primary-foreground h-10 px-6 text-xs font-black tracking-[0.2em] gap-2 shadow-2xl border-2 border-white/20 rounded-full">
                        <BadgeCheck className="w-5 h-5" />
                        OFFICIALLY VERIFIED
                      </Badge>
                    )}
                    {user?.uid === madarsa.meta?.createdBy && (
                      <Link to="/my-madarsa">
                        <Button variant="secondary" className="h-10 px-6 text-xs font-black gap-2 shadow-2xl border-2 border-white/20 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40">
                          <Edit3 className="w-4 h-4" />
                          EDIT PROFILE
                        </Button>
                      </Link>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-2xl border border-white/20 px-6 py-2.5 rounded-2xl shadow-2xl">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-white font-black tracking-widest text-sm uppercase">{madarsa.location?.city}, {madarsa.location?.state}</span>
                    </div>
                    {madarsa.basicInfo?.established && (
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-2xl border border-white/20 px-6 py-2.5 rounded-2xl shadow-2xl">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="text-white font-black tracking-widest text-sm uppercase">EST. {madarsa.basicInfo.established}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        {madarsa.description?.about && (
          <section className="py-16 bg-accent/5 geometric-pattern">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-block p-2 px-6 bg-primary/10 rounded-full mb-8 border border-primary/20">
                  <span className="text-xs font-black tracking-[0.5em] text-primary uppercase">OUR VISION</span>
                </div>
                <p className="text-2xl md:text-3xl text-foreground font-medium leading-relaxed italic opacity-85">
                  "{madarsa.description.about}"
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Stats Section with Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Total Students", value: madarsa.academic?.totalStudents || 0, icon: GraduationCap, color: "from-blue-500/10 to-blue-500/5", iconColor: "text-blue-600" },
                { title: "Teachers", value: madarsa.academic?.teachers || 0, icon: Users, color: "from-emerald-500/10 to-emerald-500/5", iconColor: "text-emerald-600" },
                { title: "Staff Members", value: madarsa.academic?.staff || 0, icon: Building2, color: "from-amber-500/10 to-amber-500/5", iconColor: "text-amber-600" },
                { title: "Active Courses", value: madarsa.academic?.classes?.length || 0, icon: BookOpen, color: "from-purple-500/10 to-purple-500/5", iconColor: "text-purple-600" },
              ].map((stat, i) => (
                <div key={i} className={`premium-card p-10 flex flex-col items-center justify-center gap-4 group transition-all hover:scale-105 bg-gradient-to-br ${stat.color} border-2 border-primary/5`}>
                  <div className="p-5 rounded-[2rem] bg-background shadow-xl group-hover:rotate-12 transition-transform duration-500">
                    <stat.icon className={`w-10 h-10 ${stat.iconColor}`} />
                  </div>
                  <div className="text-center">
                    <p className="text-5xl font-black tracking-tighter mb-1">{stat.value.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">{stat.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Academic & Facilities Grid */}
        <section className="py-20 pb-32 bg-accent/5">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Academic Offerings & Facilities */}
              <div className="lg:col-span-2 space-y-12">
                {madarsa.academic?.classes && madarsa.academic.classes.length > 0 && (
                  <div className="premium-card p-10 md:p-14 rounded-[3.5rem]">
                    <div className="flex items-center gap-6 mb-12">
                      <div className="p-4 rounded-3xl bg-primary shadow-xl shadow-primary/20">
                        <BookOpen className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black tracking-tight uppercase">Academic Offerings</h2>
                        <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Educational Programs Available</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-5">
                      {madarsa.academic.classes.map((cls: string) => (
                        <div key={cls} className="px-8 py-4 rounded-2xl bg-muted/50 border-2 border-border/50 text-sm font-black tracking-widest uppercase hover:bg-primary transition-all cursor-default hover:text-white hover:border-primary group">
                          {cls}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {madarsa.facilities && Object.entries(madarsa.facilities).some(([_, val]) => val) && (
                  <div className="premium-card p-10 md:p-14 rounded-[3.5rem]">
                    <div className="flex items-center gap-6 mb-12">
                      <div className="p-4 rounded-3xl bg-emerald-500 shadow-xl shadow-emerald-500/20">
                        <BadgeCheck className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black tracking-tight uppercase">Campus Facilities</h2>
                        <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">What we provide on campus</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                      {Object.entries(madarsa.facilities).filter(([_, val]) => val).map(([key, _]) => (
                        <div key={key} className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 group hover:bg-emerald-500/10 transition-colors">
                          <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-black text-xs uppercase tracking-widest opacity-80">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Info Card */}
              <div className="space-y-8">
                <div className="premium-card p-10 md:p-12 rounded-[3.5rem] sticky top-8 border-2 border-primary/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]">
                  <h2 className="text-3xl font-black tracking-tight uppercase mb-12">Contact Details</h2>

                  <div className="space-y-10">
                    <div className="flex items-start gap-6">
                      <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                        <MapPin className="w-7 h-7" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">OFFICIAL ADDRESS</p>
                        <p className="font-black text-foreground leading-relaxed">
                          {madarsa.location?.address}<br />
                          {madarsa.location?.city}, {madarsa.location?.state}
                        </p>
                      </div>
                    </div>

                    {madarsa.contact?.phone && (
                      <div className="flex items-start gap-6">
                        <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                          <Phone className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">PHONE NUMBER</p>
                          <p className="font-black text-foreground">{madarsa.contact.phone}</p>
                        </div>
                      </div>
                    )}

                    {madarsa.contact?.email && (
                      <div className="flex items-start gap-6">
                        <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                          <Mail className="w-7 h-7" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">EMAIL ADDRESS</p>
                          <p className="font-black text-foreground truncate">{madarsa.contact.email}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-14 pt-10 border-t-2 border-primary/5">
                    <Button className="w-full h-20 rounded-[1.75rem] font-black text-base shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.5)] active:scale-95 transition-all uppercase tracking-widest gap-4">
                      Send Message
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MadarsaDetail;
