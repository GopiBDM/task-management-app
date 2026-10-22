import { Pool } from 'pg'

// One shared pool of database connections.
// In development Next.js reloads files often, so we keep the pool on `globalThis`
// to avoid opening a new set of connections on every reload.
const globalForPg = globalThis as unknown as { pgPool?: Pool }

export const pool =
  globalForPg.pgPool ??
  new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000 })