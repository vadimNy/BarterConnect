import { storage, db } from "./storage";
import { users, requests } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export async function seedDatabase() {
  const existing = await db.select().from(users).limit(1);
  if (existing.length > 0) return;

  console.log("Seeding database with sample data...");

  const hash = await bcrypt.hash("password123", 10);

  const alice = await storage.createUser("alice@example.com", hash, "Alice Chen", "San Francisco");
  const bob = await storage.createUser("bob@example.com", hash, "Bob Martinez", "San Francisco");
  const carol = await storage.createUser("carol@example.com", hash, "Carol Park", "New York");
  const dave = await storage.createUser("dave@example.com", hash, "Dave Wilson", "Remote");
  const eva = await storage.createUser("eva@example.com", hash, "Eva Nguyen", "Austin");

  await storage.createRequest(alice.id, {
    offerSkill: "Web Development",
    needSkill: "Graphic Design",
    description: "I can build responsive websites with React, Next.js, or plain HTML/CSS. Looking for someone to help design logos and brand identity.",
    city: "San Francisco",
    isRemote: true,
  }, nanoid(10));

  await storage.createRequest(bob.id, {
    offerSkill: "Graphic Design",
    needSkill: "Web Development",
    description: "Professional graphic designer with 5 years of experience. Need help building my portfolio website.",
    city: "San Francisco",
    isRemote: false,
  }, nanoid(10));

  await storage.createRequest(carol.id, {
    offerSkill: "Photography",
    needSkill: "Spanish Tutoring",
    description: "Portrait and event photographer available for shoots. Looking for conversational Spanish practice.",
    city: "New York",
    isRemote: false,
  }, nanoid(10));

  await storage.createRequest(dave.id, {
    offerSkill: "Spanish Tutoring",
    needSkill: "Photography",
    description: "Native Spanish speaker, can teach all levels. Want to learn photography basics.",
    city: "Remote",
    isRemote: true,
  }, nanoid(10));

  await storage.createRequest(eva.id, {
    offerSkill: "Guitar Lessons",
    needSkill: "Cooking Classes",
    description: "Been playing guitar for 10 years, can teach acoustic or electric. Love to learn new cuisines!",
    city: "Austin",
    isRemote: false,
  }, nanoid(10));

  await storage.createRequest(alice.id, {
    offerSkill: "Cooking Classes",
    needSkill: "Guitar Lessons",
    description: "Home cook specializing in Asian fusion cuisine. Want to learn guitar.",
    city: "San Francisco",
    isRemote: true,
  }, nanoid(10));

  console.log("Seed data created successfully!");
}
