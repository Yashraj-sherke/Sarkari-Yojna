import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const updates = [
    { title: "औषधीय एवं सुगन्धित फसल क्षेत्र विस्तार योजना", img: "/kisan-1.jpg" },
    { title: "बीज ग्राम योजना", img: "/kisan-2.jpg" },
    { title: "मध्य प्रदेश गोपाल प्रोत्साहन योजना", img: "/kisan-3.jpg" },
    { title: "मध्य प्रदेश मुख्यमंत्री किसान कल्याण योजना", img: "/kisan-4.jpg" },
    { title: "मुख्यमंत्री कृषक जीवन कल्याण योजना", img: "/kisan-5.jpg" },
    { title: "मध्य प्रदेश मुख्यमंत्री सोलर पंप योजना", img: "/kisan-6.jpg" },
    { title: "मध्य प्रदेश अटल किसान ज्योति योजना", img: "/kisan-7.jpg" },
    { title: "मध्य प्रदेश आचार्य विद्यासागर गौ संवर्धन योजना", img: "/kisan-8.jpg" },
    { title: "मध्य प्रदेश पशुधन बीमा योजना", img: "/kisan-9.jpg" },
    { title: "मध्य प्रदेश दुधारू पशु प्रदाय योजना", img: "/kisan-10.jpg" }
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
