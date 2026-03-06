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
  type FavorLedger,
  users,
  requests,
  interests,
  conversations,
  messages,
  favorLedger,
} from "@shared/schema";
import { eq, and, ne, desc, sql, or, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: false,
});

pool.on("error", (err) => {
  console.error("Database pool error (non-fatal):", err.message);
});

export const db = drizzle(pool);

export interface IStorage {
  createUser(email: string, passwordHash: string, name: string, city: string, tosAccepted?: boolean, userType?: string): Promise<User>;
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
  getMessages(conversationId: number, currentUserId?: number): Promise<any[]>;
  createMessage(conversationId: number, senderId: number, body: string): Promise<Message>;
  hasCompletedBarterWith(userId: number, otherUserId: number): Promise<boolean>;
  getFavorBalances(userId: number): Promise<Array<{ userId: number; userName: string; balance: number }>>;
  updateFavorBalance(userAId: number, userBId: number, delta: number): Promise<void>;
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
  async createUser(email: string, passwordHash: string, name: string, city: string, tosAccepted?: boolean, userType?: string): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name,
        city,
        userType: userType || "individual",
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
    if (data.userType !== undefined) updateData.userType = data.userType;
    if (data.primaryPlatform !== undefined) updateData.primaryPlatform = data.primaryPlatform || null;
    if (data.platformHandle !== undefined) updateData.platformHandle = data.platformHandle || null;
    if (data.followers !== undefined) updateData.followers = data.followers;
    if (data.contentNiche !== undefined) updateData.contentNiche = data.contentNiche || null;
    if (data.instagramUrl !== undefined) updateData.instagramUrl = data.instagramUrl || null;
    if (data.tiktokUrl !== undefined) updateData.tiktokUrl = data.tiktokUrl || null;
    if (data.youtubeUrl !== undefined) updateData.youtubeUrl = data.youtubeUrl || null;
    if (data.websiteUrl !== undefined) updateData.websiteUrl = data.websiteUrl || null;
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

  async getMatchesForUser(userId: number): Promise<any> {
    const myOpenRequests = await db
      .select()
      .from(requests)
      .where(and(eq(requests.userId, userId), eq(requests.status, "open")));

    if (myOpenRequests.length === 0) return { perfectMatches: [], offersWhatINeed: [], needsWhatIOffer: [] };

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
        userCompletedBarters: users.completedBarters,
      })
      .from(requests)
      .innerJoin(users, eq(requests.userId, users.id))
      .where(
        and(
          eq(requests.status, "open"),
          ne(requests.userId, userId)
        )
      );

    const perfectMatches: any[] = [];
    const offersWhatINeed: any[] = [];
    const needsWhatIOffer: any[] = [];
    const seenPerfect = new Set<string>();
    const seenOffers = new Set<string>();
    const seenNeeds = new Set<string>();

    for (const myReq of myOpenRequests) {
      for (const otherReq of allOtherOpenRequests) {
        const isExactOffer = myReq.offerSkill.toLowerCase() === otherReq.needSkill.toLowerCase();
        const isExactNeed = myReq.needSkill.toLowerCase() === otherReq.offerSkill.toLowerCase();
        const isPerfect = isExactOffer && isExactNeed;

        const baseMatch = {
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
            completedBarters: otherReq.userCompletedBarters,
          },
          sameCity: myReq.city.toLowerCase() === otherReq.city.toLowerCase(),
        };

        if (isPerfect) {
          const key = `${myReq.id}-${otherReq.id}`;
          if (!seenPerfect.has(key)) {
            seenPerfect.add(key);
            const existingInterest = await db.select().from(interests).where(
              and(eq(interests.requesterUserId, userId), eq(interests.requestId, myReq.id), eq(interests.targetRequestId, otherReq.id))
            );
            perfectMatches.push({ ...baseMatch, matchType: "exact", alreadyInterested: existingInterest.length > 0 });
          }
        } else {
          if (isExactNeed) {
            const key = `offer-${otherReq.id}`;
            if (!seenOffers.has(key)) {
              seenOffers.add(key);
              const existingInterest = await db.select().from(interests).where(
                and(eq(interests.requesterUserId, userId), eq(interests.requestId, myReq.id), eq(interests.targetRequestId, otherReq.id))
              );
              offersWhatINeed.push({ ...baseMatch, matchType: "partial_offer", alreadyInterested: existingInterest.length > 0 });
            }
          }
          if (isExactOffer) {
            const key = `need-${otherReq.id}`;
            if (!seenNeeds.has(key)) {
              seenNeeds.add(key);
              const existingInterest = await db.select().from(interests).where(
                and(eq(interests.requesterUserId, userId), eq(interests.requestId, myReq.id), eq(interests.targetRequestId, otherReq.id))
              );
              needsWhatIOffer.push({ ...baseMatch, matchType: "partial_need", alreadyInterested: existingInterest.length > 0 });
            }
          }
        }
      }
    }

    const sortMatches = (arr: any[]) => arr.sort((a, b) => {
      if (a.sameCity && !b.sameCity) return -1;
      if (!a.sameCity && b.sameCity) return 1;
      if (a.matchedRequest.isRemote && !b.matchedRequest.isRemote) return -1;
      if (!a.matchedRequest.isRemote && b.matchedRequest.isRemote) return 1;
      return 0;
    });

    sortMatches(perfectMatches);
    sortMatches(offersWhatINeed);
    sortMatches(needsWhatIOffer);

    return { perfectMatches, offersWhatINeed, needsWhatIOffer };
  }

  async getSuggestedPeople(userId: number): Promise<any[]> {
    const user = await this.getUserById(userId);
    if (!user) return [];

    const myOpenRequests = await db
      .select()
      .from(requests)
      .where(and(eq(requests.userId, userId), eq(requests.status, "open")));

    const allOtherUsers = await db
      .select({
        id: users.id,
        name: users.name,
        city: users.city,
        avatarUrl: users.avatarUrl,
        completedBarters: users.completedBarters,
      })
      .from(users)
      .where(ne(users.id, userId));

    const suggestions: any[] = [];

    for (const otherUser of allOtherUsers) {
      const otherRequests = await db
        .select()
        .from(requests)
        .where(and(eq(requests.userId, otherUser.id), eq(requests.status, "open")));

      if (otherRequests.length === 0) continue;

      let relevanceScore = 0;
      const offeredSkills = [...new Set(otherRequests.map(r => r.offerSkill))];
      const neededSkills = [...new Set(otherRequests.map(r => r.needSkill))];

      if (user.city.toLowerCase() === otherUser.city.toLowerCase()) relevanceScore += 2;
      if (otherUser.completedBarters > 0) relevanceScore += 1;

      for (const myReq of myOpenRequests) {
        for (const otherReq of otherRequests) {
          if (myReq.needSkill.toLowerCase() === otherReq.offerSkill.toLowerCase()) relevanceScore += 3;
          if (myReq.offerSkill.toLowerCase() === otherReq.needSkill.toLowerCase()) relevanceScore += 3;
        }
      }

      if (relevanceScore > 0) {
        suggestions.push({
          id: otherUser.id,
          name: otherUser.name,
          city: otherUser.city,
          avatarUrl: otherUser.avatarUrl,
          completedBarters: otherUser.completedBarters,
          offeredSkills: offeredSkills.slice(0, 3),
          neededSkills: neededSkills.slice(0, 3),
          relevanceScore,
          isRemote: otherRequests.some(r => r.isRemote),
        });
      }
    }

    suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return suggestions.slice(0, 10);
  }

  async markBarterComplete(interestId: number, userId: number): Promise<any> {
    const [interest] = await db.select().from(interests).where(eq(interests.id, interestId));
    if (!interest) throw new Error("Interest not found");
    if (interest.status !== "accepted") throw new Error("Only accepted barters can be marked complete");

    const myReq = await this.getRequestById(interest.requestId);
    const targetReq = await this.getRequestById(interest.targetRequestId);
    if (!myReq || !targetReq) throw new Error("Requests not found");

    const isRequester = interest.requesterUserId === userId;
    const isTarget = targetReq.userId === userId;
    if (!isRequester && !isTarget) throw new Error("Unauthorized");

    const updateData: Record<string, any> = {};
    if (isRequester) updateData.completedByRequester = true;
    if (isTarget) updateData.completedByTarget = true;

    await db.update(interests).set(updateData).where(eq(interests.id, interestId));

    const [updated] = await db.select().from(interests).where(eq(interests.id, interestId));

    if (updated.completedByRequester && updated.completedByTarget) {
      await db.update(users).set({ completedBarters: sql`${users.completedBarters} + 1` }).where(eq(users.id, interest.requesterUserId));
      await db.update(users).set({ completedBarters: sql`${users.completedBarters} + 1` }).where(eq(users.id, targetReq.userId));
    }

    return updated;
  }

  async getOpenRequestsByUserId(userId: number): Promise<any[]> {
    return db
      .select()
      .from(requests)
      .where(and(eq(requests.userId, userId), eq(requests.status, "open")))
      .orderBy(desc(requests.createdAt));
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
        completedByRequester: interests.completedByRequester,
        completedByTarget: interests.completedByTarget,
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
          requesterUserId: interest.requesterUserId,
          targetUserId: targetReq.userId,
          myRequestOffer: targetReq.offerSkill,
          myRequestNeed: targetReq.needSkill,
          theirRequestOffer: myReq.offerSkill,
          theirRequestNeed: myReq.needSkill,
          completedByRequester: interest.completedByRequester,
          completedByTarget: interest.completedByTarget,
          isRequester: false,
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
          requesterUserId: interest.requesterUserId,
          targetUserId: targetReq.userId,
          myRequestOffer: myReq.offerSkill,
          myRequestNeed: myReq.needSkill,
          theirRequestOffer: targetReq.offerSkill,
          theirRequestNeed: targetReq.needSkill,
          completedByRequester: interest.completedByRequester,
          completedByTarget: interest.completedByTarget,
          isRequester: true,
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

      const unreadCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(messages)
        .where(
          and(
            eq(messages.conversationId, conv.id),
            ne(messages.senderId, userId),
            eq(messages.read, false)
          )
        );

      const unreadCount = Number(unreadCountResult[0]?.count || 0);

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
        unreadCount,
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

  async getMessages(conversationId: number, userId?: number): Promise<any[]> {
    if (userId) {
      await db
        .update(messages)
        .set({ read: true })
        .where(
          and(
            eq(messages.conversationId, conversationId),
            ne(messages.senderId, userId),
            eq(messages.read, false)
          )
        );
    }

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

  async hasCompletedBarterWith(userId: number, otherUserId: number): Promise<boolean> {
    const completedInterests = await db
      .select({ id: interests.id })
      .from(interests)
      .innerJoin(requests, eq(interests.requestId, requests.id))
      .where(
        and(
          eq(interests.completedByRequester, true),
          eq(interests.completedByTarget, true),
          or(
            and(eq(interests.requesterUserId, userId)),
            and(eq(interests.requesterUserId, otherUserId))
          )
        )
      );

    for (const ci of completedInterests) {
      const [interest] = await db.select().from(interests).where(eq(interests.id, ci.id));
      if (!interest) continue;
      const targetReq = await this.getRequestById(interest.targetRequestId);
      const myReq = await this.getRequestById(interest.requestId);
      if (!targetReq || !myReq) continue;
      const involvedUsers = [interest.requesterUserId, targetReq.userId];
      if (involvedUsers.includes(userId) && involvedUsers.includes(otherUserId)) {
        return true;
      }
    }
    return false;
  }

  async getFavorBalances(userId: number): Promise<Array<{ userId: number; userName: string; balance: number }>> {
    const rows = await db
      .select({
        id: favorLedger.id,
        userAId: favorLedger.userAId,
        userBId: favorLedger.userBId,
        balance: favorLedger.balance,
      })
      .from(favorLedger)
      .where(or(eq(favorLedger.userAId, userId), eq(favorLedger.userBId, userId)));

    const results: Array<{ userId: number; userName: string; balance: number }> = [];
    for (const row of rows) {
      const isA = row.userAId === userId;
      const otherUserId = isA ? row.userBId : row.userAId;
      const balanceFromPerspective = isA ? row.balance : -row.balance;
      const otherUser = await this.getUserById(otherUserId);
      results.push({
        userId: otherUserId,
        userName: otherUser?.name || "Unknown",
        balance: balanceFromPerspective,
      });
    }
    return results;
  }

  async updateFavorBalance(userAId: number, userBId: number, delta: number): Promise<void> {
    const lowId = Math.min(userAId, userBId);
    const highId = Math.max(userAId, userBId);
    const adjustedDelta = userAId === lowId ? delta : -delta;

    const existing = await db
      .select()
      .from(favorLedger)
      .where(and(eq(favorLedger.userAId, lowId), eq(favorLedger.userBId, highId)));

    if (existing.length > 0) {
      await db
        .update(favorLedger)
        .set({
          balance: existing[0].balance + adjustedDelta,
          updatedAt: new Date(),
        })
        .where(eq(favorLedger.id, existing[0].id));
    } else {
      await db.insert(favorLedger).values({
        userAId: lowId,
        userBId: highId,
        balance: adjustedDelta,
      });
    }
  }
}

export const storage = new DatabaseStorage();
