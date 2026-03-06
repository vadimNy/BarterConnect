import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { UserAvatar } from "@/components/user-avatar";
import AppLayout from "@/components/app-layout";
import {
  PlusCircle,
  Zap,
  Heart,
  ArrowRight,
  MapPin,
  Wifi,
  List,
  MessageCircle,
  Users,
  CheckCircle2,
} from "lucide-react";
import type { Request } from "@shared/schema";

interface SuggestedPerson {
  id: number;
  name: string;
  city: string;
  avatarUrl: string | null;
  completedBarters: number;
  offeredSkills: string[];
  neededSkills: string[];
  relevanceScore: number;
  isRemote: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: myRequests, isLoading } = useQuery<Request[]>({
    queryKey: ["/api/requests"],
  });
  const { data: suggestions, isLoading: suggestionsLoading } = useQuery<SuggestedPerson[]>({
    queryKey: ["/api/suggestions"],
  });

  const openRequests = myRequests?.filter((r) => r.status === "open") || [];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-1" data-testid="text-welcome">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            Ready to barter some skills?
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/requests/new">
            <Card className="hover-elevate cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-accent/15 text-accent shrink-0">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">New Barter</p>
                  <p className="text-xs text-muted-foreground">Post a skill barter</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/matches">
            <Card className="hover-elevate cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-accent shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">View Matches</p>
                  <p className="text-xs text-muted-foreground">See who matches you</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/interests">
            <Card className="hover-elevate cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary shrink-0">
                  <Heart className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Interests</p>
                  <p className="text-xs text-muted-foreground">Manage connections</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/messages">
            <Card className="hover-elevate cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary shrink-0">
                  <MessageCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Messages</p>
                  <p className="text-xs text-muted-foreground">Chat with connections</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <List className="w-5 h-5" />
              My Open Barters
            </h2>
            <Link href="/requests">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="link-view-all-requests">
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-md" />
              ))}
            </div>
          ) : openRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <PlusCircle className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-medium mb-1">No open barters yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first barter to start getting matched!
                </p>
                <Link href="/requests/new">
                  <Button size="sm" data-testid="button-create-first">Create Barter</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {openRequests.slice(0, 5).map((req) => (
                <Card key={req.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">
                            Offer: <span className="text-primary">{req.offerSkill}</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium">
                            Need: <span className="text-primary">{req.needSkill}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {req.isRemote ? (
                              <><Wifi className="w-3 h-3 mr-1" /> Remote</>
                            ) : (
                              <><MapPin className="w-3 h-3 mr-1" /> {req.city}</>
                            )}
                          </Badge>
                          <Badge variant="outline" className="text-xs">Open</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              People You Might Barter With
            </h2>
          </div>

          {suggestionsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-40 w-full rounded-md" />
              ))}
            </div>
          ) : !suggestions || suggestions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-medium mb-1" data-testid="text-no-suggestions">No suggestions yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Create barters to find people with matching skills!
                </p>
                <Link href="/requests/new">
                  <Button size="sm" data-testid="button-create-for-suggestions">Create Barter</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestions.map((person) => (
                <Card key={person.id} data-testid={`card-suggestion-${person.id}`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={person.name}
                        avatarUrl={person.avatarUrl}
                        className="h-10 w-10"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate" data-testid={`text-suggestion-name-${person.id}`}>
                          {person.name}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {person.isRemote ? (
                              <><Wifi className="w-3 h-3" /> Remote</>
                            ) : (
                              <><MapPin className="w-3 h-3" /> {person.city}</>
                            )}
                          </span>
                          {person.completedBarters > 0 && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1" data-testid={`text-barters-count-${person.id}`}>
                              <CheckCircle2 className="w-3 h-3" />
                              {person.completedBarters} completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {person.offeredSkills.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs text-muted-foreground shrink-0">Offers:</span>
                          {person.offeredSkills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {person.neededSkills.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs text-muted-foreground shrink-0">Needs:</span>
                          {person.neededSkills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link href="/matches">
                      <Button variant="outline" size="sm" className="w-full gap-1.5" data-testid={`button-view-matches-${person.id}`}>
                        <Zap className="w-3.5 h-3.5" />
                        View Matches
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
