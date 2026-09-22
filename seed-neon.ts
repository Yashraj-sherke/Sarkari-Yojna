import { neon } from '@neondatabase/serverless';
import { seeds } from './lib/seed.js';
import * as dotenv from 'dotenv';

dotenv.config();

async function run() {
  const sql = neon(process.env.DATABASE_URL!);
  let count = 0;
  for (const s of seeds) {
    const now = new Date().toISOString();
    await sql`
      INSERT INTO schemes(slug, data, status, updated_at) 
      VALUES (${s.slug}, ${JSON.stringify(s)}, ${'ACTIVE'}, ${now})
      ON CONFLICT DO NOTHING
    `;
    count++;
    console.log(`Inserted ${count}/${seeds.length}: ${s.slug}`);
  }
  console.log('Seed completed successfully!');
}

run().catch(console.error);
