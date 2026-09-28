import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const updates = [
    { title: "मध्य प्रदेश टंट्या मामा आर्थिक कल्याण योजना", img: "/tantya-mama.png" },
    { title: "मध्य प्रदेश भगवान बिरसा मुंडा स्वरोजगार योजना", img: "/birsa-munda.png" },
    { title: "मध्य प्रदेश संत रविदास स्वरोजगार योजना", img: "/sant-ravidas.png" },
    { title: "मध्य प्रदेश डॉ भीमराव अम्बेडकर आर्थिक कल्याण योजना", img: "/dr-ambedkar.png" },
    { title: "मध्य प्रदेश पार्थ योजना", img: "/parth-yojana.png" }
  ];

  try {
    for (const u of updates) {
      // Find the scheme by title
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
