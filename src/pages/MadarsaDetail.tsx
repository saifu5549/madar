import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Phone, Mail, Calendar, Users, 
  GraduationCap, BookOpen, BadgeCheck, Building2 
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockMadarsas } from "@/data/mockMadarsas";

const MadarsaDetail = () => {
  const { id } = useParams();
  const madarsa = mockMadarsas.find((m) => m.id === id);

  if (!madarsa) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl">🕌</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Madarsa Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The madarsa you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/">
              <Button variant="outline" className="gap-2">
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
        <div className="bg-accent/30">
          <div className="container mx-auto px-4 py-4">
            <Link 
              to="/madarsas" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Madarsas
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-accent/30 pb-10 pt-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Logo/Icon */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-card flex items-center justify-center shadow-md border border-border flex-shrink-0">
                <span className="text-5xl md:text-6xl">🕌</span>
              </div>

              {/* Info */}
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                    {madarsa.name}
                  </h1>
                  {madarsa.isVerified && (
                    <Badge className="bg-primary text-primary-foreground gap-1">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{madarsa.city}, {madarsa.district}, {madarsa.state}</span>
                  </div>
                  {madarsa.establishedYear && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Est. {madarsa.establishedYear}</span>
                    </div>
                  )}
                </div>

                {madarsa.description && (
                  <p className="text-muted-foreground max-w-2xl">
                    {madarsa.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-2xl border border-border p-6 text-center card-elevated">
                <div className="w-12 h-12 rounded-xl bg-accent mx-auto mb-3 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <p className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {madarsa.totalStudents.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 text-center card-elevated">
                <div className="w-12 h-12 rounded-xl bg-accent mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <p className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {madarsa.totalTeachers}
                </p>
                <p className="text-sm text-muted-foreground">Teachers</p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 text-center card-elevated">
                <div className="w-12 h-12 rounded-xl bg-accent mx-auto mb-3 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <p className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {madarsa.totalStaff}
                </p>
                <p className="text-sm text-muted-foreground">Staff Members</p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 text-center card-elevated">
                <div className="w-12 h-12 rounded-xl bg-accent mx-auto mb-3 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <p className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {madarsa.classes.length}
                </p>
                <p className="text-sm text-muted-foreground">Classes Offered</p>
              </div>
            </div>
          </div>
        </section>

        {/* Details Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Classes */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Classes Offered
                </h2>
                <div className="flex flex-wrap gap-2">
                  {madarsa.classes.map((cls) => (
                    <Badge key={cls} variant="secondary" className="text-sm py-1.5 px-3">
                      {cls}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="text-foreground">
                        {madarsa.address}, {madarsa.city}, {madarsa.district}, {madarsa.state}
                      </p>
                    </div>
                  </div>

                  {madarsa.contactNumber && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="text-foreground">{madarsa.contactNumber}</p>
                      </div>
                    </div>
                  )}

                  {madarsa.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-foreground">{madarsa.email}</p>
                      </div>
                    </div>
                  )}
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
