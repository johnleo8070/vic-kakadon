import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// The database can point at either a local PostgreSQL instance (development /
// sandbox) or a Supabase PostgreSQL instance (production). Supabase is just
// managed PostgreSQL, so the `pg` driver + Drizzle work seamlessly against it.
//
// Set DATABASE_URL to your Supabase connection string, e.g.:
//   postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
// (Use the "Connection Pooling" / "Transaction" string from the Supabase
//  dashboard -> Project Settings -> Database for serverless environments.)
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

// Enable SSL automatically for remote (Supabase / cloud) connections.
// Local connections (localhost / 127.0.0.1) don't use SSL.
const isLocal = /localhost|127\.0\.0\.1/.test(databaseUrl);
const useSsl = process.env.DATABASE_SSL === "true" || (!isLocal && process.env.DATABASE_SSL !== "false");

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
