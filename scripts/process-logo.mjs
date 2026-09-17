import sharp from 'sharp';

const imgPath = 'C:/Users/HP/.gemini/antigravity-ide/brain/76fb8585-1af4-420e-bd0c-0707ce3f28d2/.user_uploaded/media_1789584868139.jpg';

const metadata = await sharp(imgPath).metadata();
console.log('Logo sheet metadata:', metadata);

// Let's crop the main emblem + text from the top center/middle
// The sheet is 1024x1024 usually. Let's crop the main emblem:
// The emblem is centered around width: 300 to 724, height 40 to 600
// Also let's crop the full logo lockup (emblem + "Sarkari योजना")
// Let's extract:
// 1) Emblem only: roughly 260, 40, 500, 520
// 2) Full logo (emblem + Sarkari योजना): roughly 150, 40, 720, 650

const width = metadata.width || 1024;
const height = metadata.height || 1024;

// Save the full source logo sheet to public as well
await sharp(imgPath).webp({ quality: 90 }).toFile('public/sarkari-yojna-logo-sheet.webp');

// Crop the primary logo (emblem + text) from upper portion
const cropTop = Math.round(height * 0.05);
const cropHeight = Math.round(height * 0.62);
const cropLeft = Math.round(width * 0.16);
const cropWidth = Math.round(width * 0.68);

await sharp(imgPath)
  .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
  .resize({ width: 600 })
  .webp({ quality: 90 })
  .toFile('public/logo.webp');

// Crop just the map emblem icon for header icon and favicon
const iconTop = Math.round(height * 0.05);
const iconHeight = Math.round(height * 0.50);
const iconLeft = Math.round(width * 0.30);
const iconWidth = Math.round(width * 0.40);

await sharp(imgPath)
  .extract({ left: iconLeft, top: iconTop, width: iconWidth, height: iconHeight })
  .resize({ width: 256, height: 256, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .webp({ quality: 90 })
  .toFile('public/logo-icon.webp');

await sharp(imgPath)
  .extract({ left: iconLeft, top: iconTop, width: iconWidth, height: iconHeight })
  .resize({ width: 64, height: 64, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .png()
  .toFile('public/favicon.png');

console.log('Successfully generated logo.webp, logo-icon.webp, and favicon.png!');
