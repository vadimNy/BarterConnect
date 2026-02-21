# BarterConnect

A skills barter platform where users post what they can OFFER and what they NEED, and the app shows direct two-way matches.

## Overview
- **Purpose**: Skill exchange marketplace - trade skills without money
- **Stack**: React + Express + PostgreSQL + Drizzle ORM
- **Auth**: bcrypt password hashing + express-session (cookie-based)
- **File Storage**: Replit Object Storage for avatar uploads

## Architecture
- `client/src/pages/` - All page components (landing, auth, dashboard, create-request, my-requests, matches, interests, messages, account, public-request)
- `client/src/lib/auth.tsx` - Auth context provider with login/signup/logout
- `client/src/components/app-layout.tsx` - Authenticated app layout with nav (avatar links to /account)
- `client/src/components/user-avatar.tsx` - Reusable avatar component with initials fallback
- `client/src/components/ObjectUploader.tsx` - Uppy-based file upload component
- `client/src/hooks/use-upload.ts` - Upload hook for presigned URL flow
- `server/routes.ts` - All API endpoints (auth, requests, matches, interests, conversations, public, uploads, profile)
- `server/storage.ts` - Database storage layer using Drizzle ORM
- `server/replit_integrations/object_storage/` - Object storage integration (presigned URLs, ACL)
- `server/seed.ts` - Seed data for demo (5 users, 6 requests with matching pairs)
- `shared/schema.ts` - Database schema and Zod validation schemas

## Database Tables
- `users` - id (serial), email, password_hash, name, city, avatar_url, bio, notify_matches, notify_interests, notify_messages, created_at
- `requests` - id (serial), user_id, offer_skill, need_skill, description, city, is_remote, status, public_id, created_at
- `interests` - id (serial), requester_user_id, request_id, target_request_id, status, created_at
- `conversations` - id (serial), user_a_id, user_b_id, interest_id, created_at
- `messages` - id (serial), conversation_id, sender_id, body, created_at

## Key Features
1. **Auth** - Signup/login with email+password, bcrypt hashing, session cookies
2. **Barter Requests** - Create, view, close, delete skill exchange requests
3. **Two-Way Matching** - Exact matches (A offers what B needs AND B offers what A needs) + keyword matches (similar keywords in offer/need descriptions)
4. **Interest Handshake** - Express interest, accept/reject, reveal contact info on acceptance
5. **Direct Messaging** - In-app chat between users after interest is accepted (conversations auto-created on acceptance)
6. **Avatar Uploads** - Profile picture upload via Object Storage presigned URLs
7. **Shareable Links** - Public request pages at /r/:publicId
8. **Account Settings** - Edit profile (name, city, bio), notification preferences (matches/interests/messages), change password, avatar upload

## Seed Data Credentials
- alice@example.com / password123 (San Francisco)
- bob@example.com / password123 (San Francisco)
- carol@example.com / password123 (New York)
- dave@example.com / password123 (Remote)
- eva@example.com / password123 (Austin)

## API Routes
- GET /api/auth/me - Current user
- POST /api/auth/signup - Register
- POST /api/auth/login - Login
- POST /api/auth/logout - Logout
- POST /api/users/me/avatar - Update avatar URL
- PATCH /api/users/me - Update profile (name, city, bio, notification prefs)
- POST /api/users/me/password - Change password (requires current password)
- GET /api/requests - My requests
- POST /api/requests - Create request
- POST /api/requests/:id/close - Close request
- POST /api/requests/:id/delete - Delete request
- GET /api/matches - My matches (exact + keyword)
- POST /api/interests - Send interest
- GET /api/interests - My interests (incoming/outgoing with conversation IDs)
- POST /api/interests/:id/accept - Accept interest (auto-creates conversation)
- POST /api/interests/:id/reject - Reject interest
- GET /api/conversations - My conversations
- GET /api/conversations/:id/messages - Get messages
- POST /api/conversations/:id/messages - Send message
- POST /api/uploads/request-url - Get presigned upload URL (auth required)
- GET /api/public/:publicId - Public request data

## Running
- `npm run dev` starts Express + Vite dev server on port 5000
- Database auto-seeds on first run
