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
      const searchTerms = ['वृद्धावस्था', 'कल्याणी', 'परित्यक्ता', 'अविवाहित', 'कन्या अभिभावक', 'old age', 'destitute', 'kalyani', 'unmarried'];
      for (const term of searchTerms) {
        if (s.title.toLowerCase().includes(term)) {
          console.log(s.title);
          break;
        }
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
