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
      if (s.title.toLowerCase().includes('vikramaditya') || s.title.toLowerCase().includes('krishna') || s.title.toLowerCase().includes('विक्रमादित्य') || s.title.toLowerCase().includes('श्रीकृष्ण')) {
        console.log(s.title);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
