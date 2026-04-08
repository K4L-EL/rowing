# Rowing Club — member portal

Next.js application with a public landing site and authenticated dashboard. **Welfare** is the first module: multi-step safeguarding-style reports, case list and detail with status timeline, PDF export, and optional email copy via Resend.

## Stack

- Next.js (App Router), TypeScript (strict), Tailwind CSS, shadcn/ui
- Redux Toolkit (dashboard route group only — wizard step / UI state)
- Auth.js (NextAuth v5) with credentials + Prisma adapter
- Prisma ORM + PostgreSQL
- Resend for transactional email; `@react-pdf/renderer` for PDF downloads

## Local setup

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Set `DATABASE_URL`, `AUTH_SECRET`, and optionally `RESEND_API_KEY` / `EMAIL_FROM`.

2. Install and migrate:

   ```bash
   npm install
   npx prisma migrate deploy
   ```

   For local development with a fresh database, you can use `npx prisma migrate dev` instead of `deploy`.

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000), register an account, then use **Welfare** in the dashboard.

## Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Development server                   |
| `npm run build`    | `prisma generate` + production build |
| `npm run start`    | Start production server              |
| `npm run lint`     | ESLint                               |
| `npm run typecheck`| TypeScript check only                |

## Deploying on Vercel

1. Create a **PostgreSQL** database outside Vercel (e.g. [Neon](https://neon.tech) or Supabase) and note the connection string.

2. Push this repository to GitHub (`K4L-EL/rowing`) and import the project in the [Vercel dashboard](https://vercel.com). Use the default Next.js preset.

3. In Vercel **Settings → Environment Variables**, add:

   - `DATABASE_URL`
   - `AUTH_SECRET` (strong random string)
   - `AUTH_URL` (your production URL, e.g. `https://rowing.vercel.app`)
   - `RESEND_API_KEY` and `EMAIL_FROM` (if you want report emails)

4. After the first deploy, apply migrations to the production database (from your machine or CI):

   ```bash
   DATABASE_URL="your-production-url" npx prisma migrate deploy
   ```

Builds run `prisma generate` via `postinstall` / `build`; the database only needs to exist for runtime and migrations.

## Safeguarding & data

This app handles sensitive welfare information. Use HTTPS (default on Vercel), restrict database access, follow your club’s retention policy, and ensure only authorised people can access production data. This README is not legal or safeguarding advice.

## CI

GitHub Actions runs lint, typecheck, and `prisma validate` on push and pull requests. Deployments are intended to use **Vercel’s Git integration** (automatic deploys from `main`).
