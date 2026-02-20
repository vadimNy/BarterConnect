import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import AppLayout from "@/components/app-layout";
import {
  PlusCircle,
  Zap,
  Heart,
  ArrowRight,
  MapPin,
  Wifi,
  List,
} from "lucide-react";
import type { Request } from "@shared/schema";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: myRequests, isLoading } = useQuery<Request[]>({
    queryKey: ["/api/requests"],
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/requests/new">
            <Card className="hover-elevate cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary shrink-0">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">New Request</p>
                  <p className="text-xs text-muted-foreground">Post a skill barter</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/matches">
            <Card className="hover-elevate cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary shrink-0">
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
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Interests</p>
                  <p className="text-xs text-muted-foreground">Manage connections</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <List className="w-5 h-5" />
              My Open Requests
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
                <p className="font-medium mb-1">No open requests yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first barter request to start getting matched!
                </p>
                <Link href="/requests/new">
                  <Button size="sm" data-testid="button-create-first">Create Request</Button>
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
      </div>
    </AppLayout>
  );
}
