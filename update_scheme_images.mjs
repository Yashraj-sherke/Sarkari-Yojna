import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const updates = [
    { title: "मुख्यमंत्री असंगठित मजदूर योजना", img: "/mukhyamantri-asangathit-mazdoor.png" },
    { title: "मुख्यमंत्री युवा इंटर्नशिप योजना", img: "/mukhyamantri-yuva-internship.png" },
    { title: "मुख्यमंत्री जन कल्याण (संबल 2.0) योजना", img: "/mukhyamantri-sambal-2.png" },
    { title: "मध्य प्रदेश मुख्यमंत्री सीखो-कमाओ योजना", img: "/mukhyamantri-seekho-kamao.png" },
    { title: "मध्य प्रदेश मुख्यमंत्री यूथ इंटर्नशिप फोर प्रोफेशनल डेवलपमेंट प्रोग्राम", img: "/mukhyamantri-youth-internship.png" }
  ];

  try {
    for (const u of updates) {
      // Find the scheme by title (which is in the jsonb data)
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
        // Update the jsonb data to include imageUrl
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
