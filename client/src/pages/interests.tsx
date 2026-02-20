import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AppLayout from "@/components/app-layout";
import {
  Heart,
  Check,
  X,
  ArrowRight,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Inbox,
  Send,
} from "lucide-react";

type InterestData = {
  id: number;
  status: string;
  requesterName: string;
  requesterEmail: string;
  myRequestOffer: string;
  myRequestNeed: string;
  theirRequestOffer: string;
  theirRequestNeed: string;
  createdAt: string;
};

export default function InterestsPage() {
  const { data: interestData, isLoading } = useQuery<{
    incoming: InterestData[];
    outgoing: InterestData[];
  }>({
    queryKey: ["/api/interests"],
  });
  const { toast } = useToast();

  const acceptMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/interests/${id}/accept`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interests"] });
      toast({ title: "Interest accepted!", description: "Contact info is now shared." });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/interests/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interests"] });
      toast({ title: "Interest rejected" });
    },
  });

  const incoming = interestData?.incoming || [];
  const outgoing = interestData?.outgoing || [];

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "pending") return <Badge variant="secondary" className="text-xs"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    if (status === "accepted") return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>;
    return <Badge variant="secondary" className="text-xs"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
  };

  const EmptyState = ({ type }: { type: "incoming" | "outgoing" }) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          {type === "incoming" ? (
            <Inbox className="w-6 h-6 text-muted-foreground" />
          ) : (
            <Send className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <p className="font-medium mb-1">
          No {type} interests yet
        </p>
        <p className="text-sm text-muted-foreground max-w-sm">
          {type === "incoming"
            ? "When someone is interested in bartering with you, it will show up here."
            : "Express interest in matches to start connecting with people."}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
            <Heart className="w-6 h-6" />
            Interests
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your incoming and outgoing interest requests
          </p>
        </div>

        <Tabs defaultValue="incoming" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="incoming" className="gap-1.5" data-testid="tab-incoming">
              <Inbox className="w-4 h-4" />
              Incoming ({incoming.length})
            </TabsTrigger>
            <TabsTrigger value="outgoing" className="gap-1.5" data-testid="tab-outgoing">
              <Send className="w-4 h-4" />
              Outgoing ({outgoing.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incoming" className="mt-4 space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => <Skeleton key={i} className="h-28 w-full rounded-md" />)}
              </div>
            ) : incoming.length === 0 ? (
              <EmptyState type="incoming" />
            ) : (
              incoming.map((interest) => (
                <Card key={interest.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-sm font-medium">{interest.requesterName}</span>
                      <StatusBadge status={interest.status} />
                    </div>

                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-muted-foreground">They offer:</span>
                        <span className="font-medium text-primary">{interest.theirRequestOffer}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-muted-foreground">They need:</span>
                        <span className="font-medium text-primary">{interest.theirRequestNeed}</span>
                      </div>
                    </div>

                    {interest.status === "accepted" && (
                      <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 text-sm">
                        <Mail className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">Contact:</span>
                        <a
                          href={`mailto:${interest.requesterEmail}`}
                          className="text-primary hover:underline font-medium"
                          data-testid={`text-email-${interest.id}`}
                        >
                          {interest.requesterEmail}
                        </a>
                      </div>
                    )}

                    {interest.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="gap-1.5"
                          onClick={() => acceptMutation.mutate(interest.id)}
                          disabled={acceptMutation.isPending}
                          data-testid={`button-accept-${interest.id}`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => rejectMutation.mutate(interest.id)}
                          disabled={rejectMutation.isPending}
                          data-testid={`button-reject-${interest.id}`}
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="outgoing" className="mt-4 space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => <Skeleton key={i} className="h-28 w-full rounded-md" />)}
              </div>
            ) : outgoing.length === 0 ? (
              <EmptyState type="outgoing" />
            ) : (
              outgoing.map((interest) => (
                <Card key={interest.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-sm font-medium">
                        To: {interest.requesterName}
                      </span>
                      <StatusBadge status={interest.status} />
                    </div>

                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-muted-foreground">You offer:</span>
                        <span className="font-medium text-primary">{interest.myRequestOffer}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-muted-foreground">You need:</span>
                        <span className="font-medium text-primary">{interest.myRequestNeed}</span>
                      </div>
                    </div>

                    {interest.status === "accepted" && (
                      <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 text-sm">
                        <Mail className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">Contact:</span>
                        <a
                          href={`mailto:${interest.requesterEmail}`}
                          className="text-primary hover:underline font-medium"
                          data-testid={`text-email-${interest.id}`}
                        >
                          {interest.requesterEmail}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
