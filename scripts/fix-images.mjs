import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve('public');

async function fix() {
  const files = fs.readdirSync(PUBLIC_DIR);
  for (const file of files) {
    if ((file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) && !file.includes('.tmp')) {
      const filePath = path.join(PUBLIC_DIR, file);
      const newPath = path.join(PUBLIC_DIR, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
      
      if (!fs.existsSync(newPath)) {
        console.log(`Converting ${file} to webp...`);
        try {
          await sharp(filePath)
            .webp({ quality: 80 })
            .toFile(newPath);
          console.log(`Successfully converted ${file}`);
        } catch (e) {
          console.error(`Failed to convert ${file}:`, e.message);
        }
      } else {
        console.log(`${newPath} already exists, skipping conversion.`);
      }
    }
  }
}

fix().catch(console.error);
