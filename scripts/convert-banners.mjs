import sharp from 'sharp';
import { existsSync } from 'node:fs';

const names = [
  'ayushman-bharat-banner',
  'pm-awas-banner',
  'pm-surya-ghar-banner',
  'pm-vishwakarma-banner',
  'pm-mudra-banner',
  'pm-ujjwala-banner',
  'atal-pension-banner',
  'ladli-laxmi-banner'
];

for (const name of names) {
  const jpgPath = `public/${name}.jpg`;
  const webpPath = `public/${name}.webp`;
  if (existsSync(jpgPath)) {
    await sharp(jpgPath).resize({ width: 1200 }).webp({ quality: 82 }).toFile(webpPath);
    console.log(`Optimized ${jpgPath} -> ${webpPath}`);
  }
}
