import { useNavigate } from "react-router-dom";
import { ArrowLeft, Layers } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { paraList } from "@/data/quranMetadata";

const ParaIndex = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#092B22] text-[#F3E5AB] font-sans pb-20 relative overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(#F4D03F 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <Header />

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-3xl">
                <button onClick={() => navigate("/quran")} className="flex items-center text-[#F4D03F] mb-6 hover:text-white">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Menu
                </button>

                <h1 className="font-display text-3xl font-bold text-center text-white mb-6">Quran Para (Juz)</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paraList.map((para) => (
                        <div
                            key={para.number}
                            onClick={() => navigate(`/quran/read?type=para&id=${para.number}`)}
                            className="bg-[#10382F]/80 p-4 rounded-lg border border-[#F4D03F]/20 cursor-pointer hover:bg-[#1A5F45] hover:border-[#F4D03F] transition-all group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#06211B] mask-hexagon flex items-center justify-center font-bold text-[#F4D03F] border-2 border-[#F4D03F]/30 group-hover:scale-110 transition-transform relative">
                                    <div className="absolute inset-0 border-2 border-[#F4D03F] rounded-full opacity-20"></div>
                                    {para.number}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-xl group-hover:text-[#F4D03F] transition-colors">{para.name}</h3>
                                    <p className="text-xs text-[#F3E5AB]/60">Juz {para.number}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ParaIndex;
