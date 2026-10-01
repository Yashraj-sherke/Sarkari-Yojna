import {neon} from '@neondatabase/serverless';
import 'dotenv/config';

async function run() {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`SELECT slug FROM schemes WHERE slug ILIKE '%kisan%'`;
  console.log(rows);
}

run();
