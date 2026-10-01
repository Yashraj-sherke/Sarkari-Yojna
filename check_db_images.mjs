import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const res = await pool.query(`
      SELECT slug, data FROM schemes
    `);
    
    for (const row of res.rows) {
      const s = JSON.parse(row.data);
      if (s.title.includes('कल्याणी') || s.title.includes('कन्या अभिभावक')) {
        console.log("Scheme:", s.title);
        console.log("Slug:", s.slug);
        console.log("Image URL:", s.imageUrl);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
