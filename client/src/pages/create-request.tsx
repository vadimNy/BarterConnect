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
import AppLayout from "@/components/app-layout";
import { Loader2, PlusCircle, CheckCircle2, Copy, ExternalLink, ArrowRight } from "lucide-react";
import { SiLinkedin, SiFacebook, SiX, SiWhatsapp } from "react-icons/si";
import { CityPicker } from "@/components/city-picker";
import type { Request } from "@shared/schema";

export default function CreateRequestPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [offerSkill, setOfferSkill] = useState("");
  const [needSkill, setNeedSkill] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState(user?.city || "");
  const [isRemote, setIsRemote] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<Request | null>(null);

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
    onSuccess: (data: Request) => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      setCreatedRequest(data);
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

  const getShareUrl = () => {
    if (!createdRequest) return "";
    return `${window.location.origin}/r/${createdRequest.publicId}`;
  };

  const getShareText = () => {
    if (!createdRequest) return "";
    return `I'm offering ${createdRequest.offerSkill} and looking for ${createdRequest.needSkill} on BarterConnect. Let's trade skills!`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      toast({ title: "Link copied!", description: "Share it with your network." });
    } catch {
      toast({ title: "Error", description: "Could not copy link", variant: "destructive" });
    }
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareX = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(getShareText() + " " + getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (createdRequest) {
    return (
      <AppLayout>
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <CardTitle data-testid="text-success-title">Your barter request is live!</CardTitle>
              <CardDescription>
                Share it with your network to find the perfect match faster.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md bg-muted p-4 space-y-1">
                <p className="text-sm text-muted-foreground">Offering</p>
                <p className="font-medium" data-testid="text-success-offer">{createdRequest.offerSkill}</p>
                <p className="text-sm text-muted-foreground mt-2">Looking for</p>
                <p className="font-medium" data-testid="text-success-need">{createdRequest.needSkill}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-center">Share your request</p>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={handleCopyLink}
                  data-testid="button-copy-link"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                  <span className="ml-auto text-xs text-muted-foreground truncate max-w-[180px]">
                    {getShareUrl()}
                  </span>
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleShareLinkedIn}
                    data-testid="button-share-linkedin"
                  >
                    <SiLinkedin className="w-4 h-4" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleShareFacebook}
                    data-testid="button-share-facebook"
                  >
                    <SiFacebook className="w-4 h-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleShareX}
                    data-testid="button-share-x"
                  >
                    <SiX className="w-4 h-4" />
                    Post on X
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleShareWhatsApp}
                    data-testid="button-share-whatsapp"
                  >
                    <SiWhatsapp className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button onClick={() => navigate("/requests")} data-testid="button-view-requests">
                  View My Requests
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCreatedRequest(null);
                    setOfferSkill("");
                    setNeedSkill("");
                    setDescription("");
                    setCity(user?.city || "");
                    setIsRemote(false);
                  }}
                  data-testid="button-create-another"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Another Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-accent" />
              Create Barter Request
            </CardTitle>
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
                  data-testid="input-offer-skill"
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
                  data-testid="input-need-skill"
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
                  data-testid="input-description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <CityPicker
                  id="city"
                  value={city}
                  onChange={setCity}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="isRemote"
                  checked={isRemote}
                  onCheckedChange={(checked) => setIsRemote(checked === true)}
                  data-testid="checkbox-remote"
                />
                <Label htmlFor="isRemote" className="text-sm cursor-pointer">
                  Available remotely
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="button-submit-request">
                {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
