import { useState } from "react";
import { Link, useLocation, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/auth";
import { Loader2, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen flex flex-col">
      <header className="bg-[hsl(165,30%,42%)] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-[#f3eddf] hover:bg-white/10" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/">
            <img src={logoPath} alt="BarterConnect" className="h-10 w-auto object-contain" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8 bg-[#f7f3eb]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-[hsl(165,15%,85%)] overflow-hidden">
            <div className="bg-[hsl(165,30%,42%)] px-8 py-8 text-center">
              <img src={logoPath} alt="BarterConnect" className="w-20 h-auto mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-[#f3eddf]">Welcome back</h1>
              <p className="text-[#f3eddf]/70 text-sm mt-1">Log in to your account</p>
            </div>
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[hsl(165,35%,20%)] font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg border-[hsl(165,15%,80%)] focus:border-[hsl(165,30%,42%)] focus:ring-[hsl(165,30%,42%)]"
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[hsl(165,35%,20%)] font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-lg border-[hsl(165,15%,80%)] focus:border-[hsl(165,30%,42%)] focus:ring-[hsl(165,30%,42%)]"
                    data-testid="input-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[hsl(165,30%,42%)] hover:bg-[hsl(165,30%,37%)] text-[#f3eddf] font-semibold rounded-full py-5"
                  disabled={loading}
                  data-testid="button-submit-login"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Log in
                </Button>
              </form>
              <p className="text-sm text-[hsl(165,15%,45%)] text-center mt-6">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[hsl(165,30%,42%)] hover:underline font-semibold" data-testid="link-signup">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[hsl(165,30%,25%)] py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center">
          <img src={logoPath} alt="BarterConnect" className="w-32 opacity-70" />
        </div>
      </footer>
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
    <div className="min-h-screen flex flex-col">
      <header className="bg-[hsl(165,30%,42%)] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-[#f3eddf] hover:bg-white/10" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/">
            <img src={logoPath} alt="BarterConnect" className="h-10 w-auto object-contain" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8 bg-[#f7f3eb]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-[hsl(165,15%,85%)] overflow-hidden">
            <div className="bg-[hsl(165,30%,42%)] px-8 py-8 text-center">
              <img src={logoPath} alt="BarterConnect" className="w-20 h-auto mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-[#f3eddf]">Coming Soon</h1>
              <p className="text-[#f3eddf]/70 text-sm mt-1">We're putting the finishing touches on BarterConnect</p>
            </div>
            <div className="px-8 py-8 text-center space-y-4">
              <p className="text-sm text-[hsl(165,15%,45%)]">
                Signups are not open yet. Check back soon — we're almost ready!
              </p>
              <p className="text-sm text-[hsl(165,15%,45%)]">
                Already have an account?{" "}
                <Link href="/login" className="text-[hsl(165,30%,42%)] hover:underline font-semibold" data-testid="link-login">
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[hsl(165,30%,25%)] py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center">
          <img src={logoPath} alt="BarterConnect" className="w-32 opacity-70" />
        </div>
      </footer>
    </div>
  );
}
