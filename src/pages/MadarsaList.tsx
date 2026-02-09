import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import MadarsaCard from "@/components/MadarsaCard";
import { mockMadarsas } from "@/data/mockMadarsas";
import { Button } from "@/components/ui/button";
import { BookOpen, Filter } from "lucide-react";

const MadarsaList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Get unique cities based on selected state
  const cities = useMemo(() => {
    if (!selectedState || selectedState === "all") return [];
    const stateMadarsas = mockMadarsas.filter((m) => m.state === selectedState);
    return [...new Set(stateMadarsas.map((m) => m.city))];
  }, [selectedState]);

  // Filter madarsas
  const filteredMadarsas = useMemo(() => {
    return mockMadarsas.filter((madarsa) => {
      const matchesSearch =
        searchQuery === "" ||
        madarsa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        madarsa.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState =
        !selectedState || selectedState === "all" || madarsa.state === selectedState;

      const matchesCity =
        !selectedCity || selectedCity === "all" || madarsa.city === selectedCity;

      return matchesSearch && matchesState && matchesCity;
    });
  }, [searchQuery, selectedState, selectedCity]);

  const hasActiveFilters = searchQuery !== "" || (selectedState && selectedState !== "all");

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedState("");
    setSelectedCity("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow">
        {/* Decorative Header Section - Islamic Arch Style */}
        <section className="relative py-12 md:py-16 overflow-hidden" style={{ background: 'var(--gradient-header)' }}>
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="geometric-pattern w-full h-full"></div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              {/* Quran Icon */}
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 border-2 border-secondary/40 flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="w-8 h-8 text-secondary" />
                </div>
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-3">
                Madarsa Directory
              </h1>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto mt-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search madarsas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-3.5 rounded-full border-2 border-secondary/30 bg-card/95 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary shadow-lg transition-all"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button className="w-8 h-8 rounded-full bg-card flex items-center justify-center">
                      🔍
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                <button className="px-4 py-2 rounded-full bg-primary/80 text-primary-foreground text-sm font-medium hover:bg-primary transition-colors">
                  All Madarsas
                </button>
                <button className="px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm text-foreground text-sm font-medium hover:bg-card border border-border/30 transition-colors flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  By Country
                </button>
                <button className="px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm text-foreground text-sm font-medium hover:bg-card border border-border/30 transition-colors flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  By Country
                </button>
                <button className="px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm text-foreground text-sm font-medium hover:bg-card border border-border/30 transition-colors">
                  Boys madarsas
                </button>
                <button className="px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm text-foreground text-sm font-medium hover:bg-card border border-border/30 transition-colors flex items-center gap-1.5">
                  <span className="text-xs">📚</span>
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Decorative Bottom Border */}
          <div className="absolute bottom-0 left-0 right-0 h-2" style={{
            background: 'linear-gradient(90deg, transparent, var(--gradient-gold), transparent)'
          }}></div>
        </section>

        {/* Search & List Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {/* Advanced Filters - Collapsible */}
            <div className="mb-6">
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
              <p className="text-muted-foreground text-sm">
                Showing <span className="font-semibold text-foreground">{filteredMadarsas.length}</span> madarsas
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Sort by:</span>
                <select className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-sm">
                  <option>All Madarsas</option>
                  <option>Most Students</option>
                  <option>Recently Added</option>
                </select>
              </div>
            </div>

            {/* Madarsa Cards Grid */}
            {filteredMadarsas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredMadarsas.map((madarsa, index) => (
                  <MadarsaCard key={madarsa.id} madarsa={madarsa} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No Madarsas Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
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
