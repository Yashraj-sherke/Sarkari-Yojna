const fs = require('fs');

const officialImagesCode = fs.readFileSync('c:/Users/HP/Desktop/Sarkari Yojna/lib/scheme-images.ts', 'utf8');
const officialImagesMatch = officialImagesCode.match(/export const officialImages: [^=]+ = ({[\s\S]*?});/);
let officialImagesSlugs = [];
if (officialImagesMatch) {
  const keys = [...officialImagesMatch[1].matchAll(/'([^']+)'\s*:/g)].map(m => m[1]);
  officialImagesSlugs = keys;
}

const dataCode = fs.readFileSync('c:/Users/HP/Desktop/Sarkari Yojna/lib/mp-schemes-data.ts', 'utf8');
const dataSlugsMatches = [...dataCode.matchAll(/"slug":\s*"([^"]+)"/g)];
const dataSlugs = dataSlugsMatches.map(m => m[1]);

const titlesMap = {};
const blocks = dataCode.split('"slug":');
for (let i = 1; i < blocks.length; i++) {
  const block = blocks[i];
  const slugMatch = block.match(/^\s*"([^"]+)"/);
  if (slugMatch) {
    const titleMatch = block.match(/"title":\s*"([^"]+)"/);
    if (titleMatch) {
      titlesMap[slugMatch[1]] = titleMatch[1];
    }
  }
}

const missing = dataSlugs.filter(s => !officialImagesSlugs.includes(s));
console.log('Total Official Images:', officialImagesSlugs.length);
console.log('Total Data Slugs:', dataSlugs.length);
console.log('Total Missing:', missing.length);
missing.forEach(s => console.log('- ' + (titlesMap[s] || s) + ' (' + s + ')'));
