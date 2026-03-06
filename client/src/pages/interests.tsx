import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UserAvatar } from "@/components/user-avatar";
import { useLocation } from "wouter";
import AppLayout from "@/components/app-layout";
import {
  Heart,
  Check,
  X,
  Mail,
  Clock,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Inbox,
  Send,
  MessageCircle,
  Trophy,
  Loader2,
  HandshakeIcon,
  ArrowUpRight,
  ArrowDownRight,
  Equal,
} from "lucide-react";

type InterestData = {
  id: number;
  status: string;
  requesterName: string;
  requesterEmail: string;
  requesterAvatarUrl: string | null;
  requesterUserId: number;
  targetUserId: number;
  myRequestOffer: string;
  myRequestNeed: string;
  theirRequestOffer: string;
  theirRequestNeed: string;
  completedByRequester: boolean;
  completedByTarget: boolean;
  isRequester: boolean;
  createdAt: string;
  conversationId: number | null;
};

function getCompletionStatus(interest: InterestData) {
  const bothCompleted = interest.completedByRequester && interest.completedByTarget;
  const iCompletedMySide = interest.isRequester
    ? interest.completedByRequester
    : interest.completedByTarget;
  const theyCompletedTheirSide = interest.isRequester
    ? interest.completedByTarget
    : interest.completedByRequester;

  return { bothCompleted, iCompletedMySide, theyCompletedTheirSide };
}

export default function InterestsPage() {
  const { data: interestData, isLoading } = useQuery<{
    incoming: InterestData[];
    outgoing: InterestData[];
  }>({
    queryKey: ["/api/interests"],
  });
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [favorDialogOpen, setFavorDialogOpen] = useState(false);
  const [pendingCompleteId, setPendingCompleteId] = useState<number | null>(null);
  const [pendingOtherUserId, setPendingOtherUserId] = useState<number | null>(null);
  const [pendingOtherUserName, setPendingOtherUserName] = useState("");

  const acceptMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/interests/${id}/accept`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interests"] });
      toast({ title: "Interest accepted!", description: "You can now message each other." });
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

  const completeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/interests/${id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const favorMutation = useMutation({
    mutationFn: async ({ otherUserId, direction }: { otherUserId: number; direction: string }) => {
      await apiRequest("POST", "/api/favors/record", { otherUserId, direction });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favors"] });
    },
  });

  const handleMarkComplete = (interest: InterestData) => {
    const otherUserId = interest.isRequester ? interest.targetUserId : interest.requesterUserId;
    const { theyCompletedTheirSide } = getCompletionStatus(interest);
    setPendingCompleteId(interest.id);
    setPendingOtherUserId(otherUserId);
    setPendingOtherUserName(interest.requesterName);
    completeMutation.mutate(interest.id, {
      onSuccess: () => {
        if (theyCompletedTheirSide) {
          setFavorDialogOpen(true);
        } else {
          toast({ title: "Marked as completed!", description: "Waiting for the other party to confirm." });
        }
      },
    });
  };

  const handleFavorChoice = (direction: string) => {
    if (pendingOtherUserId) {
      favorMutation.mutate({ otherUserId: pendingOtherUserId, direction });
    }
    setFavorDialogOpen(false);
    setPendingCompleteId(null);
    setPendingOtherUserId(null);
    setPendingOtherUserName("");
    toast({ title: "Barter completed!", description: "Both parties confirmed. Favor recorded." });
  };

  const incoming = interestData?.incoming || [];
  const outgoing = interestData?.outgoing || [];

  const StatusBadge = ({ status, interest }: { status: string; interest: InterestData }) => {
    if (status === "pending") return <Badge variant="secondary" className="text-xs"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    if (status === "accepted") {
      const { bothCompleted } = getCompletionStatus(interest);
      if (bothCompleted) {
        return <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"><Trophy className="w-3 h-3 mr-1" />Completed</Badge>;
      }
      return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>;
    }
    return <Badge variant="secondary" className="text-xs"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
  };

  const CompletionSection = ({ interest }: { interest: InterestData }) => {
    if (interest.status !== "accepted") return null;

    const { bothCompleted, iCompletedMySide, theyCompletedTheirSide } = getCompletionStatus(interest);

    if (bothCompleted) {
      return (
        <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-900/10 text-sm" data-testid={`status-completed-${interest.id}`}>
          <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="text-amber-800 dark:text-amber-300 font-medium">Barter completed! Both parties confirmed.</span>
        </div>
      );
    }

    if (iCompletedMySide) {
      return (
        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 text-sm" data-testid={`status-waiting-${interest.id}`}>
          <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">You marked this as completed. Waiting for {interest.requesterName} to confirm.</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 flex-wrap">
        {theyCompletedTheirSide && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 dark:bg-green-900/10 text-sm flex-1" data-testid={`status-they-completed-${interest.id}`}>
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
            <span className="text-green-800 dark:text-green-300">{interest.requesterName} marked this as completed. Confirm to finalize!</span>
          </div>
        )}
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => handleMarkComplete(interest)}
          disabled={completeMutation.isPending}
          data-testid={`button-complete-${interest.id}`}
        >
          {completeMutation.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
          Mark as Completed
        </Button>
      </div>
    );
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
            <Heart className="w-6 h-6 text-accent" />
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
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          name={interest.requesterName}
                          avatarUrl={interest.requesterAvatarUrl}
                          className="h-7 w-7"
                        />
                        <span className="text-sm font-medium">{interest.requesterName}</span>
                      </div>
                      <StatusBadge status={interest.status} interest={interest} />
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 text-sm flex-1">
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
                        {interest.conversationId && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => setLocation("/messages")}
                            data-testid={`button-message-${interest.id}`}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Message
                          </Button>
                        )}
                      </div>
                    )}

                    <CompletionSection interest={interest} />

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
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          name={interest.requesterName}
                          avatarUrl={interest.requesterAvatarUrl}
                          className="h-7 w-7"
                        />
                        <span className="text-sm font-medium">
                          To: {interest.requesterName}
                        </span>
                      </div>
                      <StatusBadge status={interest.status} interest={interest} />
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 text-sm flex-1">
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
                        {interest.conversationId && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => setLocation("/messages")}
                            data-testid={`button-message-${interest.id}`}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Message
                          </Button>
                        )}
                      </div>
                    )}

                    <CompletionSection interest={interest} />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={favorDialogOpen} onOpenChange={setFavorDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HandshakeIcon className="w-5 h-5 text-accent" />
              Favor Ledger
            </DialogTitle>
            <DialogDescription>
              Was this barter balanced, or does someone owe a favor?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => handleFavorChoice("balanced")}
              data-testid="button-favor-balanced"
            >
              <Equal className="w-5 h-5 text-muted-foreground shrink-0" />
              <div className="text-left">
                <p className="font-medium text-sm">Balanced</p>
                <p className="text-xs text-muted-foreground">Fair exchange, no favors owed</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => handleFavorChoice("i_owe_them")}
              data-testid="button-favor-i-owe"
            >
              <ArrowDownRight className="w-5 h-5 text-orange-500 shrink-0" />
              <div className="text-left">
                <p className="font-medium text-sm">I owe {pendingOtherUserName} a favor</p>
                <p className="text-xs text-muted-foreground">They did more for you this time</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => handleFavorChoice("they_owe_me")}
              data-testid="button-favor-they-owe"
            >
              <ArrowUpRight className="w-5 h-5 text-green-500 shrink-0" />
              <div className="text-left">
                <p className="font-medium text-sm">{pendingOtherUserName} owes me a favor</p>
                <p className="text-xs text-muted-foreground">You did more for them this time</p>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
