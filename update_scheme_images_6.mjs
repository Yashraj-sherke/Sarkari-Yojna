import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const updates = [
    { title: "मध्य प्रदेश इकलौती बेटी छात्रवृत्ति योजना", img: "/shiksha-1.jpg" },
    { title: "मध्य प्रदेश मुख्यमंत्री मेधावी विद्यार्थी योजना", img: "/shiksha-2.jpg" },
    { title: "मध्य प्रदेश प्रतिभा किरण योजना", img: "/shiksha-3.jpg" },
    { title: "मध्य प्रदेश मुख्यमंत्री स्कूटी योजना", img: "/shiksha-4.jpg" },
    { title: "मध्य प्रदेश निःशुल्क साइकिल वितरण योजना", img: "/shiksha-5.jpg" }
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
