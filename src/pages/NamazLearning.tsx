import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NamazLearning = () => {
    const navigate = useNavigate();

    const steps = [
        {
            step: 1,
            title: "Niyat (Intention)",
            desc: "Stand upright facing the Qibla. Make a sincere intention in your heart for the specific prayer (e.g., Fajr).",
            arabic: "",
            transliteration: ""
        },
        {
            step: 2,
            title: "Takbir-e-Tahrimah",
            desc: "Raise your hands to your ears (men) or shoulders (women) and say:",
            arabic: "ٱللَّٰهُ أَكْبَرُ",
            transliteration: "Allahu Akbar (Allah is the Greatest)"
        },
        {
            step: 3,
            title: "Qiyam & Sana",
            desc: "Place your hands on your chest/navel (right over left) and recite Sana:",
            arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلاَ إِلَهَ غَيْرُكَ",
            transliteration: "Subhanaka Allahumma wa bihamdika, wa tabaraka ismuka, wa ta'ala jadduka, wa la ilaha ghairuk."
        },
        {
            step: 4,
            title: "Surah Al-Fatiha",
            desc: "Recite Surah Al-Fatiha. This is mandatory in every Rakat.",
            arabic: "ٱلْحَمْدُ لِلَّٰهِ رَبِّ ٱلْعَالَمِينَ ۝ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ۝ مَٰلِكِ يَوْمِ ٱلدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ۝ صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّالِّينَ",
            transliteration: "Alhamdu lillahi rabbil 'alamin. Ar-rahmanir rahim. Maliki yawmid-din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas-siratal mustaqim. Siratal lazina an'amta 'alayhim ghayril maghdubi 'alayhim walad-dallin."
        },
        {
            step: 5,
            title: "Ruku (Bowing)",
            desc: "Say 'Allahu Akbar' and bow down. Recite 3 times:",
            arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
            transliteration: "Subhana Rabbiyal Azeem"
        },
        {
            step: 6,
            title: "Qawmah (Standing Up)",
            desc: "Rise saying 'Sami Allahu Liman Hamidah'. Then say:",
            arabic: "رَبَّنَا لَكَ الْحَمْدُ",
            transliteration: "Rabbana lakal hamd"
        },
        {
            step: 7,
            title: "Sujood (Prostration)",
            desc: "Go down to prostration saying 'Allahu Akbar'. Recite 3 times:",
            arabic: "سُبْحَانَ رَبِّيَ الأَعْلَى",
            transliteration: "Subhana Rabbiyal A'la"
        },
        {
            step: 8,
            title: "Jalsa (Sitting)",
            desc: "Sit up saying 'Allahu Akbar'. Pause, then perform the second Sujood.",
            arabic: "",
            transliteration: ""
        },
        {
            step: 9,
            title: "Tashahhud (At-Tahiyyat)",
            desc: "In the final sitting, recite At-Tahiyyat:",
            arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلاَمُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ. أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
            transliteration: "At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu 'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. As-salamu 'alayna wa 'ala 'ibadillahis-salihin. Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan 'abduhu wa rasuluh."
        },
        {
            step: 10,
            title: "Durood-e-Ibrahim",
            desc: "Recite the Salawat (Durood):",
            arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
            transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammadin kama sallayta 'ala Ibrahima wa 'ala ali Ibrahima innaka Hamidum-Majid. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammadin kama barakta 'ala Ibrahima wa 'ala ali Ibrahima innaka Hamidum-Majid."
        },
        {
            step: 11,
            title: "Dua (Supplication)",
            desc: "Recite a Dua before ending the prayer:",
            arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
            transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar."
        },
        {
            step: 12,
            title: "Salam (Ending)",
            desc: "Turn your face to the right seeking peace, then to the left.",
            arabic: "السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ",
            transliteration: "Assalamu Alaikum wa Rahmatullah"
        },
        {
            step: 13,
            title: "Dua After Salam",
            desc: "After completing the prayer, recite this Dua:",
            arabic: "اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ",
            transliteration: "Allahumma Antas-Salamu wa minkas-salamu tabarakta ya Dhal-Jalali wal-Ikram."
        }
    ];

    return (
        <div className="min-h-screen bg-[#092B22] text-[#F3E5AB] font-sans pb-20 relative overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(#F4D03F 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <Header />

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-3xl">
                <button onClick={() => navigate("/namaz")} className="flex items-center text-[#F4D03F] mb-6 hover:text-white">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Guide
                </button>

                <h1 className="font-display text-3xl md:text-4xl font-bold text-center text-white mb-2">How to Perform Salah</h1>
                <p className="text-center text-[#F3E5AB]/70 mb-10">Step-by-Step Guide for Beginners (Hanafi Method)</p>

                <div className="space-y-8 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[27px] md:left-[35px] top-4 bottom-4 w-1 bg-[#F4D03F]/20 rounded-full hidden sm:block"></div>

                    {steps.map((s, i) => (
                        <div key={i} className="relative flex flex-col sm:flex-row gap-6 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                            {/* Step Number Bubble */}
                            <div className="hidden sm:flex flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-[#092B22] border-2 border-[#F4D03F] rounded-full items-center justify-center z-10 font-bold text-xl md:text-2xl text-[#F4D03F] shadow-[0_0_15px_rgba(244,208,63,0.3)]">
                                {s.step}
                            </div>

                            {/* Content Card */}
                            <div className="flex-grow bg-[#10382F] border border-[#F4D03F]/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-[#F4D03F] transition-all">
                                {/* Mobile Step Badge */}
                                <div className="sm:hidden absolute top-0 right-0 bg-[#F4D03F] text-[#092B22] font-bold px-3 py-1 rounded-bl-xl">
                                    Step {s.step}
                                </div>

                                <h3 className="font-display text-2xl font-bold text-white mb-2 group-hover:text-[#F4D03F] transition-colors">{s.title}</h3>
                                <p className="text-[#F3E5AB]/90 mb-4 leading-relaxed">{s.desc}</p>

                                {s.arabic && (
                                    <div className="bg-[#06211B] rounded-xl p-4 border border-[#F4D03F]/10 mb-4 relative">
                                        <p className="font-arabic text-2xl text-right text-white dir-rtl mb-2 leading-loose">
                                            {s.arabic}
                                        </p>
                                        <p className="text-sm text-[#F4D03F]/70 italic border-t border-[#F4D03F]/10 pt-2">
                                            "{s.transliteration}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-[#1A5F45]/50 rounded-xl border border-[#F4D03F]/30 text-center">
                    <CheckCircle2 className="w-12 h-12 text-[#F4D03F] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Prayer Completed!</h3>
                    <p className="text-[#F3E5AB]/80">
                        This guide covers a standard 2-Rakat prayer. For 3 or 4 Rakats, you stand up after Tashahhud instead of saying Salam.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default NamazLearning;
