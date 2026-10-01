import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const titlesToClose = [
      "मध्य प्रदेश मुख्यमंत्री स्वरोज़गार योजना",
      "मध्य प्रदेश युवा स्वाभिमान योजना",
      "मध्य प्रदेश मुख्यमंत्री कौशल अपरेंटिस योजना",
      "मध्य प्रदेश मुख्यमंत्री युवा उद्यमी योजना (सामान्य)",
      "मध्य प्रदेश पिछड़ा वर्ग तथा अल्पसंख्यक उद्यम योजना",
      "मध्य प्रदेश पिछड़ा वर्ग तथा अल्पसंख्यक स्वरोजगार योजना",
      "मध्य प्रदेश मुख्यमंत्री विमुक्त घुमन्तु और अर्द्ध घुमन्तु स्वरोजगार योजना"
    ];

    const res = await pool.query('SELECT data FROM schemes');
    const slugsToClose = [];
    
    for (const row of res.rows) {
      const s = JSON.parse(row.data);
      if (titlesToClose.includes(s.title)) {
        slugsToClose.push(s.slug);
      }
    }
    
    console.log('Found slugs to close:', slugsToClose);

    if (slugsToClose.length > 0) {
      const res2 = await pool.query(`
        UPDATE schemes 
        SET 
          status = 'CLOSED',
          data = (data::jsonb || '{"status": "CLOSED"}'::jsonb)::text
        WHERE slug = ANY($1)
      `, [slugsToClose]);
      console.log(`Updated ${res2.rowCount} schemes to CLOSED status`);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
