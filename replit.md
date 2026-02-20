# BarterConnect

A skills barter platform where users post what they can OFFER and what they NEED, and the app shows direct two-way matches.

## Overview
- **Purpose**: Skill exchange marketplace - trade skills without money
- **Stack**: React + Express + PostgreSQL + Drizzle ORM
- **Auth**: bcrypt password hashing + express-session (cookie-based)

## Architecture
- `client/src/pages/` - All page components (landing, auth, dashboard, create-request, my-requests, matches, interests, public-request)
- `client/src/lib/auth.tsx` - Auth context provider with login/signup/logout
- `client/src/components/app-layout.tsx` - Authenticated app layout with nav
- `server/routes.ts` - All API endpoints (auth, requests, matches, interests, public)
- `server/storage.ts` - Database storage layer using Drizzle ORM
- `server/seed.ts` - Seed data for demo (5 users, 6 requests with matching pairs)
- `shared/schema.ts` - Database schema and Zod validation schemas

## Database Tables
- `users` - id (serial), email, password_hash, name, city, created_at
- `requests` - id (serial), user_id, offer_skill, need_skill, description, city, is_remote, status, public_id, created_at
- `interests` - id (serial), requester_user_id, request_id, target_request_id, status, created_at

## Key Features
1. **Auth** - Signup/login with email+password, bcrypt hashing, session cookies
2. **Barter Requests** - Create, view, close, delete skill exchange requests
3. **Two-Way Matching** - Auto-match where A offers what B needs AND B offers what A needs
4. **Interest Handshake** - Express interest, accept/reject, reveal contact info on acceptance
5. **Shareable Links** - Public request pages at /r/:publicId

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
- GET /api/requests - My requests
- POST /api/requests - Create request
- POST /api/requests/:id/close - Close request
- POST /api/requests/:id/delete - Delete request
- GET /api/matches - My matches
- POST /api/interests - Send interest
- GET /api/interests - My interests (incoming/outgoing)
- POST /api/interests/:id/accept - Accept interest
- POST /api/interests/:id/reject - Reject interest
- GET /api/public/:publicId - Public request data

## Running
- `npm run dev` starts Express + Vite dev server on port 5000
- Database auto-seeds on first run
