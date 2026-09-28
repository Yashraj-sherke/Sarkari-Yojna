import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const closedSlugs = [
      'mukhyamantri-swarojgar-yojana-general',
      'mukhyamantri-yuva-udyami-yojana',
      'yuva-swabhiman-yojana',
      'mukhyamantri-kaushal-apprentice-yojana',
      'madhya-pradesh-pichhda-varg-tatha-alpsankhyak-swarojgar-yojana',
      'mukhyamantri-vimukt-ghumantu-aur-ardh-ghumantu-swarojgar-yojana',
    ];

    const res = await pool.query(`
      UPDATE schemes 
      SET 
        status = 'CLOSED',
        data = (data::jsonb || '{"status": "CLOSED"}'::jsonb)::text
      WHERE slug = ANY($1)
    `, [closedSlugs]);
    
    console.log(`Updated ${res.rowCount} schemes to CLOSED status`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
