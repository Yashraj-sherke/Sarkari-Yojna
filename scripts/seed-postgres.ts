import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { seeds } from '../lib/seed.ts';

const sql = neon(process.env.DATABASE_URL!);

async function run() {
  for (const s of seeds) {
    const slug = s.slug;
    const data = JSON.stringify(s);
    const status = s.status;
    const nextReviewAt = s.nextReviewAt ? new Date(s.nextReviewAt).toISOString() : null;
    
    await sql`
      INSERT INTO schemes (slug, data, status, next_review_at, updated_at) 
      VALUES (${slug}, ${data}, ${status}, ${nextReviewAt}, '2026-09-14T00:00:00.000Z')
      ON CONFLICT (slug) DO UPDATE 
      SET data = EXCLUDED.data, status = EXCLUDED.status, next_review_at = EXCLUDED.next_review_at
    `;
    console.log('Seeded:', slug);
  }
  console.log('Done!');
}
run().catch(console.error);
