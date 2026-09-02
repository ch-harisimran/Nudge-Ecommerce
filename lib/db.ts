import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __nudgePool: Pool | undefined;
}

export const pool =
  global.__nudgePool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  global.__nudgePool = pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const res = await pool.query(text, params);
  return res.rows as T[];
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

// pgvector expects a literal string like '[0.1,0.2,...]'
export function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}
