import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query(`SELECT slug, data FROM schemes LIMIT 10`);
    for (const row of res.rows) {
      const s = JSON.parse(row.data);
      console.log(`\n=== Scheme: ${s.title} ===`);
      console.log("editorial:", s.editorial);
      console.log("eligibilityDescription:", !!s.eligibilityDescription, s.eligibilityDescription?.length);
      console.log("rules:", !!s.rules, s.rules?.length);
    }
  } finally {
    await pool.end();
  }
}
run();
