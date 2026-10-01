import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const res = await pool.query('SELECT slug, data FROM schemes');
  
  const updates = [];
  
  for (const r of res.rows) {
    const s = JSON.parse(r.data);
    if (!s.imageUrl) continue;
    
    // Check if the image name is generic
    if (s.imageUrl.includes('kisan-') || s.imageUrl.includes('pension-') || s.imageUrl.includes('shiksha-') || s.imageUrl.includes('rojgar-')) {
      
      const oldImgName = s.imageUrl.replace(/^\//, ''); // remove leading slash
      const ext = path.extname(oldImgName) || '.jpg';
      const newImgName = `${r.slug}${ext}`;
      
      const oldPath = path.join(process.cwd(), 'public', oldImgName);
      const newPath = path.join(process.cwd(), 'public', newImgName);
      
      if (fs.existsSync(oldPath)) {
        try {
          // Copy instead of rename just to be safe if multiple schemes share the same image
          fs.copyFileSync(oldPath, newPath);
          console.log(`Copied ${oldImgName} to ${newImgName}`);
          
          updates.push({
            slug: r.slug,
            newImg: `/${newImgName}`
          });
        } catch (e) {
          console.error(`Error copying ${oldImgName} to ${newImgName}:`, e);
        }
      } else {
        console.log(`File not found: ${oldPath}`);
      }
    }
  }

  console.log(`Total images to update in DB: ${updates.length}`);
  
  for (const u of updates) {
    await pool.query(`
      UPDATE schemes 
      SET data = (data::jsonb || jsonb_build_object('imageUrl', $1::text))::text
      WHERE slug = $2
    `, [u.newImg, u.slug]);
    console.log(`Updated DB for ${u.slug} with ${u.newImg}`);
  }
  
  await pool.end();
}

run();
