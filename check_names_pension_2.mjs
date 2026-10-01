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
      const searchTerms = ['दिव्यांग', 'निःशक्त', 'मंदबुद्धि', 'वृद्धाश्रम', 'disabled', 'retarded', 'inmate', 'सामाजिक सुरक्षा', 'बहुविकलांग'];
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
