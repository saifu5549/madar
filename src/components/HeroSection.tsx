import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Search, BookOpen, Users, School } from "lucide-react";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="relative hero-gradient geometric-pattern overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {t('hero.badge')}
          </div>

          {/* Heading */}
          <h1
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            {t('hero.title')}{" "}
            <span className="text-gradient-primary">{t('hero.titleHighlight')}</span>
            <br />
            {t('hero.titleEnd')}
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <Link to="/madarsas">
              <Button variant="hero" size="xl" className="w-full sm:w-auto gap-2">
                <Search className="w-5 h-5" />
                {t('hero.browseMadarsas')}
              </Button>
            </Link>
            <Link to="/auth?mode=register">
              <Button variant="outline" size="xl" className="w-full sm:w-auto gap-2">
                <Plus className="w-5 h-5" />
                {t('hero.addYourMadarsa')}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-xl mx-auto animate-fade-up"
            style={{ animationDelay: "400ms" }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <School className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="font-display text-2xl md:text-3xl font-bold text-foreground">500+</p>
              <p className="text-sm text-muted-foreground">{t('hero.statsCountMadarsas')}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <p className="font-display text-2xl md:text-3xl font-bold text-foreground">50K+</p>
              <p className="text-sm text-muted-foreground">{t('hero.statsCountStudents')}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="font-display text-2xl md:text-3xl font-bold text-foreground">5K+</p>
              <p className="text-sm text-muted-foreground">{t('hero.statsCountTeachers')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default HeroSection;
