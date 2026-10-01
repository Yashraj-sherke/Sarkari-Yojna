import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const updates = [
    { title: "मध्य प्रदेश गांव की बेटी योजना", img: "/shiksha-6.jpg" },
    { title: "मध्य प्रदेश आकांक्षा योजना", img: "/shiksha-7.jpg" },
    { title: "मध्य प्रदेश मुख्यमंत्री दिव्यांग शिक्षा प्रोत्साहन योजना", img: "/shiksha-8.jpg" },
    { title: "मध्य प्रदेश प्रतिभाशाली विद्यार्थी प्रोत्साहन योजना", img: "/shiksha-9.jpg" },
    { title: "Madhya Pradesh Shri Medha Scheme", img: "/shiksha-10.jpg" }
  ];

  try {
    for (const u of updates) {
      const res = await pool.query(`
        SELECT slug, data FROM schemes
      `);
      
      let targetSlug = null;
      for (const row of res.rows) {
        const s = JSON.parse(row.data);
        if (s.title === u.title) {
          targetSlug = s.slug;
          break;
        }
      }

      if (targetSlug) {
        await pool.query(`
          UPDATE schemes 
          SET data = (data::jsonb || jsonb_build_object('imageUrl', $1::text))::text
          WHERE slug = $2
        `, [u.img, targetSlug]);
        console.log(`Updated image for ${u.title}`);
      } else {
        console.log(`Could not find scheme: ${u.title}`);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
