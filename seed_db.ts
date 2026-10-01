import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { seeds } from './lib/seed.ts';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    for (const scheme of seeds) {
      const dataJson = JSON.stringify(scheme);
      const status = scheme.status || 'ACTIVE';
      const nextReviewAt = scheme.nextReviewAt || null;
      const now = new Date().toISOString();
      
      await pool.query(`
        INSERT INTO schemes (slug, type, data, status, next_review_at, updated_at)
        VALUES ($1, 'scheme', $2, $3, $4, $5)
        ON CONFLICT (slug) DO UPDATE 
        SET data = EXCLUDED.data, status = EXCLUDED.status, next_review_at = EXCLUDED.next_review_at, updated_at = EXCLUDED.updated_at
      `, [scheme.slug, dataJson, status, nextReviewAt, now]);
      
      console.log(`Upserted scheme: ${scheme.slug}`);
    }
    console.log(`Successfully upserted ${seeds.length} schemes!`);
  } catch (err) {
    console.error('Error seeding DB:', err);
  } finally {
    await pool.end();
  }
}

run();
