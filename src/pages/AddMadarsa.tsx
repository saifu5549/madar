import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Building2,
    MapPin,
    GraduationCap,
    Loader2,
    X,
    Plus
} from "lucide-react";

// Validation schema for Step 1
const step1Schema = z.object({
    name: z.string().min(3, "मदरसे का नाम कम से कम 3 अक्षर का होना चाहिए"),
    established: z.string().regex(/^\d{4}$/, "वैध वर्ष दर्ज करें (जैसे 1995)"),
    type: z.string().min(1, "मदरसे का प्रकार चुनें"),
    otherType: z.string().optional(),
    address: z.string().min(10, "पूरा पता दर्ज करें"),
    city: z.string().min(2, "शहर का नाम दर्ज करें"),
    state: z.string().min(1, "राज्य चुनें"),
    pincode: z.string().regex(/^\d{6}$/, "6 अंकों का PIN कोड दर्ज करें"),
    phone: z.string().regex(/^\d{10}$/, "10 अंकों का फोन नंबर दर्ज करें"),
    email: z.string().email("वैध ईमेल पता दर्ज करें"),
    mohatmimName: z.string().min(3, "मुहतमिम का नाम दर्ज करें"),
    altPhone: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
}).refine((data) => {
    if (data.type === "other" && !data.otherType) {
        return false;
    }
    return true;
}, {
    message: "कृपया प्रकार निर्दिष्ट करें (Please specify type)",
    path: ["otherType"],
});

// Validation schema for Step 2
const step2Schema = z.object({
    classes: z.array(z.string()).min(1, "कम से कम एक कक्षा चुनें"),
    totalStudents: z.string().regex(/^\d+$/, "छात्रों की संख्या दर्ज करें"),
    teachers: z.string().regex(/^\d+$/, "शिक्षकों की संख्या दर्ज करें"),
    staff: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh"
];

const MADARSA_TYPES = [
    { value: "dar-ul-uloom", label: "दारुल उलूम (Dar-ul-Uloom)" },
    { value: "madrasa", label: "मदरसा (Madrasa)" },
    { value: "maktab", label: "मकतब (Maktab)" },
    { value: "jamia", label: "जामिया (Jamia)" },
    { value: "other", label: "अन्य (Other)" }
];

const CLASSES_OFFERED = [
    { id: "hifz", label: "हिफ्ज़ (Hifz)" },
    { id: "nazra", label: "नाज़रा (Nazra)" },
    { id: "dars-e-nizami", label: "दर्स-ए-निज़ामी (Dars-e-Nizami)" },
    { id: "alim", label: "आलिम (Alim Course)" },
    { id: "maulvi", label: "मौलवी (Maulvi Course)" },
    { id: "fazilat", label: "फज़ीलत (Fazilat)" },
    { id: "takhassus", label: "तखस्सुस (Takhassus)" },
    { id: "school", label: "School Education (NIOS/Board)" },
];

const FACILITIES = [
    { id: "library", label: "पुस्तकालय (Library)" },
    { id: "computerLab", label: "कंप्यूटर लैब (Computer Lab)" },
    { id: "sports", label: "खेल मैदान (Sports Ground)" },
    { id: "transport", label: "परिवहन (Transport)" },
    { id: "dining", label: "भोजनालय (Dining Hall)" },
    { id: "medical", label: "चिकित्सा (Medical)" },
    { id: "prayerHall", label: "नमाज़गाह (Prayer Hall)" },
];

const AddMadarsa = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form data state
    const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [hostelType, setHostelType] = useState<string>("");
    const [showAltPhone, setShowAltPhone] = useState(false);

    // Auth state for inline login/register
    const { login, register } = useAuth();
    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [authName, setAuthName] = useState("");
    const [authLoading, setAuthLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        try {
            await login(authEmail, authPassword);
            toast({
                title: "Welcome back!",
                description: "You are now logged in.",
            });
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: error.message || "Please check your credentials",
                variant: "destructive",
            });
        } finally {
            setAuthLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        try {
            await register(authEmail, authPassword, authName);
            toast({
                title: "Welcome!",
                description: "Account created successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Registration Failed",
                description: error.message || "Could not create account",
                variant: "destructive",
            });
        } finally {
            setAuthLoading(false);
        }
    };
    // Form hooks for each step
    const form1 = useForm<Step1Data>({
        resolver: zodResolver(step1Schema),
        defaultValues: {
            name: "",
            established: "",
            type: "",
            otherType: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            phone: "",
            email: "",
            mohatmimName: "",
            altPhone: "",
            website: "",
        }
    });

    const form2 = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            classes: [],
            totalStudents: "",
            teachers: "",
            staff: "",
        }
    });



    // Step 1 submission
    const onStep1Submit = (data: Step1Data) => {
        setStep1Data(data);
        setCurrentStep(2);
    };

    // Step 2 submission
    // Final Submission (High-level handling)
    const onFinalSubmit = async (data: Step2Data) => {
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Please login to add a madarsa",
                variant: "destructive",
            });
            navigate("/auth");
            return;
        }

        if (!step1Data) {
            toast({
                title: "Error",
                description: "Missing basic info. Please go back to step 1.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            // Debug: Check user authentication
            console.log("🔐 User authenticated:", user);
            console.log("🆔 User UID:", user.uid);
            console.log("📧 User email:", user.email);

            // Generate a short, unique code for the madarsa (e.g., "MDR123")
            const madarsaCode = "MDR" + Math.random().toString(36).substring(2, 6).toUpperCase();

            // Prepare facilities object
            const facilities: Record<string, boolean | string> = {};
            selectedFacilities.forEach(fac => {
                facilities[fac] = true;
            });
            if (hostelType) {
                facilities.hostel = hostelType;
            }

            // Create Firestore document
            const finalType = step1Data.type === "other" ? step1Data.otherType : step1Data.type;

            const madarsaData = {
                madarsaCode,
                basicInfo: {
                    nameHindi: step1Data.name,
                    nameEnglish: step1Data.name,
                    established: parseInt(step1Data.established),
                    type: finalType,
                },
                location: {
                    address: step1Data.address,
                    city: step1Data.city,
                    state: step1Data.state,
                    pincode: step1Data.pincode,
                },
                contact: {
                    phone: step1Data.phone,
                    altPhone: step1Data.altPhone || "",
                    email: step1Data.email,
                    website: step1Data.website || "",
                },
                mohatmim: {
                    name: step1Data.mohatmimName,
                    email: user.email || "",
                },
                academic: {
                    classes: selectedClasses,
                    totalStudents: parseInt(data.totalStudents),
                    teachers: parseInt(data.teachers),
                    staff: parseInt(data.staff || "0"),
                },
                facilities,
                media: {
                    logo: "",
                    coverPhoto: "",
                    gallery: [],
                },
                description: {
                    about: "",
                },
                meta: {
                    createdAt: serverTimestamp(),
                    createdBy: user.uid,
                    verified: false,
                    status: "pending",
                },
            };

            // Debug: Log the data being sent
            console.log("📝 Madarsa data to be saved:", madarsaData);
            console.log("✅ meta.createdBy:", madarsaData.meta.createdBy);

            await addDoc(collection(db, "madarsas"), madarsaData);

            toast({
                title: "✅ Success!",
                description: "Madarsa submitted successfully! Welcome to your dashboard.",
            });

            // Redirect to My Madarsa Dashboard
            navigate("/my-madarsa");
        } catch (error) {
            console.error("Error adding madarsa:", error);
            toast({
                title: "Error",
                description: "Failed to add madarsa. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };



    const progress = (currentStep / 2) * 100;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-grow py-8 md:py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/")}
                            className="mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>

                        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                            अपना मदरसा जोड़ें
                        </h1>
                        <p className="text-muted-foreground">
                            Add Your Madarsa to India's Largest Directory
                        </p>
                    </div>

                    {/* Progress Bar */}
                    {user && (
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">
                                    Step {currentStep} of 2
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {Math.round(progress)}% Complete
                                </span>
                            </div>
                            <Progress value={progress} className="h-2" />

                            {/* Step indicators */}
                            <div className="flex justify-between mt-4">
                                <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                                    </div>
                                    <span className="text-sm font-medium hidden sm:inline">Basic Info</span>
                                </div>

                                <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        2
                                    </div>
                                    <span className="text-sm font-medium hidden sm:inline">Academic</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content - Auth or Form */}
                    {!user ? (
                        <div className="max-w-md mx-auto">
                            <Card className="card-elevated">
                                <CardHeader className="text-center">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <Building2 className="w-6 h-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl font-display">Login Required</CardTitle>
                                    <CardDescription>
                                        Please login or register to add your madarsa
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue="login" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 mb-6">
                                            <TabsTrigger value="login">Login</TabsTrigger>
                                            <TabsTrigger value="register">Register</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="login">
                                            <form onSubmit={handleLogin} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="auth-email">Email</Label>
                                                    <Input
                                                        id="auth-email"
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        value={authEmail}
                                                        onChange={(e) => setAuthEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="auth-pass">Password</Label>
                                                    <Input
                                                        id="auth-pass"
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={authPassword}
                                                        onChange={(e) => setAuthPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <Button type="submit" className="w-full" disabled={authLoading}>
                                                    {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Sign In
                                                </Button>
                                            </form>
                                        </TabsContent>

                                        <TabsContent value="register">
                                            <form onSubmit={handleRegister} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="reg-name">Full Name</Label>
                                                    <Input
                                                        id="reg-name"
                                                        placeholder="Your Name"
                                                        value={authName}
                                                        onChange={(e) => setAuthName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="reg-email">Email</Label>
                                                    <Input
                                                        id="reg-email"
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        value={authEmail}
                                                        onChange={(e) => setAuthEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="reg-pass">Password</Label>
                                                    <Input
                                                        id="reg-pass"
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={authPassword}
                                                        onChange={(e) => setAuthPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <Button type="submit" className="w-full" disabled={authLoading}>
                                                    {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Create Account
                                                </Button>
                                            </form>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        /* Form Container */
                        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 card-elevated">
                            {/* Step 1: Basic Information */}
                            {currentStep === 1 && (
                                <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="font-display text-2xl font-bold">मदरसे की जानकारी</h2>
                                            <p className="text-sm text-muted-foreground">Basic Information & Location</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-6">
                                        {/* Madarsa Name */}
                                        <div>
                                            <Label htmlFor="name">मदरसे का नाम (Madarsa Name) *</Label>
                                            <Input
                                                id="name"
                                                placeholder="Enter Madarsa Name"
                                                {...form1.register("name")}
                                            />
                                            {form1.formState.errors.name && (
                                                <p className="text-sm text-destructive mt-1">
                                                    {form1.formState.errors.name.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Established Year & Type */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="established">स्थापना वर्ष (Established Year) *</Label>
                                                <Select
                                                    onValueChange={(value) => form1.setValue("established", value, { shouldValidate: true })}
                                                    value={form1.watch("established")}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Year" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 150 }, (_, i) => {
                                                            const year = new Date().getFullYear() - i;
                                                            return (
                                                                <SelectItem key={year} value={year.toString()}>
                                                                    {year}
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                                {form1.formState.errors.established && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {form1.formState.errors.established.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="type">मदरसे का प्रकार (Type) *</Label>
                                                {form1.watch("type") === "other" ? (
                                                    <div className="relative">
                                                        <Input
                                                            autoFocus
                                                            placeholder="Specify type (e.g. Jamia)"
                                                            {...form1.register("otherType")}
                                                            className="pr-10"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                            onClick={() => {
                                                                form1.setValue("type", "");
                                                                form1.setValue("otherType", "");
                                                            }}
                                                        >
                                                            <X className="w-4 h-4 text-muted-foreground" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Select onValueChange={(value) => {
                                                        form1.setValue("type", value);
                                                        if (value === "other") {
                                                            // clear error when switching to other
                                                            form1.clearErrors("type");
                                                        }
                                                    }} value={form1.watch("type")}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="चुनें" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {MADARSA_TYPES.map((type) => (
                                                                <SelectItem key={type.value} value={type.value}>
                                                                    {type.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}

                                                {form1.formState.errors.type && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {form1.formState.errors.type.message}
                                                    </p>
                                                )}

                                                {form1.formState.errors.otherType && form1.watch("type") === "other" && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {form1.formState.errors.otherType.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Location Section */}

                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-2 items-center">
                                                <Label className="text-base font-semibold">Location Details</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2 text-primary border-primary/20 hover:bg-primary/5 h-8 w-full sm:w-auto"
                                                    onClick={async () => {
                                                        if (!navigator.geolocation) {
                                                            toast({
                                                                title: "Error",
                                                                description: "Geolocation is not supported by your browser",
                                                                variant: "destructive",
                                                            });
                                                            return;
                                                        }

                                                        if (!navigator.geolocation) {
                                                            toast({
                                                                title: "Not Supported",
                                                                description: "Geolocation is not supported by your browser.",
                                                                variant: "destructive",
                                                            });
                                                            return;
                                                        }

                                                        // Check for Secure Context (required for geolocation in most mobile browsers)
                                                        if (!window.isSecureContext) {
                                                            toast({
                                                                title: "Insecure Connection",
                                                                description: "Location detection requires an HTTPS connection for security on mobile devices.",
                                                                variant: "destructive",
                                                            });
                                                        }

                                                        setLoading(true);
                                                        navigator.geolocation.getCurrentPosition(async (position) => {
                                                            try {
                                                                const { latitude, longitude } = position.coords;
                                                                const response = await fetch(
                                                                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                                                                );
                                                                const data = await response.json();
                                                                const addr = data.address;

                                                                // 1. Construct more robust address string
                                                                const addressParts = [
                                                                    addr.road,
                                                                    addr.suburb,
                                                                    addr.neighbourhood,
                                                                    addr.city_district,
                                                                    addr.village,
                                                                    addr.hamlet
                                                                ].filter(Boolean);

                                                                const fullAddress = addressParts.length > 0
                                                                    ? addressParts.join(", ")
                                                                    : data.display_name?.split(',').slice(0, 3).join(', ');

                                                                // 2. Clear then update form fields
                                                                if (fullAddress) form1.setValue("address", fullAddress);

                                                                // Detect City
                                                                const city = addr.city || addr.town || addr.village || addr.municipality || addr.county;
                                                                if (city) form1.setValue("city", city);

                                                                // Detect State (with fuzzy matching)
                                                                if (addr.state) {
                                                                    const normalizedApiState = addr.state.toLowerCase();
                                                                    const matchedState = INDIAN_STATES.find(s =>
                                                                        normalizedApiState.includes(s.toLowerCase()) ||
                                                                        s.toLowerCase().includes(normalizedApiState)
                                                                    );
                                                                    if (matchedState) form1.setValue("state", matchedState);
                                                                }

                                                                // Detect Pincode
                                                                if (addr.postcode) form1.setValue("pincode", addr.postcode);

                                                                toast({
                                                                    title: "Location Detected ✅",
                                                                    description: "Address details filled successfully!",
                                                                });
                                                            } catch (error) {
                                                                console.error("Geocoding error:", error);
                                                                toast({
                                                                    title: "Error",
                                                                    description: "Could not fetch address details",
                                                                    variant: "destructive",
                                                                });
                                                            } finally {
                                                                setLoading(false);
                                                            }
                                                        }, (error) => {
                                                            console.error("Geolocation error:", error);
                                                            let errorMsg = "Please enable location access to use this feature";

                                                            if (error.code === 3) {
                                                                errorMsg = "Location request timed out. Please try again in an open area.";
                                                            } else if (error.code === 1) {
                                                                errorMsg = "Location permission denied. Click the 'Lock' icon next to the URL above and select 'Allow' for Location.";
                                                            }

                                                            toast({
                                                                title: "Location Error",
                                                                description: errorMsg,
                                                                variant: "destructive",
                                                            });
                                                            setLoading(false);
                                                        }, {
                                                            enableHighAccuracy: true,
                                                            timeout: 15000,
                                                            maximumAge: 0
                                                        });
                                                    }}
                                                    disabled={loading}
                                                >
                                                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                                                    Detect Location (Auto-Fill)
                                                </Button>
                                            </div>

                                            {/* City, State, PIN */}
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="city">शहर (City) *</Label>
                                                    <Input
                                                        id="city"
                                                        placeholder="Mumbai"
                                                        {...form1.register("city")}
                                                    />
                                                    {form1.formState.errors.city && (
                                                        <p className="text-sm text-destructive mt-1">
                                                            {form1.formState.errors.city.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <Label htmlFor="state">राज्य (State) *</Label>
                                                    <Select onValueChange={(value) => form1.setValue("state", value)} value={form1.watch("state")}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="चुनें" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {INDIAN_STATES.map((state) => (
                                                                <SelectItem key={state} value={state}>
                                                                    {state}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {form1.formState.errors.state && (
                                                        <p className="text-sm text-destructive mt-1">
                                                            {form1.formState.errors.state.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <Label htmlFor="pincode">PIN Code *</Label>
                                                    <Input
                                                        id="pincode"
                                                        placeholder="400001"
                                                        {...form1.register("pincode")}
                                                    />
                                                    {form1.formState.errors.pincode && (
                                                        <p className="text-sm text-destructive mt-1">
                                                            {form1.formState.errors.pincode.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Address Textarea */}
                                            <div>
                                                <Label htmlFor="address">पूरा पता (Complete Address) *</Label>
                                                <Textarea
                                                    id="address"
                                                    placeholder="भवन संख्या, गली, क्षेत्र"
                                                    rows={3}
                                                    {...form1.register("address")}
                                                    className="mt-1.5"
                                                />
                                                {form1.formState.errors.address && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {form1.formState.errors.address.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>


                                        {/* Phone & Email */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="phone">फोन नंबर (Phone) *</Label>
                                                    <Input
                                                        id="phone"
                                                        placeholder="9876543210"
                                                        maxLength={10}
                                                        {...form1.register("phone", {
                                                            onChange: (e) => {
                                                                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                                form1.setValue("phone", value);
                                                            },
                                                        })}
                                                    />
                                                    {form1.formState.errors.phone && (
                                                        <p className="text-sm text-destructive mt-1">
                                                            {form1.formState.errors.phone.message}
                                                        </p>
                                                    )}
                                                </div>

                                                {!showAltPhone && !form1.getValues("altPhone") && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-primary p-0 h-auto font-normal hover:bg-transparent hover:text-primary/80"
                                                        onClick={() => setShowAltPhone(true)}
                                                    >
                                                        <Plus className="w-3 h-3 mr-1" />
                                                        Add another number
                                                    </Button>
                                                )}

                                                {(showAltPhone || form1.getValues("altPhone")) && (
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <Label htmlFor="altPhone">वैकल्पिक फोन (Alternative)</Label>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                                                                onClick={() => {
                                                                    setShowAltPhone(false);
                                                                    form1.setValue("altPhone", "");
                                                                }}
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                        <Input
                                                            id="altPhone"
                                                            placeholder="9876543211"
                                                            maxLength={10}
                                                            {...form1.register("altPhone", {
                                                                onChange: (e) => {
                                                                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                                    form1.setValue("altPhone", value);
                                                                },
                                                            })}
                                                        />
                                                    </div>
                                                )}
                                            </div>


                                            <div>
                                                <Label htmlFor="email">ईमेल (Email) *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="info@madarsa.com"
                                                    {...form1.register("email")}
                                                />
                                                {form1.formState.errors.email && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {form1.formState.errors.email.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="website">Website (Optional)</Label>
                                            <Input
                                                id="website"
                                                placeholder="https://www.madarsa.com"
                                                {...form1.register("website")}
                                            />
                                        </div>

                                        {/* Mohatmim Name */}
                                        <div>
                                            <Label htmlFor="mohatmimName">मुहतमिम का नाम (Mohatmim Name) *</Label>
                                            <Input
                                                id="mohatmimName"
                                                placeholder="मौलाना [नाम]"
                                                {...form1.register("mohatmimName")}
                                            />
                                            {form1.formState.errors.mohatmimName && (
                                                <p className="text-sm text-destructive mt-1">
                                                    {form1.formState.errors.mohatmimName.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-6">
                                        <Button type="submit" size="lg" className="gap-2">
                                            Next Step
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {/* Step 2: Academic & Facilities */}
                            {currentStep === 2 && (
                                <form onSubmit={form2.handleSubmit(onFinalSubmit)} className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <GraduationCap className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="font-display text-2xl font-bold">शैक्षणिक जानकारी</h2>
                                            <p className="text-sm text-muted-foreground">Academic Information & Facilities</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-6">
                                        {/* Classes Offered */}
                                        <div>
                                            <Label>पाठ्यक्रम (Classes Offered) *</Label>
                                            <div className="grid md:grid-cols-2 gap-3 mt-2">
                                                {CLASSES_OFFERED.map((classItem) => (
                                                    <div key={classItem.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={classItem.id}
                                                            checked={selectedClasses.includes(classItem.id)}
                                                            onCheckedChange={(checked) => {
                                                                let newClasses;
                                                                if (checked) {
                                                                    newClasses = [...selectedClasses, classItem.id];
                                                                } else {
                                                                    newClasses = selectedClasses.filter(c => c !== classItem.id);
                                                                }
                                                                setSelectedClasses(newClasses);
                                                                form2.setValue("classes", newClasses, { shouldValidate: true });
                                                            }}
                                                        />
                                                        <Label htmlFor={classItem.id} className="font-normal cursor-pointer">
                                                            {classItem.label}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                            {selectedClasses.length === 0 && (
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    कम से कम एक कक्षा चुनें
                                                </p>
                                            )}
                                        </div>

                                        {/* Student & Teacher Count */}
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="totalStudents">कुल छात्र (Total Students) *</Label>
                                                <Input
                                                    id="totalStudents"
                                                    placeholder="150"
                                                    {...form2.register("totalStudents")}
                                                />
                                                {form2.formState.errors.totalStudents && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {form2.formState.errors.totalStudents.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="teachers">शिक्षक (Teachers) *</Label>
                                                <Input
                                                    id="teachers"
                                                    placeholder="15"
                                                    {...form2.register("teachers")}
                                                />
                                                {form2.formState.errors.teachers && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {form2.formState.errors.teachers.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="staff">स्टाफ (Support Staff)</Label>
                                                <Input
                                                    id="staff"
                                                    placeholder="5"
                                                    {...form2.register("staff")}
                                                />
                                            </div>
                                        </div>

                                        {/* Hostel */}
                                        <div>
                                            <Label>छात्रावास (Hostel Facility)</Label>
                                            <Select onValueChange={setHostelType} value={hostelType}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="चुनें (Optional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="boys">Boys Only</SelectItem>
                                                    <SelectItem value="girls">Girls Only</SelectItem>
                                                    <SelectItem value="both">Both</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Facilities */}
                                        <div>
                                            <Label>सुविधाएं (Facilities)</Label>
                                            <div className="grid md:grid-cols-2 gap-3 mt-2">
                                                {FACILITIES.map((facility) => (
                                                    <div key={facility.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={facility.id}
                                                            checked={selectedFacilities.includes(facility.id)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    setSelectedFacilities([...selectedFacilities, facility.id]);
                                                                } else {
                                                                    setSelectedFacilities(selectedFacilities.filter(f => f !== facility.id));
                                                                }
                                                            }}
                                                        />
                                                        <Label htmlFor={facility.id} className="font-normal cursor-pointer">
                                                            {facility.label}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentStep(1)}
                                            className="gap-2"
                                            disabled={loading}
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Previous
                                        </Button>
                                        <Button type="submit" size="lg" className="gap-2" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Submit Madarsa
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}


                        </div>
                    )}
                </div >
            </main >

            <Footer />
        </div >
    );
};

export default AddMadarsa;
