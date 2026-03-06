import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { UserAvatar } from "@/components/user-avatar";
import AppLayout from "@/components/app-layout";
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Inbox,
} from "lucide-react";

type ConversationData = {
  id: number;
  otherUser: {
    id: number;
    name: string;
    avatarUrl: string | null;
  } | null;
  lastMessage: {
    body: string;
    senderId: number;
    createdAt: string;
  } | null;
  unreadCount: number;
  createdAt: string;
};

type MessageData = {
  id: number;
  conversationId: number;
  senderId: number;
  body: string;
  createdAt: string;
  senderName: string;
  senderAvatarUrl: string | null;
};

export default function MessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: convsLoading } = useQuery<ConversationData[]>({
    queryKey: ["/api/conversations"],
    refetchInterval: 5000,
  });

  const { data: messages, isLoading: msgsLoading } = useQuery<MessageData[]>({
    queryKey: ["/api/conversations", selectedConvId, "messages"],
    enabled: !!selectedConvId,
    refetchInterval: 3000,
  });

  const sendMutation = useMutation({
    mutationFn: async ({ convId, body }: { convId: number; body: string }) => {
      await apiRequest("POST", `/api/conversations/${convId}/messages`, { body });
    },
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", selectedConvId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedConv = conversations?.find((c) => c.id === selectedConvId);

  const handleSend = () => {
    if (!messageText.trim() || !selectedConvId) return;
    sendMutation.mutate({ convId: selectedConvId, body: messageText.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (selectedConvId && selectedConv) {
    return (
      <AppLayout>
        <div className="flex flex-col h-[calc(100vh-12rem)]">
          <div className="flex items-center gap-3 pb-4 border-b mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedConvId(null)}
              data-testid="button-back-to-conversations"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            {selectedConv.otherUser && (
              <>
                <UserAvatar
                  name={selectedConv.otherUser.name}
                  avatarUrl={selectedConv.otherUser.avatarUrl}
                  className="h-9 w-9"
                />
                <div>
                  <p className="font-medium text-sm" data-testid="text-conversation-name">
                    {selectedConv.otherUser.name}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pb-4">
            {msgsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-3/4 rounded-md" />
                ))}
              </div>
            ) : !messages || messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <MessageCircle className="w-10 h-10 mb-3 opacity-50" />
                <p className="text-sm">No messages yet. Say hello!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}
                    data-testid={`message-${msg.id}`}
                  >
                    {!isMe && (
                      <UserAvatar
                        name={msg.senderName}
                        avatarUrl={msg.senderAvatarUrl}
                        className="h-7 w-7 mt-1"
                      />
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t pt-3 flex gap-2">
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="min-h-[44px] max-h-[120px] resize-none"
              rows={1}
              data-testid="input-message"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!messageText.trim() || sendMutation.isPending}
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
            <MessageCircle className="w-6 h-6 text-accent" />
            Messages
          </h1>
          <p className="text-muted-foreground text-sm">
            Direct messages with your barter connections
          </p>
        </div>

        {convsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-md" />
            ))}
          </div>
        ) : !conversations || conversations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Inbox className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1">No conversations yet</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Conversations start when someone accepts an interest. Check your matches and send some interests!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <Card
                key={conv.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedConvId(conv.id)}
                data-testid={`conversation-${conv.id}`}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  {conv.otherUser && (
                    <UserAvatar
                      name={conv.otherUser.name}
                      avatarUrl={conv.otherUser.avatarUrl}
                      className="h-10 w-10"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">
                        {conv.otherUser?.name || "Unknown"}
                      </p>
                      <div className="flex items-center gap-2">
                        {conv.unreadCount > 0 && (
                          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                        )}
                        {conv.lastMessage && (
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatTime(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    {conv.lastMessage ? (
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {conv.lastMessage.senderId === user?.id ? "You: " : ""}
                        {conv.lastMessage.body}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic mt-0.5">
                        No messages yet
                      </p>
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
