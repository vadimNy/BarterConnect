import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, MapPin, Wifi, User, Repeat, ArrowRightLeft } from "lucide-react";
import logoPath from "@assets/BarterConnect_Logo_cropped.png";
import iconPath from "@assets/BarterConnect_Icon_cropped.png";
import { useEffect } from "react";

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

  useEffect(() => {
    if (request) {
      document.title = `${request.userName} wants to trade ${request.offerSkill} for ${request.needSkill} | BarterConnect`;
    }
    return () => {
      document.title = "BarterConnect";
    };
  }, [request]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <Link href="/">
            <img src={logoPath} alt="BarterConnect" className="h-12" data-testid="public-header-logo" />
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
        ) : error || !request ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="font-medium mb-1" data-testid="text-public-not-found">Request not found</p>
              <p className="text-sm text-muted-foreground mb-4">
                This barter request may have been closed or deleted.
              </p>
              <Link href="/">
                <Button size="sm" data-testid="button-public-go-home">Go to BarterConnect</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span data-testid="text-public-user">{request.userName}</span>
                <Badge variant="secondary" className="text-xs">
                  {request.isRemote ? (
                    <><Wifi className="w-3 h-3 mr-1" /> Remote</>
                  ) : (
                    <><MapPin className="w-3 h-3 mr-1" /> {request.city}</>
                  )}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight" data-testid="text-public-title">
                Looking for <span className="text-primary">{request.needSkill}</span> in exchange for <span className="text-primary">{request.offerSkill}</span>
              </h1>
            </div>

            <Card>
              <CardContent className="p-5 sm:p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                  <div className="bg-muted/50 rounded-md p-4 space-y-1 text-center">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Offering</p>
                    <p className="text-lg font-semibold" data-testid="text-public-offer">
                      {request.offerSkill}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center justify-center">
                    <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="bg-muted/50 rounded-md p-4 space-y-1 text-center">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Looking For</p>
                    <p className="text-lg font-semibold" data-testid="text-public-need">
                      {request.needSkill}
                    </p>
                  </div>
                </div>

                {request.description && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Details</p>
                    <p className="text-sm leading-relaxed" data-testid="text-public-description">{request.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-5 sm:p-6 text-center space-y-3">
                <Repeat className="w-8 h-8 mx-auto text-primary" />
                <p className="font-semibold text-lg">Interested in this barter?</p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Log in to BarterConnect to respond to this request and start exchanging skills.
                </p>
                <Link href="/login">
                  <Button className="gap-2" data-testid="button-public-cta">
                    Respond on BarterConnect
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={iconPath} alt="BarterConnect" className="w-10 h-10" data-testid="public-about-icon" />
                  <div>
                    <p className="font-semibold">What is BarterConnect?</p>
                    <p className="text-sm text-muted-foreground">A platform for exchanging skills without money</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  BarterConnect connects people who want to trade skills. Post what you can offer and what you need, 
                  get matched with others, and start exchanging knowledge and services.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <footer className="border-t py-6 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <img src={logoPath} alt="BarterConnect" className="w-36" data-testid="public-footer-logo" />
          <p className="text-xs text-muted-foreground">Exchange skills, not money.</p>
        </div>
      </footer>
    </div>
  );
}
