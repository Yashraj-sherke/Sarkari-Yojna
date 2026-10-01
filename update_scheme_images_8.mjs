import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const updates = [
    { title: "मध्य प्रदेश शौर्य संकल्प प्रशिक्षण योजना", img: "/shiksha-11.jpg" },
    { title: "Madhya Pradesh Shaikshanik Chatravriti Yojana", img: "/shiksha-12.jpg" },
    { title: "Madhya Pradesh Shiksha Protsahan Puraskar Yojana", img: "/shiksha-13.jpg" },
    { title: "मध्य प्रदेश दिल्ली छात्रगृह योजना", img: "/shiksha-14.jpg" },
    { title: "मध्य प्रदेश सरदार पटेल कोचिंग प्रशिक्षण योजना", img: "/shiksha-15.jpg" }
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
