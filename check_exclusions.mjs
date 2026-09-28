import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query(`SELECT slug, data FROM schemes`);
    let countEmpty = 0;
    for (const row of res.rows) {
      const s = JSON.parse(row.data);
      if (!s.exclusions || s.exclusions.length === 0) {
        countEmpty++;
      }
    }
    console.log(`\nFound ${countEmpty} out of ${res.rows.length} schemes with NO exclusions.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}
run();
