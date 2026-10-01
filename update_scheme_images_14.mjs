import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const updates = [
    { title: "मध्य प्रदेश निःशक्त पेंशन योजना", img: "/pension-6.jpg" },
    { title: "मध्य प्रदेश मंदबुद्धि/ बहुविकलांग आर्थिक सहायता योजना", img: "/pension-7.jpg" },
    { title: "मध्य प्रदेश वृद्धाश्रम निवासरत अंत:वासी पेंशन योजना", img: "/pension-8.jpg" },
    { title: "समग्र सामाजिक सुरक्षा पेंशन योजना", img: "/pension-9.jpg" }
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
