import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

async function run() {
  const sql = neon(process.env.DATABASE_URL!);
  const email = 'admin@sarkariyojanasetu.com';
  const password = 'admin'; // For demo/development purposes
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    await sql`
      INSERT INTO users (id, email, password_hash, role, created_at) 
      VALUES (${id}, ${email}, ${hash}, 'SUPER_ADMIN', ${now})
      ON CONFLICT (email) DO NOTHING
    `;
    console.log(`Created admin user: ${email} / ${password}`);
  } catch (e) {
    console.error('Error inserting admin:', e);
  }
}

run().catch(console.error);
