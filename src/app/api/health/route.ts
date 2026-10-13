import { NextResponse } from 'next/server';
import { prisma, resolveDatabaseUrl } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/init-db';

export async function GET() {
  const dbUrl = resolveDatabaseUrl();
  const isPostgres = Boolean(dbUrl && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')));

  // Mask sensitive parts of the connection string
  let maskedUrl: string | null = null;
  if (dbUrl) {
    try {
      const u = new URL(dbUrl);
      maskedUrl = `${u.protocol}//${u.username}:****@${u.host}${u.pathname}`;
    } catch {
      maskedUrl = dbUrl.substring(0, 15) + '...';
    }
  }

  let dbStatus = 'disconnected';
  let userCount = 0;
  let dbError: string | null = null;

  try {
    await ensureDbInitialized();
    userCount = await prisma.user.count();
    dbStatus = 'connected';
  } catch (err: any) {
    dbStatus = 'error';
    dbError = err?.message || String(err);
  }

  // Attempt to sync DATABASE_URL to Vercel project environment variables if VERCEL_TOKEN provided
  let vercelSyncStatus = 'not_needed';
  const vercelToken = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID || 'prj_qkEpgAmnJ2rDL9htxQpuuLFc4hQA';
  const teamId = process.env.VERCEL_TEAM_ID || 'team_o9bFuk9hEESfQYU9CBOJbJQw';

  if (dbUrl && process.env.VERCEL === '1' && vercelToken) {
    try {
      const res = await fetch(
        `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${vercelToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: 'DATABASE_URL',
            value: dbUrl,
            type: 'encrypted',
            target: ['production', 'preview', 'development'],
          }),
        }
      );
      const data = await res.json();
      vercelSyncStatus = res.ok
        ? 'synced'
        : data?.error?.code === 'ENV_ALREADY_EXISTS'
        ? 'already_exists'
        : JSON.stringify(data);
    } catch (e: any) {
      vercelSyncStatus = `failed: ${e?.message}`;
    }
  }

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: {
      isVercel: process.env.VERCEL === '1',
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasRenderDbVar: Boolean(process.env.phishguard_i4w0),
      detectedProvider: isPostgres ? 'postgresql' : 'sqlite',
      maskedConnection: maskedUrl,
    },
    database: {
      status: dbStatus,
      userCount,
      error: dbError,
    },
    vercelSync: vercelSyncStatus,
  });
}
