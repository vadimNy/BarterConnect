import { useState } from "react";
import { Link, useLocation, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/auth";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CityPicker } from "@/components/city-picker";
import { tosContent, professionalDisclaimerContent, taxDisclaimerContent, platformRoleDisclaimerContent, communityGuidelinesContent } from "@/pages/terms";
import logoPath from "@assets/BarterConnect_Logo_new.svg";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  if (user) {
    return <Redirect to="/app" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/app");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message || "Invalid credentials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#3d4a3c] via-[#4a5a48] to-[#3d4a3c]">
      <header className="px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/">
            <img src={logoPath} alt="BarterConnect" className="h-9 w-auto object-contain" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-[#D99B42]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#869C84]/15 rounded-full blur-3xl" />
        </div>
        <div className="relative w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="px-8 pt-10 pb-2 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#869C84] text-white mb-5 shadow-lg">
                <Sparkles className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-[#3d4a3c]">Welcome back</h1>
              <p className="text-[#907169] text-sm mt-1">Log in to your account</p>
            </div>
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#3d4a3c] font-medium text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-xl border-[#e8d5b8] bg-[#faf6f0] focus:border-[#869C84] focus:ring-[#869C84] h-12"
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#3d4a3c] font-medium text-sm">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-xl border-[#e8d5b8] bg-[#faf6f0] focus:border-[#869C84] focus:ring-[#869C84] h-12"
                    data-testid="input-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#869C84] hover:bg-[#748c72] text-white font-semibold rounded-full py-6 shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={loading}
                  data-testid="button-submit-login"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Log in
                </Button>
              </form>
              <p className="text-sm text-[#907169] text-center mt-6">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#D99B42] hover:underline font-semibold" data-testid="link-signup">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [userType, setUserType] = useState("individual");
  const [tosAccepted, setTosAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signup } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  if (user) {
    return <Redirect to="/app" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    if (!tosAccepted) {
      toast({ title: "Error", description: "You must accept the Terms of Service to create an account", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await signup({ email, password, name, city, userType, tosAccepted: true });
      navigate("/onboarding");
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message || "Could not create account", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#3d4a3c] via-[#4a5a48] to-[#3d4a3c]">
      <header className="px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/">
            <img src={logoPath} alt="BarterConnect" className="h-9 w-auto object-contain" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-[#D99B42]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#869C84]/15 rounded-full blur-3xl" />
        </div>
        <div className="relative w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="px-8 pt-10 pb-2 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D99B42] text-white mb-5 shadow-lg">
                <Sparkles className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-[#3d4a3c]">Coming Soon</h1>
              <p className="text-[#907169] text-sm mt-1">We're putting the finishing touches on BarterConnect</p>
            </div>
            <div className="px-8 py-8 text-center space-y-4">
              <p className="text-sm text-[#907169]">
                Signups are not open yet. Check back soon — we're almost ready!
              </p>
              <p className="text-sm text-[#907169]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#D99B42] hover:underline font-semibold" data-testid="link-login">
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
