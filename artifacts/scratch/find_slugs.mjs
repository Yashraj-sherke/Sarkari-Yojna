import fs from 'fs';
import path from 'path';

const content = fs.readFileSync(path.resolve('lib/mp-schemes-data.ts'), 'utf8');

const regex = /"slug": "([^"]+)"/g;
let match;
const slugs = [];
while ((match = regex.exec(content)) !== null) {
  slugs.push(match[1]);
}

const targetSlugs = [
  'pm-kisan', 'ayushman-bharat', 'pm-awas', 'pm-ujjwala', 'pm-vishwakarma', 
  'atal-pension', 'ration-card', 'ladli-behna', 'ladli-laxmi'
];

console.log("Matching slugs:");
for (const target of targetSlugs) {
  const matches = slugs.filter(s => s.includes(target));
  console.log(`${target}: ${matches.join(', ')}`);
}
