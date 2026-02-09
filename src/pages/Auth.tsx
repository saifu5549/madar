import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isRegister = searchParams.get("mode") === "register";
  const [isLogin, setIsLogin] = useState(!isRegister);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    madarsaName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // This is a demo - show toast about backend requirement
    toast({
      title: isLogin ? "Login Demo" : "Registration Demo",
      description: "Backend integration required. Enable Lovable Cloud to add authentication.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col p-6 md:p-12">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-2xl">🕌</span>
                </div>
                <div>
                  <h1 className="font-display text-xl font-semibold text-foreground">
                    Madarsa Directory
                  </h1>
                </div>
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                {isLogin ? "Welcome Back" : "Add Your Madarsa"}
              </h2>
              <p className="text-muted-foreground">
                {isLogin
                  ? "Sign in to manage your madarsa"
                  : "Register your madarsa and become a Super Admin"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin ? (
                <div className="text-center space-y-4 py-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <Building2 className="w-12 h-12 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold text-lg">Register New Madarsa</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a comprehensive profile for your madarsa with our multi-step registration wizard.
                    </p>
                    <Link to="/add-madarsa">
                      <Button type="button" variant="hero" className="w-full">
                        Start Registration
                      </Button>
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or login to existing account
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsLogin(true)}
                  >
                    Back to Login
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="hero" className="w-full h-12">
                    Sign In
                  </Button>
                </>
              )}
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-primary font-medium hover:underline"
                >
                  {isLogin ? "Register" : "Sign In"}
                </button>
              </p>
            </div>

            {/* Info */}
            {!isLogin && (
              <div className="mt-8 p-4 bg-accent/50 rounded-xl border border-border">
                <h4 className="font-semibold text-foreground mb-2">
                  🎉 What you get as Super Admin:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Full control over your madarsa profile</li>
                  <li>• Add teachers, students & staff</li>
                  <li>• Manage classes, exams & results</li>
                  <li>• Assign additional admins</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-10" />

        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-24 h-24 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mb-8">
            <span className="text-6xl">🕌</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Digitize Your Madarsa
          </h2>

          <p className="text-primary-foreground/80 max-w-md text-lg leading-relaxed">
            Join hundreds of madarsas across India. Bring transparency,
            efficiency, and modern management to your institution.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-primary-foreground">500+</p>
              <p className="text-sm text-primary-foreground/70">Madarsas</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-primary-foreground">50K+</p>
              <p className="text-sm text-primary-foreground/70">Students</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-primary-foreground">25+</p>
              <p className="text-sm text-primary-foreground/70">States</p>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-foreground/5 rounded-full" />
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-primary-foreground/5 rounded-full" />
      </div>
    </div>
  );
};

export default Auth;
