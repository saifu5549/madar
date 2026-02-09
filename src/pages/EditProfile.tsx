import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Need to ensure this exists or use standard textarea
import { ArrowLeft, Save, Loader2, Building2, MapPin, Phone, FileText } from "lucide-react";

// Fallback if Textarea component doesn't exist, use standard textarea with class
const EditProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        city: "",
        address: "",
        phone: "",
        about: ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/auth");
            return;
        }
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const docRef = doc(db, "madarsas", user!.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    name: data.name || "",
                    city: data.city || "",
                    address: data.address || "",
                    phone: data.phone || "",
                    about: data.about || ""
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const docRef = doc(db, "madarsas", user!.uid);
            await updateDoc(docRef, {
                name: formData.name,
                city: formData.city,
                address: formData.address,
                phone: formData.phone,
                about: formData.about
            });
            toast({ title: "Success", description: "Profile updated successfully!" });
            navigate("/my-madarsa");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to update profile." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen bg-[#092B22]"><Loader2 className="animate-spin text-[#F4D03F]" /></div>;

    return (
        <div className="min-h-screen bg-[#092B22] text-[#F3E5AB] font-sans pb-20">
            <Header />
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <button onClick={() => navigate(-1)} className="flex items-center text-[#F4D03F] mb-6 hover:text-white">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </button>

                <div className="bg-[#10382F] p-6 rounded-xl border border-[#F4D03F]/30 shadow-2xl relative overflow-hidden">
                    {/* Decorative Borders */}
                    <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#F4D03F]/50 rounded-tl-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#F4D03F]/50 rounded-br-3xl"></div>

                    <h1 className="font-display text-3xl font-bold text-white mb-8 border-b border-[#F4D03F]/30 pb-4">
                        Edit Madarsa Profile
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#F4D03F] flex items-center gap-2">
                                <Building2 className="w-4 h-4" /> Madarsa Name
                            </label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-[#092B22] border border-[#F4D03F]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#F4D03F]"
                                placeholder="Enter Madarsa Name"
                            />
                        </div>

                        {/* City Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#F4D03F] flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> City / Location
                            </label>
                            <input
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full bg-[#092B22] border border-[#F4D03F]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#F4D03F]"
                                placeholder="e.g. Mumbai, Maharashtra"
                            />
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#F4D03F] flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Contact Number
                            </label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-[#092B22] border border-[#F4D03F]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#F4D03F]"
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        {/* About Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#F4D03F] flex items-center gap-2">
                                <FileText className="w-4 h-4" /> About Madarsa
                            </label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-[#092B22] border border-[#F4D03F]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#F4D03F]"
                                placeholder="Write a short description about your Madarsa..."
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-[#092B22] font-bold py-6 text-lg tracking-wide shadow-lg mt-4"
                        >
                            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                            Save Changes
                        </Button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditProfile;
