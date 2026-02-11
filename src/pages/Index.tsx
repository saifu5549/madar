import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import SearchFilters from "@/components/SearchFilters";
import MadarsaCard from "@/components/MadarsaCard";
import { ArrowRight, Building2, GraduationCap, Users, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { Madarsa } from "@/types/madarsa";

const Index = () => {
  const { t } = useTranslation();
  const [madarsas, setMadarsas] = useState<Madarsa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const q = query(collection(db, "madarsas"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Madarsa[];
      setMadarsas(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching madarsas:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Get unique cities based on selected state
  const cities = useMemo(() => {
    if (!selectedState || selectedState === "all") return [];
    const stateMadarsas = madarsas.filter((m) => (m.location?.state || m.state) === selectedState);
    return [...new Set(stateMadarsas.map((m) => m.location?.city || m.city))].filter(Boolean) as string[];
  }, [selectedState, madarsas]);

  // Filter madarsas
  const filteredMadarsas = useMemo(() => {
    return madarsas.filter((madarsa) => {
      const name = madarsa.basicInfo?.nameEnglish || madarsa.name || "";
      const city = madarsa.location?.city || madarsa.city || "";
      const state = madarsa.location?.state || madarsa.state || "";

      const matchesSearch =
        searchQuery === "" ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState =
        !selectedState || selectedState === "all" || state === selectedState;

      const matchesCity =
        !selectedCity || selectedCity === "all" || city === selectedCity;

      return matchesSearch && matchesState && matchesCity;
    });
  }, [searchQuery, selectedState, selectedCity, madarsas]);

  const hasActiveFilters = searchQuery !== "" || !!(selectedState && selectedState !== "all");

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedState("");
    setSelectedCity("");
  };

  // Calculate live stats for Hero section
  const stats = useMemo(() => {
    return madarsas.reduce((acc, m) => ({
      madarsas: acc.madarsas + 1,
      students: acc.students + (m.academic?.totalStudents || m.totalStudents || 0),
      teachers: acc.teachers + (m.academic?.teachers || m.totalTeachers || 0),
    }), { madarsas: 0, students: 0, teachers: 0 });
  }, [madarsas]);

  // Featured madarsas (verified ones)
  const featuredMadarsas = useMemo(() => {
    return filteredMadarsas.filter((m) => m.meta?.status === 'verified' || m.meta?.status === undefined).slice(0, 6);
  }, [filteredMadarsas]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection stats={stats} />

        {/* Features Section - User Roles */}
        <section className="py-16 md:py-20 bg-accent/30">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                {t('features.title')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('features.subtitle')}
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Mohatmin Card */}
              <div className="group relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 card-elevated hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>

                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  {t('features.mohatmin.title')}
                </h3>
                <p className="text-sm text-muted-foreground mb-1 font-medium">
                  ({t('features.mohatmin.subtitle')})
                </p>

                <ul className="space-y-2 mb-6 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{t('features.mohatmin.feature1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{t('features.mohatmin.feature2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{t('features.mohatmin.feature3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{t('features.mohatmin.feature4')}</span>
                  </li>
                </ul>

                <Link to="/add-madarsa">
                  <Button variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {t('features.mohatmin.cta')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Ustaad Card */}
              <div className="group relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 card-elevated hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8 text-secondary" />
                </div>

                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  {t('features.ustaad.title')}
                </h3>
                <p className="text-sm text-muted-foreground mb-1 font-medium">
                  ({t('features.ustaad.subtitle')})
                </p>

                <ul className="space-y-2 mb-6 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span className="text-sm">{t('features.ustaad.feature1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span className="text-sm">{t('features.ustaad.feature2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span className="text-sm">{t('features.ustaad.feature3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span className="text-sm">{t('features.ustaad.feature4')}</span>
                  </li>
                </ul>

                <Link to="/auth">
                  <Button variant="outline" className="w-full gap-2 group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                    {t('features.ustaad.cta')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Talib Ilm/Walden Card */}
              <div className="group relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 card-elevated hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-primary" />
                </div>

                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  {t('features.talib.title')}
                </h3>
                <p className="text-sm text-muted-foreground mb-1 font-medium">
                  ({t('features.talib.subtitle')})
                </p>

                <ul className="space-y-2 mb-6 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{t('features.talib.feature1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{t('features.talib.feature2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{t('features.talib.feature3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{t('features.talib.feature4')}</span>
                  </li>
                </ul>

                <Link to="#find-madarsa">
                  <Button variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {t('features.talib.cta')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Directory Section */}
        <section className="py-12 md:py-16" id="find-madarsa">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                {t('findMadarsa.title')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('findMadarsa.subtitle')}
              </p>
            </div>

            {/* Search Filters */}
            <div className="mb-8">
              <SearchFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                cities={cities}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {t('findMadarsa.showing')} <span className="font-semibold text-foreground">{filteredMadarsas.length}</span> {t('findMadarsa.madarsas')}
              </p>
              <Link to="/madarsas">
                <Button variant="ghost" className="gap-2 text-primary">
                  {t('findMadarsa.viewAll')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Madarsa Cards Grid */}
            {filteredMadarsas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredMadarsas.map((madarsa: Madarsa, index: number) => (
                  <MadarsaCard key={madarsa.id} madarsa={madarsa} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {t('findMadarsa.noResults')}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t('findMadarsa.noResultsDesc')}
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  {t('findMadarsa.clearFilters')}
                </Button>
              </div>
            )}

            {/* View All Link */}
            {filteredMadarsas.length > 6 && (
              <div className="text-center mt-10">
                <Link to="/madarsas">
                  <Button variant="outline" size="lg" className="gap-2">
                    {t('findMadarsa.viewAll')} {filteredMadarsas.length} {t('findMadarsa.madarsas')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-foreground text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {t('cta.title')}
              </h2>
              <p className="text-primary-foreground/80 mb-8 text-lg">
                {t('cta.subtitle')}
              </p>
              <Link to="/auth?mode=register">
                <Button variant="gold" size="xl" className="gap-2">
                  {t('cta.button')}
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

export default Index;
