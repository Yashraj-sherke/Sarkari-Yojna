import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const updates = [
    { title: "मध्य प्रदेश सामाजिक सुरक्षा वृद्धावस्था पेंशन योजना", img: "/pension-1.jpg" },
    { title: "मध्य प्रदेश सामाजिक सुरक्षा कल्याणी पेंशन योजना", img: "/pension-2.jpg" },
    { title: "मध्य प्रदेश सामाजिक सुरक्षा परित्यक्ता पेंशन योजना", img: "/pension-3.jpg" },
    { title: "मध्य प्रदेश मुख्यमंत्री अविवाहित पेंशन योजना", img: "/pension-4.jpg" },
    { title: "मध्य प्रदेश मुख्यमंत्री कन्या अभिभावक पेंशन योजना", img: "/pension-5.jpg" }
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
