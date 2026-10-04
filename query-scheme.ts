import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const result = await pool.query("SELECT data FROM schemes WHERE slug = 'rani-durgavati-shri-anna-protsahan-yojana'");
    if (result.rows.length > 0) {
      let data = result.rows[0].data;
      if (typeof data === 'string') data = JSON.parse(data);
      console.log("Found detailedDescription array length:", data.detailedDescription?.length);
      console.log("First item:", data.detailedDescription?.[0]);
      console.log("Second item:", data.detailedDescription?.[1]);
    } else {
      console.log("Not found in DB.");
    }
  } finally {
    await pool.end();
  }
}
run();
