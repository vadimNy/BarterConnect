import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UserAvatar } from "@/components/user-avatar";
import AppLayout from "@/components/app-layout";
import {
  Zap,
  MapPin,
  Wifi,
  Heart,
  ArrowLeftRight,
  HandHeart,
  Handshake,
  CheckCircle2,
} from "lucide-react";

type MatchItem = {
  myRequest: {
    id: number;
    offerSkill: string;
    needSkill: string;
    city: string;
    isRemote: boolean;
  };
  matchedRequest: {
    id: number;
    offerSkill: string;
    needSkill: string;
    city: string;
    isRemote: boolean;
    description: string | null;
    userName: string;
    userAvatarUrl: string | null;
    completedBarters: number;
  };
  matchType: string;
  alreadyInterested: boolean;
  sameCity: boolean;
};

type MatchesResponse = {
  perfectMatches: MatchItem[];
  offersWhatINeed: MatchItem[];
  needsWhatIOffer: MatchItem[];
};

function MatchCard({
  match,
  onInterest,
  isPending,
}: {
  match: MatchItem;
  onInterest: (requestId: number, targetRequestId: number) => void;
  isPending: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <UserAvatar
            name={match.matchedRequest.userName}
            avatarUrl={match.matchedRequest.userAvatarUrl}
            className="h-7 w-7"
          />
          <span className="text-sm font-medium" data-testid={`text-match-user-${match.matchedRequest.id}`}>
            {match.matchedRequest.userName}
          </span>
          {match.matchedRequest.completedBarters > 0 && (
            <Badge variant="secondary" className="text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {match.matchedRequest.completedBarters} barter{match.matchedRequest.completedBarters !== 1 ? "s" : ""}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs ml-auto">
            {match.matchedRequest.isRemote ? (
              <><Wifi className="w-3 h-3 mr-1" /> Remote</>
            ) : (
              <>
                <MapPin className="w-3 h-3 mr-1" />
                {match.matchedRequest.city}
                {match.sameCity && (
                  <span className="ml-1 text-accent">&middot; Same city</span>
                )}
              </>
            )}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-md p-3 space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">They offer</p>
            <p className="text-sm font-medium" data-testid={`text-offer-${match.matchedRequest.id}`}>
              {match.matchedRequest.offerSkill}
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-3 space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">They need</p>
            <p className="text-sm font-medium" data-testid={`text-need-${match.matchedRequest.id}`}>
              {match.matchedRequest.needSkill}
            </p>
          </div>
        </div>

        {match.matchedRequest.description && (
          <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-description-${match.matchedRequest.id}`}>
            {match.matchedRequest.description}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {match.alreadyInterested ? (
            <Badge variant="secondary" className="text-xs" data-testid={`badge-interested-${match.matchedRequest.id}`}>
              <Heart className="w-3 h-3 mr-1" />
              Interest Sent
            </Badge>
          ) : (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => onInterest(match.myRequest.id, match.matchedRequest.id)}
              disabled={isPending}
              data-testid={`button-interested-${match.matchedRequest.id}`}
            >
              <Heart className="w-3.5 h-3.5" />
              I'm Interested
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SectionEmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Zap;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="font-medium mb-1 text-sm">{title}</p>
        <p className="text-xs text-muted-foreground max-w-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function MatchesPage() {
  const { data, isLoading } = useQuery<MatchesResponse>({
    queryKey: ["/api/matches"],
  });
  const { toast } = useToast();

  const interestMutation = useMutation({
    mutationFn: async ({ requestId, targetRequestId }: { requestId: number; targetRequestId: number }) => {
      await apiRequest("POST", "/api/interests", { requestId, targetRequestId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/interests"] });
      toast({ title: "Interest sent!", description: "They'll be notified of your interest." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleInterest = (requestId: number, targetRequestId: number) => {
    interestMutation.mutate({ requestId, targetRequestId });
  };

  const totalCount = data
    ? data.perfectMatches.length + data.offersWhatINeed.length + data.needsWhatIOffer.length
    : 0;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-1" data-testid="text-matches-title">
            <Zap className="w-6 h-6 text-accent" />
            Matches
          </h1>
          <p className="text-muted-foreground text-sm" data-testid="text-matches-subtitle">
            People whose skills complement yours
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-32 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : !data || totalCount === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1" data-testid="text-no-matches">No matches yet</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Matches appear when someone offers what you need or needs what you offer. Create more requests and share them to reach more people!
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <section className="space-y-3" data-testid="section-perfect-matches">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold">Perfect Matches</h2>
                {data.perfectMatches.length > 0 && (
                  <Badge variant="secondary" className="text-xs">{data.perfectMatches.length}</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground -mt-1">
                They offer what you need and need what you offer
              </p>
              {data.perfectMatches.length === 0 ? (
                <SectionEmptyState
                  icon={ArrowLeftRight}
                  title="No perfect matches yet"
                  description="Perfect matches happen when someone offers exactly what you need and needs exactly what you offer. Keep your requests up to date!"
                />
              ) : (
                <div className="space-y-3">
                  {data.perfectMatches.map((match) => (
                    <MatchCard
                      key={`perfect-${match.myRequest.id}-${match.matchedRequest.id}`}
                      match={match}
                      onInterest={handleInterest}
                      isPending={interestMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-3" data-testid="section-offers-what-i-need">
              <div className="flex items-center gap-2">
                <HandHeart className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold">People Offering What You Need</h2>
                {data.offersWhatINeed.length > 0 && (
                  <Badge variant="secondary" className="text-xs">{data.offersWhatINeed.length}</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground -mt-1">
                They offer a skill you're looking for, but need something different in return
              </p>
              {data.offersWhatINeed.length === 0 ? (
                <SectionEmptyState
                  icon={HandHeart}
                  title="No partial matches here yet"
                  description="When someone offers what you need but isn't looking for what you offer, they'll appear here. You can still express interest!"
                />
              ) : (
                <div className="space-y-3">
                  {data.offersWhatINeed.map((match) => (
                    <MatchCard
                      key={`offer-${match.myRequest.id}-${match.matchedRequest.id}`}
                      match={match}
                      onInterest={handleInterest}
                      isPending={interestMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-3" data-testid="section-needs-what-i-offer">
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold">People Who Need What You Offer</h2>
                {data.needsWhatIOffer.length > 0 && (
                  <Badge variant="secondary" className="text-xs">{data.needsWhatIOffer.length}</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground -mt-1">
                They need a skill you offer, but are offering something different
              </p>
              {data.needsWhatIOffer.length === 0 ? (
                <SectionEmptyState
                  icon={Handshake}
                  title="No one needs your skills yet"
                  description="When someone is looking for what you offer but offers something different, they'll show up here."
                />
              ) : (
                <div className="space-y-3">
                  {data.needsWhatIOffer.map((match) => (
                    <MatchCard
                      key={`need-${match.myRequest.id}-${match.matchedRequest.id}`}
                      match={match}
                      onInterest={handleInterest}
                      isPending={interestMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}
