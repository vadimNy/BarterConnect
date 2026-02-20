import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { signupSchema, loginSchema, insertRequestSchema, insertInterestSchema } from "@shared/schema";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const PgStore = connectPgSimple(session);
  const sessionPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  app.use(
    session({
      store: new PgStore({
        pool: sessionPool,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "barter-connect-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      },
    })
  );

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const { passwordHash, ...safeUser } = user;
    res.json(safeUser);
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const parsed = signupSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }

      const { email, password, name, city } = parsed.data;

      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await storage.createUser(email, passwordHash, name, city);
      req.session.userId = user.id;

      const { passwordHash: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Internal error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }

      const { email, password } = parsed.data;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.session.userId = user.id;
      const { passwordHash, ...safeUser } = user;
      res.json(safeUser);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Internal error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Failed to logout" });
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/requests", requireAuth, async (req, res) => {
    const reqs = await storage.getRequestsByUser(req.session.userId!);
    res.json(reqs);
  });

  app.post("/api/requests", requireAuth, async (req, res) => {
    try {
      const parsed = insertRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }

      const publicId = nanoid(10);
      const request = await storage.createRequest(req.session.userId!, parsed.data, publicId);
      res.json(request);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Internal error" });
    }
  });

  app.post("/api/requests/:id/close", requireAuth, async (req, res) => {
    try {
      await storage.closeRequest(parseInt(req.params.id), req.session.userId!);
      res.json({ message: "Request closed" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/requests/:id/delete", requireAuth, async (req, res) => {
    try {
      await storage.deleteRequest(parseInt(req.params.id), req.session.userId!);
      res.json({ message: "Request deleted" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/matches", requireAuth, async (req, res) => {
    const matches = await storage.getMatchesForUser(req.session.userId!);
    res.json(matches);
  });

  app.post("/api/interests", requireAuth, async (req, res) => {
    try {
      const parsed = insertInterestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }

      const { requestId, targetRequestId } = parsed.data;

      const myReq = await storage.getRequestById(requestId);
      if (!myReq || myReq.userId !== req.session.userId!) {
        return res.status(403).json({ message: "Not your request" });
      }

      const exists = await storage.hasExistingInterest(req.session.userId!, requestId, targetRequestId);
      if (exists) {
        return res.status(400).json({ message: "Interest already sent" });
      }

      const interest = await storage.createInterest(req.session.userId!, requestId, targetRequestId);
      res.json(interest);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/interests", requireAuth, async (req, res) => {
    const data = await storage.getInterestsForUser(req.session.userId!);
    res.json(data);
  });

  app.post("/api/interests/:id/accept", requireAuth, async (req, res) => {
    try {
      await storage.acceptInterest(parseInt(req.params.id), req.session.userId!);
      res.json({ message: "Interest accepted" });
    } catch (err: any) {
      res.status(403).json({ message: err.message });
    }
  });

  app.post("/api/interests/:id/reject", requireAuth, async (req, res) => {
    try {
      await storage.rejectInterest(parseInt(req.params.id), req.session.userId!);
      res.json({ message: "Interest rejected" });
    } catch (err: any) {
      res.status(403).json({ message: err.message });
    }
  });

  app.get("/api/public/:publicId", async (req, res) => {
    const request = await storage.getRequestByPublicId(req.params.publicId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.json({
      offerSkill: request.offerSkill,
      needSkill: request.needSkill,
      description: request.description,
      city: request.city,
      isRemote: request.isRemote,
      userName: request.userName,
    });
  });

  return httpServer;
}
