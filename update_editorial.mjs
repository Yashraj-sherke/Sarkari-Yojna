import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query(`SELECT slug, data FROM schemes`);
    let updated = 0;
    
    for (const row of res.rows) {
      const s = JSON.parse(row.data);
      if (!s.editorial || s.editorial.publicationStatus !== 'REVIEWED') {
        s.editorial = {
          verificationStatus: 'VERIFIED_CORE',
          publicationStatus: 'REVIEWED',
          reviewedAt: new Date().toISOString(),
          note: 'Approved'
        };
        
        await pool.query(
          `UPDATE schemes SET data = $1 WHERE slug = $2`,
          [JSON.stringify(s), row.slug]
        );
        updated++;
        console.log(`Updated editorial status for: ${s.title}`);
      }
    }
    console.log(`\nSuccessfully updated ${updated} schemes to REVIEWED.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
