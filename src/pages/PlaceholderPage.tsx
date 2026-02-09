import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PlaceholderPageProps {
    title: string;
    description?: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#092B22] text-[#F3E5AB] font-sans selection:bg-[#D4AF37]/30 pb-20 relative overflow-x-hidden">
            {/* Background Pattern Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(#1A5F45 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <Header />

            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-[#F4D03F] hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Dashboard</span>
                </button>

                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border-2 border-[#D4AF37] rounded-xl bg-[#092B22]/50 p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                    {/* Decorative Corner Flourishes */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#D4AF37] rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#D4AF37] rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#D4AF37] rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#D4AF37] rounded-br-xl"></div>

                    <div className="w-24 h-24 rounded-full bg-[#1A5F45] border-2 border-[#D4AF37] flex items-center justify-center mb-6 shadow-inner ring-4 ring-[#092B22]">
                        <Construction className="w-12 h-12 text-[#F4D03F]" />
                    </div>

                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
                        {title}
                    </h1>

                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-6"></div>

                    <p className="text-xl text-[#F3E5AB]/80 max-w-lg leading-relaxed">
                        {description || "This feature is currently under development. Stay tuned for updates!"}
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PlaceholderPage;
