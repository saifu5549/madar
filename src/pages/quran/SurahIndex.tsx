import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Book } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { surahList } from "@/data/quranMetadata";

const SurahIndex = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSurahs = surahList.filter(surah =>
        surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.number.toString().includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-[#092B22] text-[#F3E5AB] font-sans pb-20 relative overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(#F4D03F 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <Header />

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-3xl">
                <button onClick={() => navigate("/quran")} className="flex items-center text-[#F4D03F] mb-6 hover:text-white">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Menu
                </button>

                <h1 className="font-display text-3xl font-bold text-center text-white mb-6">Surah Index</h1>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F4D03F]/50 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search Surah Name or Number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#10382F] border border-[#F4D03F]/30 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#F4D03F] shadow-inner"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSurahs.map((surah) => (
                        <div
                            key={surah.number}
                            onClick={() => navigate(`/quran/read?type=surah&id=${surah.number}`)}
                            className="bg-[#10382F]/80 p-4 rounded-lg border border-[#F4D03F]/20 cursor-pointer hover:bg-[#1A5F45] hover:border-[#F4D03F] transition-all group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#06211B] rounded-full flex items-center justify-center font-bold text-[#F4D03F] border border-[#F4D03F]/30 group-hover:scale-110 transition-transform">
                                    {surah.number}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg group-hover:text-[#F4D03F] transition-colors">{surah.name}</h3>
                                    <p className="text-xs text-[#F3E5AB]/60">{surah.englishName} • {surah.verses} Verses</p>
                                </div>
                            </div>
                            <div className="text-xs px-2 py-1 rounded bg-[#092B22] text-[#F3E5AB]/50 border border-[#F4D03F]/10">
                                {surah.revelationType}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SurahIndex;
