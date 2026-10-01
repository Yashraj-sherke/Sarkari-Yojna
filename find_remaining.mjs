import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query("SELECT slug, data FROM schemes WHERE data::jsonb->>'state' = 'madhya-pradesh'");
    const remaining = [];
    
    for (const row of res.rows) {
      const data = JSON.parse(row.data);
      // Check if it's considered 'remaining' - e.g. lacking detailedDescription or in DRAFT status
      const hasDetailedDesc = Array.isArray(data.detailedDescription) && data.detailedDescription.length > 0;
      const isReviewed = data.editorial?.publicationStatus === 'REVIEWED';
      
      if (!hasDetailedDesc || !isReviewed) {
        remaining.push({
          slug: row.slug,
          title: data.title,
          english: data.english,
          sourceUrl: data.sourceUrl,
          hasDetailedDesc,
          isReviewed,
          status: row.status
        });
      }
    }
    
    console.log(`Found ${remaining.length} remaining MP schemes.`);
    console.log(JSON.stringify(remaining.slice(0, 10), null, 2));
  } finally {
    await pool.end();
  }
}
run();
