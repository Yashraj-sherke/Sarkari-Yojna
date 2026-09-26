const fs = require('fs');

const offContent = fs.readFileSync('lib/official-content.ts', 'utf8');
const mpContent = fs.readFileSync('lib/mp-schemes-data.ts', 'utf8');
const combined = offContent + '\n' + mpContent;

const regex = /'([a-z0-9\-]+)':\s*\{([\s\S]*?)(?=\n  '[a-z0-9\-]+':\s*\{|$)/g;
let match;
const missing = [];

while ((match = regex.exec(combined)) !== null) {
  const slug = match[1];
  const body = match[2];
  
  const appMatch = /applicationUrl:\s*'([^']*)'/.exec(body);
  const srcMatch = /sourceUrl:\s*'([^']*)'/.exec(body);
  
  const appUrl = appMatch ? appMatch[1] : '';
  const srcUrl = srcMatch ? srcMatch[1] : '';
  
  if (!appUrl && !srcUrl) {
    missing.push(slug);
  }
}

console.log('Schemes missing official link:');
if (missing.length === 0) {
  console.log('None! All schemes have at least one link.');
} else {
  missing.forEach(m => console.log('- ' + m));
}
