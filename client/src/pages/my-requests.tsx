import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AppLayout from "@/components/app-layout";
import {
  PlusCircle,
  ArrowRight,
  MapPin,
  Wifi,
  Trash2,
  XCircle,
  Share2,
  Copy,
  List,
} from "lucide-react";
import type { Request } from "@shared/schema";

export default function MyRequestsPage() {
  const { data: requests, isLoading } = useQuery<Request[]>({
    queryKey: ["/api/requests"],
  });
  const { toast } = useToast();

  const closeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/requests/${id}/close`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      toast({ title: "Barter closed" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/requests/${id}/delete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      toast({ title: "Barter deleted" });
    },
  });

  const copyShareLink = (publicId: string) => {
    const url = `${window.location.origin}/r/${publicId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: "Link copied!", description: "Share it with anyone." });
    }).catch(() => {
      toast({ title: "Share link", description: url });
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <List className="w-6 h-6" />
            My Barters
          </h1>
          <Link href="/requests/new">
            <Button size="sm" className="gap-1.5" data-testid="button-new-request">
              <PlusCircle className="w-4 h-4" />
              New Barter
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-md" />
            ))}
          </div>
        ) : !requests || requests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <List className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1">No barters yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first barter to find skill matches.
              </p>
              <Link href="/requests/new">
                <Button size="sm" data-testid="button-create-first-request">Create Barter</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <Card key={req.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
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
                        {req.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{req.description}</p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {req.isRemote ? (
                              <><Wifi className="w-3 h-3 mr-1" /> Remote</>
                            ) : (
                              <><MapPin className="w-3 h-3 mr-1" /> {req.city}</>
                            )}
                          </Badge>
                          <Badge
                            variant={req.status === "open" ? "outline" : "secondary"}
                            className="text-xs"
                          >
                            {req.status === "open" ? "Open" : "Closed"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => copyShareLink(req.publicId)}
                        data-testid={`button-share-${req.id}`}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                      </Button>
                      {req.status === "open" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => closeMutation.mutate(req.id)}
                          disabled={closeMutation.isPending}
                          data-testid={`button-close-${req.id}`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Close
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-destructive"
                        onClick={() => deleteMutation.mutate(req.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${req.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </div>
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
