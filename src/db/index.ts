import { drizzle, type BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';
import { resolve } from 'path';

// Use absolute path for the database to avoid issues with Vite's module resolution
const DB_PATH = resolve(process.cwd(), 'sqlite.db');

// Store connection and drizzle instance in a truly global place
const globalForDb = globalThis as unknown as {
    _sqlite_conn: Database | undefined;
    _drizzle_db: BunSQLiteDatabase<typeof schema> | undefined;
};

function getConnection(): Database {
    if (!globalForDb._sqlite_conn) {
        console.log('[DB] Creating new SQLite connection at:', DB_PATH);
        const conn = new Database(DB_PATH);
        conn.exec("PRAGMA journal_mode = WAL;");
        conn.exec("PRAGMA busy_timeout = 5000;"); // Wait up to 5s if locked
        globalForDb._sqlite_conn = conn;
    }
    return globalForDb._sqlite_conn;
}

function getDb(): BunSQLiteDatabase<typeof schema> {
    if (!globalForDb._drizzle_db) {
        const conn = getConnection();
        globalForDb._drizzle_db = drizzle(conn, { schema });
    }
    return globalForDb._drizzle_db;
}

export const db = getDb();

// Hot reload cleanup - close connection before module is replaced
if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        console.log('[DB] Hot reload detected, closing SQLite connection');
        if (globalForDb._sqlite_conn) {
            globalForDb._sqlite_conn.close();
            globalForDb._sqlite_conn = undefined;
            globalForDb._drizzle_db = undefined;
        }
    });
}
