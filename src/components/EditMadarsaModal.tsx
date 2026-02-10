import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db, storage } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";

const profileSchema = z.object({
    nameEnglish: z.string().min(3, "Name must be at least 3 characters"),
    established: z.string().regex(/^\d{4}$/, "Valid year required"),
    about: z.string().optional(),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City required"),
    state: z.string().min(2, "State required"),
    phone: z.string().regex(/^\d{10}$/, "Valid 10-digit phone required"),
    email: z.string().email("Valid email required"),
    website: z.string().optional(),
    mohatmimName: z.string().min(3, "Mohatmim name required"),
});

type ProfileData = z.infer<typeof profileSchema>;

interface EditMadarsaModalProps {
    madarsa: any;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    defaultTab?: string;
}

export function EditMadarsaModal({ madarsa, isOpen, onClose, onUpdate, defaultTab = "basic" }: EditMadarsaModalProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(madarsa?.media?.logo || null);
    const [coverPreview, setCoverPreview] = useState<string | null>(madarsa?.media?.coverPhoto || null);

    // Facilities state
    const [facilities, setFacilities] = useState<Record<string, boolean>>(madarsa?.facilities || {});

    const form = useForm<ProfileData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            nameEnglish: madarsa?.basicInfo?.nameEnglish || "",
            established: madarsa?.basicInfo?.established?.toString() || "",
            about: madarsa?.description?.about || "",
            address: madarsa?.location?.address || "",
            city: madarsa?.location?.city || "",
            state: madarsa?.location?.state || "",
            phone: madarsa?.contact?.phone || "",
            email: madarsa?.contact?.email || "",
            website: madarsa?.contact?.website || "",
            mohatmimName: madarsa?.mohatmim?.name || "",
        }
    });

    // Reset form when madarsa changes
    useEffect(() => {
        if (madarsa) {
            form.reset({
                nameEnglish: madarsa.basicInfo?.nameEnglish || "",
                established: madarsa.basicInfo?.established?.toString() || "",
                about: madarsa.description?.about || "",
                address: madarsa.location?.address || "",
                city: madarsa.location?.city || "",
                state: madarsa.location?.state || "",
                phone: madarsa.contact?.phone || "",
                email: madarsa.contact?.email || "",
                website: madarsa.contact?.website || "",
                mohatmimName: madarsa.mohatmim?.name || "",
            });
            setLogoPreview(madarsa.media?.logo || null);
            setCoverPreview(madarsa.media?.coverPhoto || null);
            setFacilities(madarsa.facilities || {});
        }
    }, [madarsa, form]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFacilityChange = (key: string, checked: boolean) => {
        setFacilities(prev => ({ ...prev, [key]: checked }));
    };

    const onSubmit = async (data: ProfileData) => {
        setLoading(true);
        try {
            let logoUrl = madarsa.media?.logo || "";
            let coverUrl = madarsa.media?.coverPhoto || "";

            // Upload Logo
            if (logoFile) {
                const logoRef = ref(storage, `madarsa-images/${madarsa.id}/logo_${Date.now()}`);
                await uploadBytes(logoRef, logoFile);
                logoUrl = await getDownloadURL(logoRef);
            }

            // Upload Cover
            if (coverFile) {
                const coverRef = ref(storage, `madarsa-images/${madarsa.id}/cover_${Date.now()}`);
                await uploadBytes(coverRef, coverFile);
                coverUrl = await getDownloadURL(coverRef);
            }

            // Update Firestore
            const madarsaRef = doc(db, "madarsas", madarsa.id);
            await updateDoc(madarsaRef, {
                "basicInfo.nameEnglish": data.nameEnglish,
                "basicInfo.established": parseInt(data.established),
                "description.about": data.about,
                "location.address": data.address,
                "location.city": data.city,
                "location.state": data.state,
                "contact.phone": data.phone,
                "contact.email": data.email,
                "contact.website": data.website,
                "mohatmim.name": data.mohatmimName,
                "media.logo": logoUrl,
                "media.coverPhoto": coverUrl,
                "facilities": facilities,
                "meta.updatedAt": Date.now()
            });

            toast({
                title: "Success",
                description: "Madarsa profile updated successfully!",
            });

            onUpdate(); // Refresh parent data
            onClose();

        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const FACILITIES_LIST = [
        { id: "library", label: "Library" },
        { id: "computerLab", label: "Computer Lab" },
        { id: "sports", label: "Sports Ground" },
        { id: "hostel", label: "Hostel Facility" },
        { id: "dining", label: "Dining Hall" },
        { id: "medical", label: "Medical Facility" },
        { id: "prayerHall", label: "Prayer Hall" },
        { id: "wifi", label: "Wi-Fi Campus" },
        { id: "transport", label: "Transport" },
        { id: "cctv", label: "CCTV Surveillance" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Edit Madarsa Profile</DialogTitle>
                    <DialogDescription>
                        Update your madarsa details, images, and facilities.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-grow">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 pt-2">
                        <Tabs defaultValue={defaultTab} className="w-full">
                            <TabsList className="mb-4 flex-wrap h-auto">
                                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                <TabsTrigger value="media">Media & Images</TabsTrigger>
                                <TabsTrigger value="contact">Contact & Location</TabsTrigger>
                                <TabsTrigger value="facilities">Facilities</TabsTrigger>
                            </TabsList>

                            {/* Basic Info Tab */}
                            <TabsContent value="basic" className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nameEnglish">Madarsa Name (English)</Label>
                                        <Input {...form.register("nameEnglish")} />
                                        {form.formState.errors.nameEnglish && (
                                            <p className="text-xs text-destructive">{form.formState.errors.nameEnglish.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="established">Established Year</Label>
                                        <Input {...form.register("established")} />
                                        {form.formState.errors.established && (
                                            <p className="text-xs text-destructive">{form.formState.errors.established.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mohatmimName">Mohatmim Name</Label>
                                        <Input {...form.register("mohatmimName")} />
                                        {form.formState.errors.mohatmimName && (
                                            <p className="text-xs text-destructive">{form.formState.errors.mohatmimName.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="about">About Madarsa</Label>
                                    <Textarea
                                        {...form.register("about")}
                                        placeholder="Write a brief description about your madarsa..."
                                        rows={5}
                                    />
                                </div>
                            </TabsContent>

                            {/* Media Tab */}
                            <TabsContent value="media" className="space-y-6">
                                {/* Logo Upload */}
                                <div className="space-y-4">
                                    <Label>Madarsa Logo</Label>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted relative group">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                            )}
                                            <label htmlFor="logo-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <Upload className="w-6 h-6 text-white" />
                                            </label>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Upload a square logo (PNG/JPG). Max size 2MB.
                                            </p>
                                            <Input
                                                id="logo-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleLogoChange}
                                            />
                                            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('logo-upload')?.click()}>
                                                Choose Logo
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Cover Photo Upload */}
                                <div className="space-y-4">
                                    <Label>Cover Photo</Label>
                                    <div className="w-full h-40 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted relative group">
                                        {coverPreview ? (
                                            <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center">
                                                <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                                                <p className="text-xs text-muted-foreground">No cover photo uploaded</p>
                                            </div>
                                        )}
                                        <label htmlFor="cover-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <div className="text-white text-center">
                                                <Upload className="w-8 h-8 mx-auto mb-1" />
                                                <span className="text-xs font-medium">Change Cover Photo</span>
                                            </div>
                                        </label>
                                    </div>
                                    <Input
                                        id="cover-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleCoverChange}
                                    />
                                </div>
                            </TabsContent>

                            {/* Contact Tab */}
                            <TabsContent value="contact" className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input {...form.register("phone")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input {...form.register("email")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website (Optional)</Label>
                                        <Input {...form.register("website")} placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Full Address</Label>
                                    <Textarea {...form.register("address")} rows={2} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input {...form.register("city")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input {...form.register("state")} />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Facilities Tab */}
                            <TabsContent value="facilities" className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {FACILITIES_LIST.map((facility) => (
                                        <div key={facility.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={facility.id}
                                                checked={!!facilities[facility.id]}
                                                onCheckedChange={(checked) => handleFacilityChange(facility.id, checked as boolean)}
                                            />
                                            <label
                                                htmlFor={facility.id}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {facility.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
