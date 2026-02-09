import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Sun, Moon, Sunset, Sunrise } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NamazGuide = () => {
    const navigate = useNavigate();

    const prayers = [
        { name: "Fajr", time: "Before Sunrise", rakats: "2 Sunnah, 2 Fard", icon: <Sunrise className="w-6 h-6 text-[#F4D03F]" /> },
        { name: "Dhuhr", time: "After Noon", rakats: "4 Sunnah, 4 Fard, 2 Sunnah, 2 Nafl", icon: <Sun className="w-6 h-6 text-[#F4D03F]" /> },
        { name: "Asr", time: "Late Afternoon", rakats: "4 Sunnah, 4 Fard", icon: <Sun className="w-6 h-6 text-orange-400" /> },
        { name: "Maghrib", time: "After Sunset", rakats: "3 Fard, 2 Sunnah, 2 Nafl", icon: <Sunset className="w-6 h-6 text-red-400" /> },
        { name: "Isha", time: "Night", rakats: "4 Sunnah, 4 Fard, 2 Sunnah, 2 Nafl, 3 Witr", icon: <Moon className="w-6 h-6 text-blue-300" /> },
    ];

    return (
        <div className="min-h-screen bg-[#092B22] text-[#F3E5AB] font-sans pb-20 relative overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(#F4D03F 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <Header />

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-2xl">
                <button onClick={() => navigate("/")} className="flex items-center text-[#F4D03F] mb-6 hover:text-white">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                </button>

                <h1 className="font-display text-3xl font-bold text-center text-white mb-4">Daily Salah (Namaz)</h1>

                {/* Learn Namaz CTA */}
                <div className="mb-8 flex justify-center">
                    <button
                        onClick={() => navigate("/namaz/learn")}
                        className="bg-gradient-to-r from-[#F4D03F] to-[#D4AF37] text-[#092B22] font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(244,208,63,0.4)] hover:shadow-[0_0_30px_rgba(244,208,63,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                        <span>📖</span> Namaz Sikhe (Learn Step-by-Step)
                    </button>
                </div>

                <div className="space-y-4">
                    {prayers.map((p, i) => (
                        <div key={i} className="bg-[#10382F] p-4 rounded-xl border border-[#F4D03F]/20 flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#06211B] rounded-full border border-[#F4D03F]/30">
                                    {p.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{p.name}</h3>
                                    <p className="text-sm text-[#F3E5AB]/70 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {p.time}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-mono text-[#F4D03F] bg-[#092B22] px-2 py-1 rounded border border-[#F4D03F]/30">
                                    {p.rakats}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center text-sm text-[#F3E5AB]/60 italic">
                    * Prayer times vary by location. Please check your local mosque timetable.
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default NamazGuide;
