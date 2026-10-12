# 🚀 PhishGuard AI — Complete Deployment Guide (Vercel & Render)

This project is built using a modern full-stack Next.js architecture with Prisma ORM.

You can deploy:
1. **Frontend + Serverless API on Vercel** (Global edge CDN, instant page loads)
2. **PostgreSQL Database & Backend Web Service on Render** (Persistent database, free tier)

---

## 📋 Pre-configured Deployment Files Included in This Repo

The repository already includes all necessary configuration files:
- `vercel.json` — Pre-configured for automatic Prisma client generation & Next.js production builds.
- `render.yaml` — Render Blueprint to auto-provision a free PostgreSQL database and backend web service in 1 click.
- `scripts/prepare-prisma.js` — Smart datasource adapter that automatically switches Prisma between SQLite (local) and PostgreSQL (production on Render/Vercel) without modifying code.
- `prisma/seed.js` — Automated database seeder with demo user (`demo@phishguard.ai`) and SOC lead analyst (`admin@phishguard.ai`).

---

## 🌐 Part 1: Deploying the Backend & Database on Render

Render will host the **persistent PostgreSQL database** and optionally the full backend web service.

### Method A: 1-Click Blueprint (Recommended)
1. Go to [dashboard.render.com](https://dashboard.render.com/) and log in with your GitHub account (`anshbhaardwaj`).
2. Click **New +** in the top navigation bar and select **Blueprint**.
3. Connect your repository: `anshbhaardwaj/MINI_PROJECT`.
4. Render will detect `render.yaml` and show:
   - **Database:** `phishguard-db` (Free PostgreSQL instance)
   - **Web Service:** `phishguard-backend`
5. Click **Apply**.
6. Render will automatically:
   - Create your PostgreSQL database.
   - Run `npx prisma db push` to generate all tables.
   - Deploy your backend web service.

### Method B: Standalone Render PostgreSQL Database
If you only need Render to host the database while Vercel serves the entire application:
1. In the Render Dashboard, click **New +** ➔ **PostgreSQL**.
2. Set Name: `phishguard-db`, Database: `phishguard`, User: `phishguard_user`.
3. Select the **Free** instance type.
4. Click **Create Database**.
5. Once created, copy the **Internal Database URL** (or **External Database URL**).
   *(Format: `postgresql://phishguard_user:password@host/phishguard`)*

---

## ⚡ Part 2: Deploying the Frontend on Vercel

1. Go to [vercel.com](https://vercel.com/) and log in with your GitHub account (`anshbhaardwaj`).
2. Click **Add New...** ➔ **Project**.
3. Under **Import Git Repository**, select `anshbhaardwaj/MINI_PROJECT`.
4. In the Project Configuration screen:
   - **Framework Preset:** `Next.js` (detected automatically)
   - **Root Directory:** `./`
5. Expand **Environment Variables** and add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | *(Paste your Render PostgreSQL connection string)* | Render DB connection URL |
   | `AUTH_SECRET` | `phishguard-production-secret-key-2026` | Random secure string for JWT sessions |
   | `NEXT_PUBLIC_APP_NAME` | `PhishGuard AI` | Display name of application |
6. Click **Deploy**.
7. Vercel will run `node scripts/prepare-prisma.js && prisma generate && next build` and deploy your live site in ~60 seconds!
8. You will receive a live URL: `https://mini-project-xxxx.vercel.app`.

---

## 🌱 Part 3: Seeding the Production Database

Once deployed, populate the production database with default threat patterns and demo credentials:

Run this command locally from your terminal (replacing with your Render database URL):
```bash
DATABASE_URL="your-render-postgresql-external-url" npm run seed
```

Or connect via Prisma Studio:
```bash
DATABASE_URL="your-render-postgresql-external-url" npx prisma studio
```

### Default Credentials:
- **Regular User:** `demo@phishguard.ai` / `Demo@123`
- **SOC Analyst (Admin):** `admin@phishguard.ai` / `Admin@123`

---

## 🛠️ Verification Checklist

- [x] `vercel.json` added and verified
- [x] `render.yaml` added and verified
- [x] `package.json` postinstall and seed commands configured
- [x] `scripts/prepare-prisma.js` multi-database auto-adapter active
- [x] 0 ESLint warnings, 0 TypeScript errors, 26/26 routes passing production build
