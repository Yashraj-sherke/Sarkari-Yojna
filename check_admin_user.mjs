import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query(`SELECT id, email, role, created_at FROM users`);
    if (res.rows.length === 0) {
      console.log('No admin users found. Creating one...');
      const email = 'admin@sarkariyojanasetu.com';
      const password = 'SarkariAdmin@2026';
      // SHA-256 via Web Crypto equivalent
      const crypto = await import('crypto');
      const hash = crypto.createHash('sha256').update(password).digest('hex');
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await pool.query(
        `INSERT INTO users (id, email, password_hash, role, created_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING`,
        [id, email, hash, 'SUPER_ADMIN', now]
      );
      console.log(`Created admin user: ${email} / ${password}`);
    } else {
      console.log('Existing users:');
      res.rows.forEach(r => console.log(`  - ${r.email} (${r.role}) created ${r.created_at}`));
    }
  } finally {
    await pool.end();
  }
}
run();
