import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query(`SELECT slug, data::jsonb->>'imageUrl' as image_url FROM schemes WHERE data::jsonb->>'imageUrl' IS NOT NULL AND data::jsonb->>'imageUrl' != ''`);
    console.log(`\nSchemes with imageUrl in DB (${res.rows.length}):\n`);
    const missing = [];
    for (const row of res.rows) {
      const url = row.image_url;
      // Check if it's a local path
      if (url && url.startsWith('/')) {
        const localPath = 'public' + url;
        const exists = fs.existsSync(localPath);
        if (!exists) {
          missing.push({ slug: row.slug, url });
        }
      }
    }
    if (missing.length === 0) {
      console.log('All DB imageUrls are present locally!');
    } else {
      console.log('MISSING from public/:');
      missing.forEach(m => console.log(`  ${m.slug}: ${m.url}`));
    }
  } finally {
    await pool.end();
  }
}
run();
