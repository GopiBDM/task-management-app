# OpsTrack - step 1 (PostgreSQL + pgAdmin): login + home page

See the chat instructions for the full walk-through. Short version:

1. npx create-next-app@latest opstrack   (TypeScript, ESLint, Tailwind, src/ dir, App Router = Yes)
2. cd opstrack && npm install pg bcryptjs jose && npm install -D @types/pg
3. Copy `src/`, `db/`, `scripts/` and `.env.local.example` from this zip into the project.
   Delete the generated `src/app/page.tsx`.
4. Copy `.env.local.example` to `.env.local`, fill in DATABASE_URL and SESSION_SECRET.
5. pgAdmin: create database `opstrack`, run `db/schema.sql` in its Query Tool.
6. node --env-file=.env.local scripts/create-user.mjs you@company.com "Your Name" YourPassword
7. npm run dev  ->  http://localhost:3000
