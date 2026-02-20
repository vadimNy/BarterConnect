import {
  type User,
  type InsertUser,
  type Request,
  type InsertRequest,
  type Interest,
  type InsertInterest,
  users,
  requests,
  interests,
} from "@shared/schema";
import { eq, and, ne, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export interface IStorage {
  createUser(email: string, passwordHash: string, name: string, city: string): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;

  createRequest(userId: number, data: InsertRequest, publicId: string): Promise<Request>;
  getRequestsByUser(userId: number): Promise<Request[]>;
  getRequestById(id: number): Promise<Request | undefined>;
  getRequestByPublicId(publicId: string): Promise<(Request & { userName: string }) | undefined>;
  closeRequest(id: number, userId: number): Promise<void>;
  deleteRequest(id: number, userId: number): Promise<void>;

  getMatchesForUser(userId: number): Promise<any[]>;

  createInterest(requesterUserId: number, requestId: number, targetRequestId: number): Promise<Interest>;
  getInterestsForUser(userId: number): Promise<{ incoming: any[]; outgoing: any[] }>;
  acceptInterest(id: number, userId: number): Promise<void>;
  rejectInterest(id: number, userId: number): Promise<void>;
  hasExistingInterest(requesterUserId: number, requestId: number, targetRequestId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async createUser(email: string, passwordHash: string, name: string, city: string): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ email, passwordHash, name, city })
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

    const allMatches: any[] = [];

    for (const myReq of myOpenRequests) {
      const matched = await db
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
        })
        .from(requests)
        .innerJoin(users, eq(requests.userId, users.id))
        .where(
          and(
            eq(requests.offerSkill, myReq.needSkill),
            eq(requests.needSkill, myReq.offerSkill),
            eq(requests.status, "open"),
            ne(requests.userId, userId)
          )
        )
        .orderBy(desc(requests.createdAt));

      for (const m of matched) {
        const existingInterest = await db
          .select()
          .from(interests)
          .where(
            and(
              eq(interests.requesterUserId, userId),
              eq(interests.requestId, myReq.id),
              eq(interests.targetRequestId, m.id)
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
            id: m.id,
            offerSkill: m.offerSkill,
            needSkill: m.needSkill,
            city: m.city,
            isRemote: m.isRemote,
            description: m.description,
            userName: m.userName,
          },
          alreadyInterested: existingInterest.length > 0,
          sameCity: myReq.city.toLowerCase() === m.city.toLowerCase(),
        });
      }
    }

    allMatches.sort((a, b) => {
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
          myRequestOffer: targetReq.offerSkill,
          myRequestNeed: targetReq.needSkill,
          theirRequestOffer: myReq.offerSkill,
          theirRequestNeed: myReq.needSkill,
          createdAt: interest.createdAt,
        });
      }

      if (isOutgoing) {
        const targetOwner = await this.getUserById(targetReq.userId);
        outgoing.push({
          id: interest.id,
          status: interest.status,
          requesterName: targetOwner?.name || "Unknown",
          requesterEmail: interest.status === "accepted" ? (targetOwner?.email || "") : "",
          myRequestOffer: myReq.offerSkill,
          myRequestNeed: myReq.needSkill,
          theirRequestOffer: targetReq.offerSkill,
          theirRequestNeed: targetReq.needSkill,
          createdAt: interest.createdAt,
        });
      }
    }

    return { incoming, outgoing };
  }

  async acceptInterest(id: number, userId: number): Promise<void> {
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
}

export const storage = new DatabaseStorage();
