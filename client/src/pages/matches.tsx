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
  Search,
} from "lucide-react";

type MatchData = {
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
  };
  matchType: "exact" | "keyword";
  matchingKeywords: string[];
  alreadyInterested: boolean;
  sameCity: boolean;
};

export default function MatchesPage() {
  const { data: matches, isLoading } = useQuery<MatchData[]>({
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
            <Zap className="w-6 h-6 text-accent" />
            Matches
          </h1>
          <p className="text-muted-foreground text-sm">
            People whose skills complement yours — exact and keyword matches
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-md" />
            ))}
          </div>
        ) : !matches || matches.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1">No matches yet</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Matches appear when someone offers what you need and needs what you offer. Share your requests to reach more people!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card key={`${match.myRequest.id}-${match.matchedRequest.id}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <UserAvatar
                      name={match.matchedRequest.userName}
                      avatarUrl={match.matchedRequest.userAvatarUrl}
                      className="h-7 w-7"
                    />
                    {match.matchType === "exact" ? (
                      <Badge variant="secondary" className="text-xs font-medium">
                        <ArrowLeftRight className="w-3 h-3 mr-1" />
                        Exact Match
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs font-medium bg-accent/10 text-accent">
                        <Search className="w-3 h-3 mr-1" />
                        Keyword Match
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      with <span className="font-medium text-foreground">{match.matchedRequest.userName}</span>
                    </span>
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {match.matchedRequest.isRemote ? (
                        <><Wifi className="w-3 h-3 mr-1" /> Remote</>
                      ) : (
                        <><MapPin className="w-3 h-3 mr-1" /> {match.matchedRequest.city}</>
                      )}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-md p-3 space-y-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">You offer</p>
                      <p className="text-sm font-medium text-primary">{match.myRequest.offerSkill}</p>
                      <p className="text-xs text-muted-foreground">They need this</p>
                    </div>
                    <div className="bg-muted/50 rounded-md p-3 space-y-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">They offer</p>
                      <p className="text-sm font-medium text-primary">{match.matchedRequest.offerSkill}</p>
                      <p className="text-xs text-muted-foreground">You need this</p>
                    </div>
                  </div>

                  {match.matchType === "keyword" && match.matchingKeywords.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">Matching keywords:</span>
                      {match.matchingKeywords.map((kw) => (
                        <Badge key={kw} variant="outline" className="text-[10px] px-1.5 py-0">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {match.matchedRequest.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {match.matchedRequest.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    {match.alreadyInterested ? (
                      <Badge variant="secondary" className="text-xs">
                        <Heart className="w-3 h-3 mr-1" />
                        Interest Sent
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={() =>
                          interestMutation.mutate({
                            requestId: match.myRequest.id,
                            targetRequestId: match.matchedRequest.id,
                          })
                        }
                        disabled={interestMutation.isPending}
                        data-testid={`button-interested-${match.matchedRequest.id}`}
                      >
                        <Heart className="w-3.5 h-3.5" />
                        I'm Interested
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
