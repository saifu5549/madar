import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Info } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutQuran = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#092B22] text-[#F3E5AB] font-sans pb-20 relative overflow-x-hidden">
            {/* Background Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(#F4D03F 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <Header />

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-2xl">
                <button
                    onClick={() => navigate("/quran")}
                    className="flex items-center text-[#F4D03F] mb-6 hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Menu
                </button>

                <div className="bg-[#10382F] p-8 rounded-xl border border-[#F4D03F] shadow-2xl relative">
                    {/* Decorative Header */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-[#06211B] rounded-full flex items-center justify-center border border-[#F4D03F]/50">
                            <Info className="w-8 h-8 text-[#F4D03F]" />
                        </div>
                    </div>

                    <h1 className="font-display text-3xl font-bold text-center text-white mb-2">
                        About The Holy Quran
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#F4D03F] to-transparent mx-auto mb-8"></div>

                    <div className="space-y-6 text-[#F3E5AB]/90 leading-relaxed text-justify">
                        <p>
                            The <strong className="text-white">Holy Quran</strong> is the central religious text of Islam, believed by Muslims to be a revelation from God (Allah). It is widely regarded as the finest work in classical Arabic literature.
                        </p>

                        <div className="bg-[#092B22]/50 p-4 rounded-lg border-l-4 border-[#F4D03F]">
                            <h3 className="font-bold text-[#F4D03F] mb-1 flex items-center gap-2">
                                <Star className="w-4 h-4" /> Revelation
                            </h3>
                            <p className="text-sm">
                                The Quran was verbally revealed by God to the final prophet, <strong className="text-white">Muhammad (PBUH)</strong>, through the archangel Gabriel (Jibril), incrementally over a period of some 23 years.
                            </p>
                        </div>

                        <p>
                            The Quran is divided into chapters (surah) and verses (ayat). There are <strong>114 Surahs</strong> in the Quran, each divided into verses. The chapters are classified as Meccan or Medinan, depending on the time and place of their revelation.
                        </p>

                        <div className="bg-[#092B22]/50 p-4 rounded-lg border-l-4 border-[#F4D03F]">
                            <h3 className="font-bold text-[#F4D03F] mb-1 flex items-center gap-2">
                                <Star className="w-4 h-4" /> Importance
                            </h3>
                            <p className="text-sm">
                                Muslims believe the Quran to be the book of divine guidance and direction for mankind. It is the final testament in a series of divine messages that started with the messages revealed to Adam and ended with Muhammad (PBUH).
                            </p>
                        </div>

                        <p>
                            Reciting the Quran is a core practice in Islam. It is recited in daily prayers (Salah) and is a source of immense spiritual reward.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutQuran;
