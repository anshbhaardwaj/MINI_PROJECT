import { PrismaClient } from '@prisma/client';

export function resolveDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    return process.env.DATABASE_URL.trim();
  }

  // Check Render or alternative Postgres environment variables
  const candidates = [
    process.env.phishguard_i4w0,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL_NON_POOLING,
  ];

  for (const candidate of candidates) {
    if (candidate && (candidate.startsWith('postgres://') || candidate.startsWith('postgresql://'))) {
      return candidate.trim();
    }
  }

  // Search any other environment variable that contains a postgres URL
  for (const [key, val] of Object.entries(process.env)) {
    if (typeof val === 'string' && (val.startsWith('postgres://') || val.startsWith('postgresql://'))) {
      return val.trim();
    }
  }

  return undefined;
}

const resolvedUrl = resolveDatabaseUrl();
if (resolvedUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = resolvedUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    resolvedUrl
      ? {
          datasources: {
            db: {
              url: resolvedUrl,
            },
          },
        }
      : undefined
  );

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
