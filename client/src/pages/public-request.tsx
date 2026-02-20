import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, MapPin, Wifi, User } from "lucide-react";
import logoPath from "@assets/BarterConnect_Logo_1771569174270.png";

type PublicRequest = {
  offerSkill: string;
  needSkill: string;
  description: string | null;
  city: string;
  isRemote: boolean;
  userName: string;
};

export default function PublicRequestPage() {
  const params = useParams<{ publicId: string }>();
  const { data: request, isLoading, error } = useQuery<PublicRequest>({
    queryKey: ["/api/public", params.publicId],
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <Link href="/" className="header-logo-wrap">
            <img src={logoPath} alt="BarterConnect" data-testid="public-header-logo" />
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-lg mx-auto px-4 py-8 w-full">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-48 w-full rounded-md" />
          </div>
        ) : error || !request ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="font-medium mb-1">Request not found</p>
              <p className="text-sm text-muted-foreground mb-4">
                This barter request may have been closed or deleted.
              </p>
              <Link href="/">
                <Button size="sm">Go to BarterConnect</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2" data-testid="text-public-title">
                Skill Barter Request
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span data-testid="text-public-user">Posted by {request.userName}</span>
              </div>
            </div>

            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-md p-4 space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Offering</p>
                    <p className="text-lg font-semibold text-primary" data-testid="text-public-offer">
                      {request.offerSkill}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-md p-4 space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Looking For</p>
                    <p className="text-lg font-semibold text-accent" data-testid="text-public-need">
                      {request.needSkill}
                    </p>
                  </div>
                </div>

                {request.description && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Details</p>
                    <p className="text-sm" data-testid="text-public-description">{request.description}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {request.isRemote ? (
                      <><Wifi className="w-3 h-3 mr-1" /> Remote</>
                    ) : (
                      <><MapPin className="w-3 h-3 mr-1" /> {request.city}</>
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-5 text-center space-y-3">
                <p className="font-semibold">Interested in this barter?</p>
                <p className="text-sm text-muted-foreground">
                  Join BarterConnect to respond and start exchanging skills.
                </p>
                <Link href="/signup">
                  <Button className="gap-2" data-testid="button-public-cta">
                    Respond on BarterConnect
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <footer className="border-t py-4 px-4">
        <div className="max-w-lg mx-auto flex items-center">
          <img src={logoPath} alt="BarterConnect" className="w-36" data-testid="public-footer-logo" />
        </div>
      </footer>
    </div>
  );
}
