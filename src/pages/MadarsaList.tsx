import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import MadarsaCard from "@/components/MadarsaCard";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { Madarsa } from "@/types/madarsa";

const MadarsaList = () => {
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
        {/* Decorative Header Section */}
        <section className="relative py-16 overflow-hidden bg-primary/5">
          <div className="absolute inset-0 opacity-10 geometric-pattern"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-3xl bg-primary shadow-2xl flex items-center justify-center rotate-3">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
              </div>

              <h1 className="font-display text-5xl md:text-6xl font-black text-foreground mb-4 uppercase tracking-tighter">
                Explore Madarsas
              </h1>
              <p className="text-muted-foreground text-lg font-medium mb-10 max-w-xl mx-auto">
                Connecting you to the finest Islamic institutions across our network.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative group">
                <input
                  type="text"
                  placeholder="Search by name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 px-10 rounded-[1.5rem] border-2 border-primary/10 bg-background/80 backdrop-blur-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-2xl transition-all font-semibold"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-primary rounded-2xl text-white shadow-xl">
                  🔍
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-10">
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

            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">
                Results: <span className="text-foreground">{filteredMadarsas.length}</span> Foundations
              </p>
            </div>

            {filteredMadarsas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {filteredMadarsas.map((madarsa, index) => (
                  <MadarsaCard key={madarsa.id} madarsa={madarsa} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-accent/5 rounded-[3rem] border-2 border-dashed border-primary/10">
                <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center grayscale">
                  <span className="text-5xl">🏛️</span>
                </div>
                <h3 className="font-display text-2xl font-black text-foreground mb-3">
                  No Institutions Found
                </h3>
                <p className="text-muted-foreground mb-8 font-medium">
                  Try adjusting your search or filters.
                </p>
                <Button variant="outline" className="h-12 px-8 rounded-2xl border-2 font-black uppercase tracking-widest" onClick={clearFilters}>
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MadarsaList;
