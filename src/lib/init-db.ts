import { prisma, resolveDatabaseUrl } from './db';
import bcrypt from 'bcryptjs';

let isInitializing = false;
let isInitialized = false;

export async function ensureDbInitialized() {
  if (isInitialized) return;
  if (isInitializing) {
    // Wait briefly if initialization is already underway in parallel
    for (let i = 0; i < 5; i++) {
      await new Promise((r) => setTimeout(r, 600));
      if (isInitialized) return;
    }
    return;
  }
  isInitializing = true;

  try {
    const url = resolveDatabaseUrl();
    const isPostgres = Boolean(
      url && (url.startsWith('postgres://') || url.startsWith('postgresql://'))
    );

    if (isPostgres) {
      try {
        // Execute DDL safely for PostgreSQL
        await prisma.$executeRawUnsafe(`
          CREATE SCHEMA IF NOT EXISTS "public";

          CREATE TABLE IF NOT EXISTS "User" (
              "id" TEXT NOT NULL,
              "name" TEXT NOT NULL,
              "email" TEXT NOT NULL,
              "passwordHash" TEXT NOT NULL,
              "avatar" TEXT,
              "role" TEXT NOT NULL DEFAULT 'USER',
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT "User_pkey" PRIMARY KEY ("id")
          );

          CREATE TABLE IF NOT EXISTS "Scan" (
              "id" TEXT NOT NULL,
              "userId" TEXT NOT NULL,
              "type" TEXT NOT NULL,
              "originalInput" TEXT NOT NULL,
              "riskScore" INTEGER NOT NULL,
              "riskLevel" TEXT NOT NULL,
              "metadata" TEXT NOT NULL,
              "threatIndicators" TEXT NOT NULL,
              "recommendations" TEXT NOT NULL,
              "scamDna" TEXT,
              "scamCategory" TEXT,
              "scamNarrative" TEXT,
              "audienceTarget" TEXT,
              "approvalStatus" TEXT NOT NULL DEFAULT 'AUTO_ANALYZED',
              "needsReview" BOOLEAN NOT NULL DEFAULT false,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
          );

          CREATE TABLE IF NOT EXISTS "ScanReview" (
              "id" TEXT NOT NULL,
              "scanId" TEXT NOT NULL,
              "reviewerId" TEXT NOT NULL,
              "decision" TEXT NOT NULL,
              "notes" TEXT,
              "originalRiskScore" INTEGER NOT NULL,
              "finalClassification" TEXT NOT NULL,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT "ScanReview_pkey" PRIMARY KEY ("id")
          );

          CREATE TABLE IF NOT EXISTS "UserPreference" (
              "id" TEXT NOT NULL,
              "userId" TEXT NOT NULL,
              "theme" TEXT NOT NULL DEFAULT 'system',
              "studentSafetyMode" BOOLEAN NOT NULL DEFAULT false,
              "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
              "scanAlerts" BOOLEAN NOT NULL DEFAULT true,
              "weeklyReport" BOOLEAN NOT NULL DEFAULT false,
              CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
          );

          CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
          CREATE INDEX IF NOT EXISTS "Scan_userId_idx" ON "Scan"("userId");
          CREATE INDEX IF NOT EXISTS "Scan_createdAt_idx" ON "Scan"("createdAt");
          CREATE INDEX IF NOT EXISTS "Scan_riskLevel_idx" ON "Scan"("riskLevel");
          CREATE INDEX IF NOT EXISTS "Scan_approvalStatus_idx" ON "Scan"("approvalStatus");
          CREATE INDEX IF NOT EXISTS "Scan_needsReview_idx" ON "Scan"("needsReview");
          CREATE INDEX IF NOT EXISTS "ScanReview_scanId_idx" ON "ScanReview"("scanId");
          CREATE INDEX IF NOT EXISTS "ScanReview_reviewerId_idx" ON "ScanReview"("reviewerId");
          CREATE UNIQUE INDEX IF NOT EXISTS "UserPreference_userId_key" ON "UserPreference"("userId");
        `);
      } catch (ddlError) {
        console.warn('DDL execution note (tables may already exist):', ddlError);
      }
    }

    // Check if demo user exists
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('Database empty, seeding default demo accounts...');
      const demoPasswordHash = await bcrypt.hash('Demo@123', 10);
      const adminPasswordHash = await bcrypt.hash('Admin@123', 10);

      const demoUser = await prisma.user.create({
        data: {
          name: 'Ansh Bhardwaj',
          email: 'demo@phishguard.ai',
          passwordHash: demoPasswordHash,
          role: 'USER',
          preferences: {
            create: {
              theme: 'system',
              studentSafetyMode: true,
              emailNotifications: true,
              scanAlerts: true,
            },
          },
        },
      });

      await prisma.user.create({
        data: {
          name: 'Security Analyst',
          email: 'admin@phishguard.ai',
          passwordHash: adminPasswordHash,
          role: 'ADMIN',
          preferences: {
            create: {
              theme: 'dark',
              studentSafetyMode: false,
              emailNotifications: true,
              scanAlerts: true,
              weeklyReport: true,
            },
          },
        },
      });

      // Create an initial sample scan
      await prisma.scan.create({
        data: {
          userId: demoUser.id,
          type: 'URL',
          originalInput: 'http://paypa1-secure-login.verification-center.xyz/signin?ref=urgent',
          riskScore: 92,
          riskLevel: 'CRITICAL',
          metadata: JSON.stringify({
            fullUrl: 'http://paypa1-secure-login.verification-center.xyz/signin?ref=urgent',
            domain: 'paypa1-secure-login.verification-center.xyz',
            protocol: 'http',
            isHTTPS: false,
            tld: '.xyz',
            brandImpersonation: 'PayPal',
          }),
          threatIndicators: JSON.stringify([
            { id: 'brand-impersonation', name: 'Brand Impersonation Detected', description: 'URL impersonates PayPal', severity: 'critical', score: 18, details: 'Found "paypa1" - typosquatting PayPal.' },
            { id: 'no-https', name: 'No HTTPS Encryption', description: 'No SSL encryption', severity: 'medium', score: 8, details: 'Protocol is http.' },
          ]),
          recommendations: JSON.stringify([
            'Do NOT visit this URL under any circumstances.',
            'Report this link immediately to cybercrime.gov.in (1930).',
          ]),
          scamDna: JSON.stringify({
            identityDeception: { score: 90, details: ['Typosquatting PayPal brand'] },
            pressureTactic: { score: 70, details: ['Urgent keyword detected'] },
            targetedRequest: { score: 85, details: ['Credential theft attempt'] },
            technicalDeception: { score: 75, details: ['No HTTPS, suspicious TLD'] },
            audienceTargeting: { score: 60, details: ['Banking Customers'], audience: 'Banking Customers' },
          }),
          scamNarrative: 'This URL is impersonating PayPal using a typosquatted domain. It uses "paypa1" to deceive users. Do not enter credentials.',
          audienceTarget: 'Banking Customers',
          approvalStatus: 'VERIFIED_THREAT',
          needsReview: false,
        },
      });

      console.log('✓ Successfully initialized and seeded database!');
    }

    isInitialized = true;
  } catch (err) {
    console.error('Error during database initialization:', err);
    throw err;
  } finally {
    isInitializing = false;
  }
}
