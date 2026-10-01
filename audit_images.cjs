const fs = require('fs');

// Check all images referenced in scheme-images.ts
const content = fs.readFileSync('lib/scheme-images.ts', 'utf8');
const srcs = [...content.matchAll(/src: '([^']+)'/g)].map(m => m[1]);

// Check all images in public root
const publicFiles = fs.readdirSync('public');
const publicBanners = fs.readdirSync('public/banners').map(f => '/banners/' + f);
const allPublic = new Set([...publicFiles.map(f => '/' + f), ...publicBanners]);

console.log('=== Images in scheme-images.ts missing from public/ ===');
let foundMissing = false;
srcs.forEach(src => {
  if (!allPublic.has(src)) {
    console.log('MISSING:', src);
    foundMissing = true;
  }
});
if (!foundMissing) console.log('None - all present!');

// Check category banners exist
console.log('\n=== Category banner SVGs ===');
const cats = ['cat-kisan', 'cat-mahila', 'cat-shiksha', 'cat-swasthya', 'cat-awas', 'cat-rojgar', 'cat-pension', 'cat-khadya'];
cats.forEach(c => {
  const path = 'public/banners/' + c + '.svg';
  console.log((fs.existsSync(path) ? '[OK]' : '[MISSING]'), '/', c + '.svg');
});

// List all images in public root (non-svg)
console.log('\n=== Image files in public/ ===');
const imgExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
publicFiles.filter(f => imgExts.some(e => f.endsWith(e))).forEach(f => console.log('/', f));
