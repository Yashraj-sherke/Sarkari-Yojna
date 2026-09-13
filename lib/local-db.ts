import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), '.wrangler', 'state', 'v3', 'd1', 'local.sqlite3');

let _db: Database.Database | null = null;

export function getLocalDb(): Database.Database {
  if (_db) return _db;
  
  // Ensure directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');
  
  // Create tables
  _db.exec(`
    CREATE TABLE IF NOT EXISTS schemes (
      slug TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      status TEXT NOT NULL,
      next_review_at TEXT,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL REFERENCES schemes(slug),
      reason TEXT NOT NULL,
      detail TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      slug TEXT NOT NULL REFERENCES schemes(slug),
      date TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS signals (
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      slug TEXT NOT NULL REFERENCES schemes(slug),
      PRIMARY KEY (session_id, slug)
    );
    CREATE TABLE IF NOT EXISTS verification_logs (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      actor TEXT NOT NULL,
      source TEXT NOT NULL,
      changes TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS rate_limits (
      key TEXT PRIMARY KEY,
      count INTEGER NOT NULL,
      expires INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS events (
      day TEXT NOT NULL,
      name TEXT NOT NULL,
      count INTEGER NOT NULL,
      PRIMARY KEY (day, name)
    );
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL REFERENCES admin_users(id),
      expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS guides (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  
  return _db;
}

// Adapter that mimics D1-style interface for compatibility
export function createDbAdapter() {
  const db = getLocalDb();
  
  return {
    prepare(sql: string) {
      return {
        _sql: sql,
        _params: [] as unknown[],
        bind(...args: unknown[]) {
          this._params = args;
          return this;
        },
        async first<T>(columnName?: string): Promise<T | null> {
          try {
            const stmt = db.prepare(this._sql);
            const row = stmt.get(...this._params) as Record<string, unknown> | undefined;
            if (!row) return null;
            if (columnName) return row[columnName] as T;
            return row as T;
          } catch (e) {
            console.error('DB first error:', this._sql, e);
            return null;
          }
        },
        async all<T>(): Promise<{ results: T[] }> {
          try {
            const stmt = db.prepare(this._sql);
            const rows = stmt.all(...this._params) as T[];
            return { results: rows };
          } catch (e) {
            console.error('DB all error:', this._sql, e);
            return { results: [] };
          }
        },
        async run() {
          try {
            const stmt = db.prepare(this._sql);
            return stmt.run(...this._params);
          } catch (e) {
            console.error('DB run error:', this._sql, e);
          }
        },
      };
    },
    async batch(stmts: Array<ReturnType<ReturnType<typeof createDbAdapter>['prepare']>>) {
      const results = [];
      for (const stmt of stmts) {
        try {
          const s = db.prepare((stmt as any)._sql);
          results.push(s.run(...(stmt as any)._params));
        } catch (e) {
          console.error('DB batch error:', (stmt as any)._sql, e);
        }
      }
      return results;
    },
  };
}
