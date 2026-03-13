import { useState } from "react";
import { Link, useLocation, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import iconPath from "@assets/BarterConnect_Logo_new.svg";

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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/">
            <img src={logoPath} alt="BarterConnect" className="h-12 w-auto object-contain" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <img src={iconPath} alt="BarterConnect" className="w-16 h-auto max-w-full" />
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Log in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading} data-testid="button-submit-login">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Log in
              </Button>
            </form>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Don't have an account?{" "}
              <Link href="/signup" className="text-accent hover:underline font-medium" data-testid="link-signup">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <footer className="border-t py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center">
          <img src={logoPath} alt="BarterConnect" className="w-36" />
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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/">
            <img src={logoPath} alt="BarterConnect" className="h-12 w-auto object-contain" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <img src={iconPath} alt="BarterConnect" className="w-16 h-auto max-w-full" />
            </div>
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
            <CardDescription>We're putting the finishing touches on BarterConnect</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 pb-6">
            <p className="text-sm text-muted-foreground">
              Signups are not open yet. Check back soon — we're almost ready!
            </p>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline font-medium" data-testid="link-login">
                Log in here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <footer className="border-t py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center">
          <img src={logoPath} alt="BarterConnect" className="w-36" />
        </div>
      </footer>
    </div>
  );
}
