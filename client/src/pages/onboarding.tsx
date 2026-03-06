import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, ArrowRight, Copy, Check, Share2, Sparkles } from "lucide-react";
import { SiLinkedin, SiFacebook, SiX, SiWhatsapp } from "react-icons/si";
import logoPath from "@assets/BarterConnect_Logo_cropped.png";
import iconPath from "@assets/BarterConnect_Icon_cropped.png";

type OnboardingStep = "welcome" | "create" | "success";

export default function OnboardingPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<OnboardingStep>("welcome");

  const [offerSkill, setOfferSkill] = useState("");
  const [needSkill, setNeedSkill] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState(user?.city || "");
  const [isRemote, setIsRemote] = useState(false);

  const [createdPublicId, setCreatedPublicId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/requests", {
        offerSkill,
        needSkill,
        description: description || null,
        city,
        isRemote,
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      setCreatedPublicId(data.publicId || null);
      setStep("success");
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerSkill.trim() || !needSkill.trim() || !city.trim()) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    mutation.mutate();
  };

  const shareUrl = createdPublicId
    ? `${window.location.origin}/r/${createdPublicId}`
    : "";

  const shareText = `I'm looking to barter "${offerSkill}" for "${needSkill}" on BarterConnect. Check it out!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: "Link copied!", description: "Share it with your network." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Could not copy", description: "Please copy the link manually.", variant: "destructive" });
    }
  };

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: SiLinkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      testId: "link-share-linkedin",
    },
    {
      name: "Facebook",
      icon: SiFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      testId: "link-share-facebook",
    },
    {
      name: "X",
      icon: SiX,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      testId: "link-share-x",
    },
    {
      name: "WhatsApp",
      icon: SiWhatsapp,
      url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      testId: "link-share-whatsapp",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <img src={logoPath} alt="BarterConnect" className="h-12 w-auto object-contain" />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {step === "welcome" && (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <img src={iconPath} alt="BarterConnect" className="w-16 h-auto max-w-full" />
              </div>
              <CardTitle className="text-2xl" data-testid="text-welcome-title">
                Welcome to BarterConnect{user?.name ? `, ${user.name}` : ""}!
              </CardTitle>
              <CardDescription>
                You're part of a community that trades skills and services without money.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <p>Create a barter request describing what you can offer and what you need in return.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Share2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <p>Share your request with your network to find the right match faster.</p>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <p>Connect with people, exchange skills, and grow together.</p>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => setStep("create")}
                data-testid="button-start-onboarding"
              >
                Create Your First Request
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/app")}
                data-testid="button-skip-onboarding"
              >
                Skip for now
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "create" && (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl" data-testid="text-create-title">Create Your First Barter Request</CardTitle>
              <CardDescription>
                Tell others what you can offer and what you need in return.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="offerSkill">What can you offer? *</Label>
                  <Input
                    id="offerSkill"
                    placeholder="e.g., Web Development, Guitar Lessons"
                    value={offerSkill}
                    onChange={(e) => setOfferSkill(e.target.value)}
                    required
                    data-testid="input-onboarding-offer-skill"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="needSkill">What do you need? *</Label>
                  <Input
                    id="needSkill"
                    placeholder="e.g., Photography, Spanish Tutoring"
                    value={needSkill}
                    onChange={(e) => setNeedSkill(e.target.value)}
                    required
                    data-testid="input-onboarding-need-skill"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add more details about what you're offering or looking for..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    data-testid="input-onboarding-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="San Francisco"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    data-testid="input-onboarding-city"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isRemote"
                    checked={isRemote}
                    onCheckedChange={(checked) => setIsRemote(checked === true)}
                    data-testid="checkbox-onboarding-remote"
                  />
                  <Label htmlFor="isRemote" className="text-sm cursor-pointer">
                    Available remotely
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="button-onboarding-submit">
                  {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Request
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "success" && (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                  <Check className="w-7 h-7 text-accent" />
                </div>
              </div>
              <CardTitle className="text-2xl" data-testid="text-success-title">Your request is live!</CardTitle>
              <CardDescription>
                Share it with your network to find a match faster.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {shareUrl && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={shareUrl}
                      className="text-sm"
                      data-testid="input-onboarding-share-url"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                      data-testid="button-onboarding-copy-link"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {socialLinks.map((social) => (
                      <Button
                        key={social.name}
                        variant="outline"
                        size="default"
                        asChild
                        data-testid={social.testId}
                      >
                        <a href={social.url} target="_blank" rel="noopener noreferrer">
                          <social.icon className="w-4 h-4 mr-2" />
                          {social.name}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                onClick={() => navigate("/app")}
                data-testid="button-onboarding-go-dashboard"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <footer className="border-t py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center">
          <img src={logoPath} alt="BarterConnect" className="w-36" />
        </div>
      </footer>
    </div>
  );
}
