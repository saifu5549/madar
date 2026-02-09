import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Shield, Users, BookOpen, Globe,
  ArrowRight, CheckCircle2, Target, Heart
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Role-based access control ensures only authorized admins can make changes."
    },
    {
      icon: Users,
      title: "Complete Management",
      description: "Manage students, teachers, staff, classes, exams, and results all in one place."
    },
    {
      icon: BookOpen,
      title: "Digital Records",
      description: "Maintain digital records of attendance, marks, and student progress."
    },
    {
      icon: Globe,
      title: "Public Directory",
      description: "Help people discover madarsas across India with our searchable directory."
    }
  ];

  const values = [
    "Promoting transparency in Islamic education",
    "Connecting madarsas across India",
    "Digitizing traditional institutions",
    "Empowering educators with modern tools",
    "Building trust through verified profiles"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="hero-gradient py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              About <span className="text-gradient-primary">Madarsa Directory</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              India's first comprehensive platform connecting Islamic educational institutions.
              We're on a mission to digitize and bring transparency to madarsa education.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Target className="w-4 h-4" />
                  Our Mission
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Transforming Islamic Education Through Technology
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  We believe every madarsa, regardless of size, deserves access to modern
                  management tools. Our platform makes it easy to manage students, teachers,
                  and operations while maintaining the essence of traditional Islamic education.
                </p>

                <ul className="space-y-3">
                  {values.map((value, index) => (
                    <li key={index} className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative">
                <div className="bg-card rounded-3xl border border-border p-8 shadow-lg">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-accent mx-auto mb-6 flex items-center justify-center">
                      <Heart className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                      Built with Purpose
                    </h3>
                    <p className="text-muted-foreground">
                      Created by a team passionate about preserving and modernizing
                      Islamic education in India.
                    </p>
                  </div>
                </div>
                {/* Decorative */}
                <div className="absolute -z-10 -top-4 -right-4 w-full h-full bg-primary/10 rounded-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-20 bg-accent/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                What We Offer
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A complete ecosystem for madarsa management and discovery.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl border border-border p-6 text-center card-elevated"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Join?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Add your madarsa to India's largest directory and start managing
              your institution digitally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/madarsas">
                <Button variant="outline" size="lg" className="gap-2">
                  Browse Madarsas
                </Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button variant="hero" size="lg" className="gap-2">
                  Add Your Madarsa
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
