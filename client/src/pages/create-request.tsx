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
import { Loader2, PlusCircle } from "lucide-react";

export default function CreateRequestPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [offerSkill, setOfferSkill] = useState("");
  const [needSkill, setNeedSkill] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState(user?.city || "");
  const [isRemote, setIsRemote] = useState(false);

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      toast({ title: "Request created!", description: "Your barter request is now live." });
      navigate("/requests");
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
                <Input
                  id="city"
                  placeholder="San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  data-testid="input-city"
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
