# BarterConnect

A skills barter platform where users post what they can OFFER and what they NEED, with flexible matching, reputation, and community features.

## Overview
- **Purpose**: Skill exchange marketplace - trade skills without money
- **Stack**: React + Express + PostgreSQL + Drizzle ORM
- **Auth**: bcrypt password hashing + express-session (cookie-based)
- **File Storage**: Replit Object Storage for avatar uploads
- **Domain**: barterconnect.app (custom domain via Namecheap)
- **Signups**: Currently disabled (503 on POST /api/auth/signup); re-enable by removing the early return in server/routes.ts

## Architecture
- `client/src/pages/` - All page components (landing, auth, dashboard, create-request, my-requests, matches, interests, messages, account, public-request, onboarding, terms, privacy)
- `client/src/lib/auth.tsx` - Auth context provider with login/signup/logout
- `client/src/components/app-layout.tsx` - Authenticated app layout with nav (avatar links to /account)
- `client/src/components/user-avatar.tsx` - Reusable avatar component with initials fallback
- `client/src/components/ObjectUploader.tsx` - Uppy-based file upload component
- `client/src/hooks/use-upload.ts` - Upload hook for presigned URL flow
- `server/routes.ts` - All API endpoints (auth, requests, matches, interests, suggestions, conversations, public, uploads, profile, completion)
- `server/storage.ts` - Database storage layer using Drizzle ORM
- `server/static.ts` - Static file serving with OG tag injection for production
- `server/vite.ts` - Vite dev server setup with OG tag injection
- `server/replit_integrations/object_storage/` - Object storage integration (presigned URLs, ACL)
- `server/seed.ts` - Seed data for demo (5 users, 6 requests with matching pairs)
- `shared/schema.ts` - Database schema and Zod validation schemas

## Database Tables
- `users` - id (serial), email, password_hash, name, city, avatar_url, bio, notify_matches, notify_interests, notify_messages, completed_barters (int default 0), tos_accepted_at, created_at
- `requests` - id (serial), user_id, offer_skill, need_skill, description, city, is_remote, status, public_id, created_at
- `interests` - id (serial), requester_user_id, request_id, target_request_id, status, completed_by_requester (bool), completed_by_target (bool), created_at
- `conversations` - id (serial), user_a_id, user_b_id, interest_id, created_at
- `messages` - id (serial), conversation_id, sender_id, body, read (bool), created_at

## Key Features
1. **Auth** - Signup/login with email+password, bcrypt hashing, session cookies, TOS acceptance
2. **Barter Requests** - Create, view, close, delete skill exchange requests
3. **Flexible Matching** - Three-tier matching system:
   - Perfect Matches: exact two-way skill match
   - People Offering What You Need: one-way match on their offer
   - People Who Need What You Offer: one-way match on their need
4. **People Suggestions** - "People You Might Barter With" on dashboard, scored by city proximity, skill overlap, and reputation
5. **Interest Handshake** - Express interest, accept/reject, reveal contact info on acceptance
6. **Barter Completion** - Mutual completion flow: both parties mark complete, then both get +1 completed_barters count
7. **Direct Messaging** - In-app chat between users after interest is accepted (conversations auto-created on acceptance), unread badges
8. **Avatar Uploads** - Profile picture upload via Object Storage presigned URLs
9. **Shareable Links** - Public request pages at /r/:publicId with Open Graph meta tags for social sharing
10. **Share Flow** - After creating a request, success screen with Copy Link + social share buttons (LinkedIn, Facebook, X, WhatsApp)
11. **Onboarding** - Post-signup flow guiding new users to create their first barter request (ready for when signups re-enabled)
12. **Account Settings** - Edit profile (name, city, bio), notification preferences, change password, avatar upload
13. **Legal** - Terms of Service with addendums, Privacy Policy, Community Guidelines

## Seed Data Credentials
- alice@example.com / password123 (San Francisco)
- bob@example.com / password123 (San Francisco)
- carol@example.com / password123 (New York)
- dave@example.com / password123 (Remote)
- eva@example.com / password123 (Austin)

## API Routes
- GET /api/auth/me - Current user
- POST /api/auth/signup - Register (currently returns 503)
- POST /api/auth/login - Login
- POST /api/auth/logout - Logout
- POST /api/users/me/avatar - Update avatar URL
- PATCH /api/users/me - Update profile (name, city, bio, notification prefs)
- POST /api/users/me/password - Change password (requires current password)
- GET /api/requests - My requests
- POST /api/requests - Create request
- POST /api/requests/:id/close - Close request
- POST /api/requests/:id/delete - Delete request
- GET /api/matches - My matches (returns { perfectMatches, offersWhatINeed, needsWhatIOffer })
- GET /api/suggestions - People you might barter with (scored suggestions)
- POST /api/interests - Send interest
- GET /api/interests - My interests (incoming/outgoing with completion status)
- POST /api/interests/:id/accept - Accept interest (auto-creates conversation)
- POST /api/interests/:id/reject - Reject interest
- POST /api/interests/:id/complete - Mark barter as completed (mutual confirmation)
- GET /api/users/:id/requests - View another user's open requests
- GET /api/conversations - My conversations
- GET /api/conversations/:id/messages - Get messages (marks as read)
- POST /api/conversations/:id/messages - Send message
- POST /api/uploads/request-url - Get presigned upload URL (auth required)
- GET /api/public/:publicId - Public request data
- GET /r/:publicId - Server-side OG tag injection for social sharing

## Running
- `npm run dev` starts Express + Vite dev server on port 5000
- Database auto-seeds on first run with retry logic
- Health check at /health (DB-independent)

## Reliability
- Health check endpoint doesn't depend on DB (always responds OK)
- Database seeding runs after server is listening, with exponential backoff retry (up to 5 attempts)
- Connection pools handle errors gracefully with error event listeners
- Connection timeouts configured (10s)
