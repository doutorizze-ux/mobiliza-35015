import { Pool } from 'pg';
const globalForDb = globalThis as unknown as { pool?: Pool };
const dbConfig = process.env.DB_PASSWORD ? { host:'db', port:5432, database:'mobiliza', user:'mobiliza', password:process.env.DB_PASSWORD } : { connectionString: process.env.DATABASE_URL };
export const db = globalForDb.pool ?? new Pool(dbConfig);
if (process.env.NODE_ENV !== 'production') globalForDb.pool = db;
