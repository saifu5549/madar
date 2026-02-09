import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Bookmark, Info, Layers } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const QuranMenu = () => {
    const navigate = useNavigate();

    // Menu Options
    const menuOptions = [
        {
            title: "RESUME",
            subtitle: "Continue where you left off",
            icon: <Bookmark className="w-10 h-10 text-[#F4D03F]" />,
            path: "/quran/resume",
            color: "bg-emerald-900/40"
        },
        {
            title: "PARE (JUZ)",
            subtitle: "Read by 30 Parts",
            icon: <Layers className="w-10 h-10 text-[#F4D03F]" />,
            path: "/quran/pare",
            color: "bg-emerald-900/40"
        },
        {
            title: "SURAH",
            subtitle: "114 Chapters",
            icon: <BookOpen className="w-10 h-10 text-[#F4D03F]" />,
            path: "/quran/surah",
            color: "bg-emerald-900/40"
        },
        {
            title: "ABOUT QURAN",
            subtitle: "History & Importance",
            icon: <Info className="w-10 h-10 text-[#F4D03F]" />,
            path: "/quran/about",
            color: "bg-emerald-900/40"
        }
    ];

    return (
        <div className="min-h-screen bg-[#092B22] text-[#F3E5AB] font-sans pb-20 relative overflow-x-hidden">
            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(#F4D03F 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <Header />

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-lg">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center text-[#F4D03F] mb-8 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                </button>

                <div className="text-center mb-10 animate-fade-down">
                    <h1 className="font-display text-4xl font-bold text-white mb-2 drop-shadow-md">
                        Quran Sharif
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#F4D03F] to-transparent mx-auto"></div>
                </div>

                <div className="space-y-4">
                    {menuOptions.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(item.path)}
                            className={`group relative p-4 flex items-center border border-[#F4D03F]/30 rounded-xl cursor-pointer hover:bg-[#10382F] hover:border-[#F4D03F] transition-all duration-300 shadow-lg backdrop-blur-sm ${item.color}`}
                        >
                            {/* Decorative Line Left */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F4D03F]/50 rounded-l-xl group-hover:bg-[#F4D03F] transition-colors"></div>

                            {/* Icon Container */}
                            <div className="w-16 h-16 rounded-full bg-[#06211B] border border-[#F4D03F]/20 flex items-center justify-center mr-5 shadow-inner group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>

                            {/* Text */}
                            <div className="flex-grow">
                                <h2 className="font-display text-xl font-bold text-white tracking-wide group-hover:text-[#F4D03F] transition-colors">
                                    {item.title}
                                </h2>
                                <p className="text-[#F3E5AB]/70 text-xs uppercase tracking-wider font-medium">
                                    {item.subtitle}
                                </p>
                            </div>

                            {/* Arrow */}
                            <div className="opacity-50 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all">
                                <span className="text-2xl text-[#F4D03F]">›</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default QuranMenu;
