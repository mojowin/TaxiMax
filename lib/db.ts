import { Pool, type QueryResultRow } from "pg";

const globalForDb = globalThis as unknown as { meterOnPool?: Pool };

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  return new Pool({ connectionString: process.env.DATABASE_URL });
}

export function getDb() {
  globalForDb.meterOnPool ??= createPool();
  return globalForDb.meterOnPool;
}

export async function query<T extends QueryResultRow>(text: string, values: unknown[] = []) {
  return getDb().query<T>(text, values);
}
