const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Detect postgres connection string from various possible environment variable names
let dbUrl = process.env.DATABASE_URL || process.env.phishguard_i4w0 || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || '';

if (!dbUrl) {
  for (const [key, val] of Object.entries(process.env)) {
    if (typeof val === 'string' && (val.startsWith('postgres://') || val.startsWith('postgresql://'))) {
      dbUrl = val;
      break;
    }
  }
}

if (dbUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = dbUrl;
}

// On Vercel or Render or whenever a postgres URL is present, use postgresql provider
const isPostgres = Boolean(
  process.env.VERCEL === '1' ||
  process.env.RENDER === 'true' ||
  (dbUrl && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')))
);

if (isPostgres) {
  if (schema.includes('provider = "sqlite"')) {
    schema = schema.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
    fs.writeFileSync(schemaPath, schema);
    console.log('✓ Prepared Prisma datasource for PostgreSQL (Production)');
  }
} else {
  if (schema.includes('provider = "postgresql"')) {
    schema = schema.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');
    fs.writeFileSync(schemaPath, schema);
    console.log('✓ Prepared Prisma datasource for SQLite (Local)');
  }
}

