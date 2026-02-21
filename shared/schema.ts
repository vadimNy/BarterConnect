import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  notifyMatches: boolean("notify_matches").default(true).notNull(),
  notifyInterests: boolean("notify_interests").default(true).notNull(),
  notifyMessages: boolean("notify_messages").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  offerSkill: text("offer_skill").notNull(),
  needSkill: text("need_skill").notNull(),
  description: text("description"),
  city: text("city").notNull(),
  isRemote: boolean("is_remote").default(false).notNull(),
  status: text("status").notNull().default("open"),
  publicId: text("public_id").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const interests = pgTable("interests", {
  id: serial("id").primaryKey(),
  requesterUserId: integer("requester_user_id").notNull().references(() => users.id),
  requestId: integer("request_id").notNull().references(() => requests.id),
  targetRequestId: integer("target_request_id").notNull().references(() => requests.id),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userAId: integer("user_a_id").notNull().references(() => users.id),
  userBId: integer("user_b_id").notNull().references(() => users.id),
  interestId: integer("interest_id").references(() => interests.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  passwordHash: true,
  avatarUrl: true,
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Display name is required"),
  city: z.string().min(1, "City is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertRequestSchema = createInsertSchema(requests).omit({
  id: true,
  userId: true,
  createdAt: true,
  publicId: true,
  status: true,
});

export const insertInterestSchema = z.object({
  requestId: z.number(),
  targetRequestId: z.number(),
});

export const insertMessageSchema = z.object({
  body: z.string().min(1, "Message cannot be empty").max(2000),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional().nullable(),
  notifyMatches: z.boolean().optional(),
  notifyInterests: z.boolean().optional(),
  notifyMessages: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Interest = typeof interests.$inferSelect;
export type InsertInterest = z.infer<typeof insertInterestSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
