import {
  type User,
  type InsertUser,
  type Request,
  type InsertRequest,
  type Interest,
  type InsertInterest,
  type Conversation,
  type Message,
  type UpdateProfile,
  users,
  requests,
  interests,
  conversations,
  messages,
} from "@shared/schema";
import { eq, and, ne, desc, sql, or, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export interface IStorage {
  createUser(email: string, passwordHash: string, name: string, city: string, tosAccepted?: boolean): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  updateUserAvatar(id: number, avatarUrl: string): Promise<void>;
  updateUserProfile(id: number, data: UpdateProfile): Promise<User>;
  updateUserPassword(id: number, newPasswordHash: string): Promise<void>;

  createRequest(userId: number, data: InsertRequest, publicId: string): Promise<Request>;
  getRequestsByUser(userId: number): Promise<Request[]>;
  getRequestById(id: number): Promise<Request | undefined>;
  getRequestByPublicId(publicId: string): Promise<(Request & { userName: string }) | undefined>;
  closeRequest(id: number, userId: number): Promise<void>;
  deleteRequest(id: number, userId: number): Promise<void>;

  getMatchesForUser(userId: number): Promise<any[]>;

  createInterest(requesterUserId: number, requestId: number, targetRequestId: number): Promise<Interest>;
  getInterestsForUser(userId: number): Promise<{ incoming: any[]; outgoing: any[] }>;
  acceptInterest(id: number, userId: number): Promise<Interest>;
  rejectInterest(id: number, userId: number): Promise<void>;
  hasExistingInterest(requesterUserId: number, requestId: number, targetRequestId: number): Promise<boolean>;

  getOrCreateConversation(userAId: number, userBId: number, interestId?: number): Promise<Conversation>;
  getConversationsForUser(userId: number): Promise<any[]>;
  getConversationById(id: number): Promise<Conversation | undefined>;
  getMessages(conversationId: number): Promise<any[]>;
  createMessage(conversationId: number, senderId: number, body: string): Promise<Message>;
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "i", "me", "my", "we", "our", "you", "your", "he", "she", "it", "they",
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "is", "am", "are", "was", "were", "be", "been",
    "have", "has", "had", "do", "does", "did", "will", "would", "can",
    "could", "should", "may", "might", "shall", "not", "no", "so", "if",
    "then", "than", "that", "this", "these", "those", "from", "up", "out",
    "off", "over", "under", "into", "about", "some", "any", "each", "every",
    "all", "both", "few", "more", "most", "other", "such", "just", "very",
    "also", "as", "like", "want", "need", "offer", "looking", "learn",
    "teach", "help", "get", "know", "make", "take",
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
    .filter((v, i, a) => a.indexOf(v) === i);
}

function keywordOverlap(keywords1: string[], keywords2: string[]): string[] {
  return keywords1.filter((k) => keywords2.includes(k));
}

export class DatabaseStorage implements IStorage {
  async createUser(email: string, passwordHash: string, name: string, city: string, tosAccepted?: boolean): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name,
        city,
        tosAcceptedAt: tosAccepted ? new Date() : null,
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async updateUserAvatar(id: number, avatarUrl: string): Promise<void> {
    await db.update(users).set({ avatarUrl }).where(eq(users.id, id));
  }

  async updateUserProfile(id: number, data: UpdateProfile): Promise<User> {
    const updateData: Record<string, any> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.notifyMatches !== undefined) updateData.notifyMatches = data.notifyMatches;
    if (data.notifyInterests !== undefined) updateData.notifyInterests = data.notifyInterests;
    if (data.notifyMessages !== undefined) updateData.notifyMessages = data.notifyMessages;

    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUserPassword(id: number, newPasswordHash: string): Promise<void> {
    await db.update(users).set({ passwordHash: newPasswordHash }).where(eq(users.id, id));
  }

  async createRequest(userId: number, data: InsertRequest, publicId: string): Promise<Request> {
    const [request] = await db
      .insert(requests)
      .values({
        userId,
        offerSkill: data.offerSkill,
        needSkill: data.needSkill,
        description: data.description || null,
        city: data.city,
        isRemote: data.isRemote || false,
        publicId,
        status: "open",
      })
      .returning();
    return request;
  }

  async getRequestsByUser(userId: number): Promise<Request[]> {
    return db
      .select()
      .from(requests)
      .where(eq(requests.userId, userId))
      .orderBy(desc(requests.createdAt));
  }

  async getRequestById(id: number): Promise<Request | undefined> {
    const [request] = await db.select().from(requests).where(eq(requests.id, id));
    return request;
  }

  async getRequestByPublicId(publicId: string): Promise<(Request & { userName: string }) | undefined> {
    const result = await db
      .select({
        id: requests.id,
        userId: requests.userId,
        offerSkill: requests.offerSkill,
        needSkill: requests.needSkill,
        description: requests.description,
        city: requests.city,
        isRemote: requests.isRemote,
        status: requests.status,
        publicId: requests.publicId,
        createdAt: requests.createdAt,
        userName: users.name,
      })
      .from(requests)
      .innerJoin(users, eq(requests.userId, users.id))
      .where(and(eq(requests.publicId, publicId), eq(requests.status, "open")));
    return result[0];
  }

  async closeRequest(id: number, userId: number): Promise<void> {
    await db
      .update(requests)
      .set({ status: "closed" })
      .where(and(eq(requests.id, id), eq(requests.userId, userId)));
  }

  async deleteRequest(id: number, userId: number): Promise<void> {
    const [req] = await db.select().from(requests).where(and(eq(requests.id, id), eq(requests.userId, userId)));
    if (!req) throw new Error("Request not found or not authorized");

    await db.delete(interests).where(
      sql`${interests.requestId} = ${id} OR ${interests.targetRequestId} = ${id}`
    );
    await db
      .delete(requests)
      .where(eq(requests.id, id));
  }

  async getMatchesForUser(userId: number): Promise<any[]> {
    const myOpenRequests = await db
      .select()
      .from(requests)
      .where(and(eq(requests.userId, userId), eq(requests.status, "open")));

    if (myOpenRequests.length === 0) return [];

    const allOtherOpenRequests = await db
      .select({
        id: requests.id,
        offerSkill: requests.offerSkill,
        needSkill: requests.needSkill,
        city: requests.city,
        isRemote: requests.isRemote,
        description: requests.description,
        userId: requests.userId,
        createdAt: requests.createdAt,
        userName: users.name,
        userAvatarUrl: users.avatarUrl,
      })
      .from(requests)
      .innerJoin(users, eq(requests.userId, users.id))
      .where(
        and(
          eq(requests.status, "open"),
          ne(requests.userId, userId)
        )
      );

    const allMatches: any[] = [];
    const seenPairs = new Set<string>();

    for (const myReq of myOpenRequests) {
      for (const otherReq of allOtherOpenRequests) {
        const pairKey = `${myReq.id}-${otherReq.id}`;
        if (seenPairs.has(pairKey)) continue;

        const isExactMatch =
          myReq.offerSkill.toLowerCase() === otherReq.needSkill.toLowerCase() &&
          myReq.needSkill.toLowerCase() === otherReq.offerSkill.toLowerCase();

        let matchType: "exact" | "keyword" | null = null;
        let matchingKeywords: string[] = [];

        if (isExactMatch) {
          matchType = "exact";
        } else {
          const myOfferKeywords = extractKeywords(
            `${myReq.offerSkill} ${myReq.description || ""}`
          );
          const myNeedKeywords = extractKeywords(
            `${myReq.needSkill} ${myReq.description || ""}`
          );
          const theirOfferKeywords = extractKeywords(
            `${otherReq.offerSkill} ${otherReq.description || ""}`
          );
          const theirNeedKeywords = extractKeywords(
            `${otherReq.needSkill} ${otherReq.description || ""}`
          );

          const offerToNeedOverlap = keywordOverlap(myOfferKeywords, theirNeedKeywords);
          const needToOfferOverlap = keywordOverlap(myNeedKeywords, theirOfferKeywords);

          if (offerToNeedOverlap.length > 0 && needToOfferOverlap.length > 0) {
            matchType = "keyword";
            matchingKeywords = Array.from(new Set([...offerToNeedOverlap, ...needToOfferOverlap]));
          }
        }

        if (matchType) {
          seenPairs.add(pairKey);

          const existingInterest = await db
            .select()
            .from(interests)
            .where(
              and(
                eq(interests.requesterUserId, userId),
                eq(interests.requestId, myReq.id),
                eq(interests.targetRequestId, otherReq.id)
              )
            );

          allMatches.push({
            myRequest: {
              id: myReq.id,
              offerSkill: myReq.offerSkill,
              needSkill: myReq.needSkill,
              city: myReq.city,
              isRemote: myReq.isRemote,
            },
            matchedRequest: {
              id: otherReq.id,
              offerSkill: otherReq.offerSkill,
              needSkill: otherReq.needSkill,
              city: otherReq.city,
              isRemote: otherReq.isRemote,
              description: otherReq.description,
              userName: otherReq.userName,
              userAvatarUrl: otherReq.userAvatarUrl,
            },
            matchType,
            matchingKeywords,
            alreadyInterested: existingInterest.length > 0,
            sameCity: myReq.city.toLowerCase() === otherReq.city.toLowerCase(),
          });
        }
      }
    }

    allMatches.sort((a, b) => {
      if (a.matchType === "exact" && b.matchType !== "exact") return -1;
      if (a.matchType !== "exact" && b.matchType === "exact") return 1;
      if (a.sameCity && !b.sameCity) return -1;
      if (!a.sameCity && b.sameCity) return 1;
      return 0;
    });

    return allMatches;
  }

  async createInterest(requesterUserId: number, requestId: number, targetRequestId: number): Promise<Interest> {
    const [interest] = await db
      .insert(interests)
      .values({
        requesterUserId,
        requestId,
        targetRequestId,
        status: "pending",
      })
      .returning();
    return interest;
  }

  async hasExistingInterest(requesterUserId: number, requestId: number, targetRequestId: number): Promise<boolean> {
    const result = await db
      .select()
      .from(interests)
      .where(
        and(
          eq(interests.requesterUserId, requesterUserId),
          eq(interests.requestId, requestId),
          eq(interests.targetRequestId, targetRequestId)
        )
      );
    return result.length > 0;
  }

  async getInterestsForUser(userId: number): Promise<{ incoming: any[]; outgoing: any[] }> {
    const myRequestIds = await db
      .select({ id: requests.id })
      .from(requests)
      .where(eq(requests.userId, userId));
    const myIds = myRequestIds.map((r) => r.id);

    const allInterests = await db
      .select({
        id: interests.id,
        status: interests.status,
        requesterUserId: interests.requesterUserId,
        requestId: interests.requestId,
        targetRequestId: interests.targetRequestId,
        createdAt: interests.createdAt,
      })
      .from(interests)
      .orderBy(desc(interests.createdAt));

    const incoming: any[] = [];
    const outgoing: any[] = [];

    for (const interest of allInterests) {
      const isIncoming = myIds.includes(interest.targetRequestId) && interest.requesterUserId !== userId;
      const isOutgoing = interest.requesterUserId === userId;

      if (!isIncoming && !isOutgoing) continue;

      const requesterUser = await this.getUserById(interest.requesterUserId);
      const myReq = await this.getRequestById(interest.requestId);
      const targetReq = await this.getRequestById(interest.targetRequestId);

      if (!requesterUser || !myReq || !targetReq) continue;

      if (isIncoming) {
        const targetUser = await this.getUserById(targetReq.userId);
        incoming.push({
          id: interest.id,
          status: interest.status,
          requesterName: requesterUser.name,
          requesterEmail: interest.status === "accepted" ? requesterUser.email : "",
          requesterAvatarUrl: requesterUser.avatarUrl,
          myRequestOffer: targetReq.offerSkill,
          myRequestNeed: targetReq.needSkill,
          theirRequestOffer: myReq.offerSkill,
          theirRequestNeed: myReq.needSkill,
          createdAt: interest.createdAt,
          conversationId: null as number | null,
        });

        if (interest.status === "accepted") {
          const conv = await this.findConversation(userId, requesterUser.id);
          if (conv) {
            incoming[incoming.length - 1].conversationId = conv.id;
          }
        }
      }

      if (isOutgoing) {
        const targetOwner = await this.getUserById(targetReq.userId);
        outgoing.push({
          id: interest.id,
          status: interest.status,
          requesterName: targetOwner?.name || "Unknown",
          requesterEmail: interest.status === "accepted" ? (targetOwner?.email || "") : "",
          requesterAvatarUrl: targetOwner?.avatarUrl || null,
          myRequestOffer: myReq.offerSkill,
          myRequestNeed: myReq.needSkill,
          theirRequestOffer: targetReq.offerSkill,
          theirRequestNeed: targetReq.needSkill,
          createdAt: interest.createdAt,
          conversationId: null as number | null,
        });

        if (interest.status === "accepted" && targetOwner) {
          const conv = await this.findConversation(userId, targetOwner.id);
          if (conv) {
            outgoing[outgoing.length - 1].conversationId = conv.id;
          }
        }
      }
    }

    return { incoming, outgoing };
  }

  async acceptInterest(id: number, userId: number): Promise<Interest> {
    const [interest] = await db.select().from(interests).where(eq(interests.id, id));
    if (!interest) throw new Error("Interest not found");

    const targetReq = await this.getRequestById(interest.targetRequestId);
    if (!targetReq || targetReq.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await db
      .update(interests)
      .set({ status: "accepted" })
      .where(eq(interests.id, id));

    const conv = await this.getOrCreateConversation(userId, interest.requesterUserId, id);

    const [updated] = await db.select().from(interests).where(eq(interests.id, id));
    return updated;
  }

  async rejectInterest(id: number, userId: number): Promise<void> {
    const [interest] = await db.select().from(interests).where(eq(interests.id, id));
    if (!interest) throw new Error("Interest not found");

    const targetReq = await this.getRequestById(interest.targetRequestId);
    if (!targetReq || targetReq.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await db
      .update(interests)
      .set({ status: "rejected" })
      .where(eq(interests.id, id));
  }

  async findConversation(userAId: number, userBId: number): Promise<Conversation | undefined> {
    const [conv] = await db
      .select()
      .from(conversations)
      .where(
        or(
          and(eq(conversations.userAId, userAId), eq(conversations.userBId, userBId)),
          and(eq(conversations.userAId, userBId), eq(conversations.userBId, userAId))
        )
      );
    return conv;
  }

  async getOrCreateConversation(userAId: number, userBId: number, interestId?: number): Promise<Conversation> {
    const existing = await this.findConversation(userAId, userBId);
    if (existing) return existing;

    const [conv] = await db
      .insert(conversations)
      .values({
        userAId,
        userBId,
        interestId: interestId || null,
      })
      .returning();
    return conv;
  }

  async getConversationById(id: number): Promise<Conversation | undefined> {
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conv;
  }

  async getConversationsForUser(userId: number): Promise<any[]> {
    const convs = await db
      .select()
      .from(conversations)
      .where(
        or(
          eq(conversations.userAId, userId),
          eq(conversations.userBId, userId)
        )
      )
      .orderBy(desc(conversations.createdAt));

    const result: any[] = [];

    for (const conv of convs) {
      const otherUserId = conv.userAId === userId ? conv.userBId : conv.userAId;
      const otherUser = await this.getUserById(otherUserId);

      const [lastMessage] = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conv.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      const unreadCount = 0;

      result.push({
        id: conv.id,
        otherUser: otherUser ? {
          id: otherUser.id,
          name: otherUser.name,
          avatarUrl: otherUser.avatarUrl,
        } : null,
        lastMessage: lastMessage ? {
          body: lastMessage.body,
          senderId: lastMessage.senderId,
          createdAt: lastMessage.createdAt,
        } : null,
        createdAt: conv.createdAt,
      });
    }

    result.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || a.createdAt;
      const bTime = b.lastMessage?.createdAt || b.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    return result;
  }

  async getMessages(conversationId: number): Promise<any[]> {
    const msgs = await db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        senderId: messages.senderId,
        body: messages.body,
        createdAt: messages.createdAt,
        senderName: users.name,
        senderAvatarUrl: users.avatarUrl,
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));

    return msgs;
  }

  async createMessage(conversationId: number, senderId: number, body: string): Promise<Message> {
    const [msg] = await db
      .insert(messages)
      .values({ conversationId, senderId, body })
      .returning();
    return msg;
  }
}

export const storage = new DatabaseStorage();
