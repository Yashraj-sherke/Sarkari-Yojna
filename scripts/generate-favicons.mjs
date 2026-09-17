import sharp from 'sharp';
import fs from 'fs';

async function run() {
  const src = 'public/search-logo.webp';
  const img = sharp(src);
  const meta = await img.metadata();
  console.log('Source meta:', meta.width, 'x', meta.height);

  async function makeSquare(size, filename) {
    const innerH = Math.round(size * 0.94);
    const innerW = Math.round(innerH * (meta.width / meta.height));
    const resized = await sharp(src)
      .resize(innerW, innerH, { fit: 'contain' })
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toFile(filename);

    console.log(`Created ${filename} (${size}x${size})`);
  }

  await makeSquare(32, 'public/favicon-32x32.png');
  await makeSquare(48, 'public/favicon-48x48.png');
  await makeSquare(64, 'public/favicon.png');
  await makeSquare(180, 'public/apple-touch-icon.png');
  await makeSquare(192, 'public/icon-192.png');
  await makeSquare(64, 'app/icon.png');

  const buf32 = fs.readFileSync('public/favicon-32x32.png');
  const buf64 = fs.readFileSync('public/favicon.png');

  fs.writeFileSync('public/favicon.ico', buf32);
  fs.writeFileSync('app/favicon.ico', buf32);
  console.log('Created favicon.ico in public/ and app/');

  // Replace public/favicon.svg with embedded SVG of the India logo
  const b64 = buf64.toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><image href="data:image/png;base64,${b64}" width="64" height="64"/></svg>`;
  fs.writeFileSync('public/favicon.svg', svg);
  console.log('Successfully replaced public/favicon.svg with India emblem SVG');
}

run().catch(console.error);
