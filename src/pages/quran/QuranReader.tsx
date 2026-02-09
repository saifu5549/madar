import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Interface for Verse Data
interface Verse {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
}

const QuranReader = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const type = searchParams.get("type"); // 'surah' or 'para'
    const id = searchParams.get("id");

    const [verses, setVerses] = useState<Verse[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!type || !id) {
            navigate("/quran");
            return;
        }
        fetchQuranData();
    }, [type, id]);

    const fetchQuranData = async () => {
        setLoading(true);
        setError(false);
        try {
            // Using Al Quran Cloud API (Uthmani Script)
            // Surah API: http://api.alquran.cloud/v1/surah/{id}
            // Juz API: http://api.alquran.cloud/v1/juz/{id}/quran-uthmani

            let url = "";
            if (type === "surah") {
                url = `https://api.alquran.cloud/v1/surah/${id}`;
            } else if (type === "para") {
                url = `https://api.alquran.cloud/v1/juz/${id}/quran-uthmani`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.code === 200) {
                if (type === "surah") {
                    setVerses(data.data.ayahs);
                    setTitle(`Surah ${data.data.englishName} (${data.data.name})`);
                } else {
                    setVerses(data.data.ayahs); // Juz API data structure might slightly differ, checking ayah array
                    setTitle(`Juz ${id}`);
                }
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Failed to fetch Quran data", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3E5AB] text-[#092B22] font-sans pb-20 relative overflow-x-hidden">
            <Header />

            {/* Back Button & Header */}
            <div className="bg-[#092B22] text-[#F4D03F] py-4 px-4 sticky top-0 z-30 shadow-lg flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center hover:text-white">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back
                </button>
                <h2 className="font-display font-bold text-lg">{loading ? "Loading..." : title}</h2>
                <div className="w-6"></div> {/* Spacer for centering */}
            </div>

            <div className="container mx-auto px-2 md:px-4 py-8 max-w-4xl min-h-[80vh]">

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="w-12 h-12 animate-spin text-[#092B22]" />
                        <p className="mt-4 font-medium">Loading Holy Text...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-700 font-bold mb-4">Could not load the text. Please check your internet connection.</p>
                        <button onClick={fetchQuranData} className="bg-[#092B22] text-[#F4D03F] px-4 py-2 rounded">Retry</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Bismillah (Usually fetched with Surah, but adding manually if needed for consisteny at top) */}
                        {type === 'surah' && id !== '9' && id !== '1' && (
                            <div className="text-center mb-8 pt-4">
                                <p className="font-arabic text-3xl md:text-4xl leading-relaxed text-[#092B22]">
                                    بِسْمِ ٱللَّهِ ٱlrَّحْمَٰنِ ٱlrَّحِيمِ
                                </p>
                            </div>
                        )}

                        {/* Verses */}
                        <div className="bg-white/50 border border-[#092B22]/10 rounded-xl p-4 md:p-8 shadow-sm">
                            {verses.map((ayah, index) => (
                                <div key={index} className="mb-6 border-b border-[#092B22]/5 pb-6 last:border-0 relative">
                                    {/* Verse Number Badge */}
                                    <div className="absolute left-0 top-2 text-xs text-[#092B22]/40 font-mono bg-[#092B22]/5 px-2 py-1 rounded">
                                        {ayah.numberInSurah}
                                    </div>

                                    {/* Arabic Text - Right Aligned "Line to Line" feel */}
                                    <p className="font-arabic text-right text-3xl md:text-4xl lg:text-5xl leading-[2.2] text-[#092B22] dir-rtl">
                                        {ayah.text} ۝
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default QuranReader;
