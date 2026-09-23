import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve('public');

async function optimize() {
  const files = fs.readdirSync(PUBLIC_DIR);
  for (const file of files) {
    if ((file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.webp')) && !file.includes('.tmp')) {
      const filePath = path.join(PUBLIC_DIR, file);
      
      try {
        const metadata = await sharp(filePath).metadata();
        
        if (metadata.width > 800) {
          console.log(`Optimizing ${file}...`);
          const tmpPath = filePath + '.tmp.webp';
          
          await sharp(filePath)
            .resize(800)
            .webp({ quality: 80 })
            .toFile(tmpPath);
            
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.log(`Could not delete original ${file} (might be locked).`);
          }
          
          const newPath = path.join(PUBLIC_DIR, file.replace(/\.(png|jpg|jpeg|webp)$/i, '.webp'));
          try {
            fs.renameSync(tmpPath, newPath);
          } catch (e) {
            fs.copyFileSync(tmpPath, newPath);
            fs.unlinkSync(tmpPath);
          }
          
          console.log(`Finished ${file}`);
        }
      } catch (err) {
        console.error(`Error processing ${file}: ${err.message}`);
      }
    }
  }
}

optimize().catch(console.error);
