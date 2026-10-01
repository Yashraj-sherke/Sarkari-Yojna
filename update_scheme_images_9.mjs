import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const updates = [
    { title: "मध्य प्रदेश कन्या साक्षरता प्रोत्साहन योजना", img: "/shiksha-16.jpg" },
    { title: "मध्य प्रदेश मुख्यमंत्री जन कल्याण (शिक्षा प्रोत्साहन) योजना", img: "/shiksha-17.jpg" },
    { title: "मध्य प्रदेश सैनिक/सार्वजनिक स्कूलों की शिक्षण शुल्क प्रतिपूर्ति योजना", img: "/shiksha-18.jpg" },
    { title: "मध्य प्रदेश सिविल सेवा प्रोत्साहन योजना", img: "/shiksha-19.jpg" }
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
