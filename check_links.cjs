const fs = require('fs');

const seedContent = fs.readFileSync('lib/seed.ts', 'utf8');

const regex = /slug:\s*'([^']+)'[\s\S]*?sourceUrl:\s*'([^']*)'/g;
let match;
const originalSeeds = {};
while ((match = regex.exec(seedContent)) !== null) {
  originalSeeds[match[1]] = match[2];
}

const offContent = fs.readFileSync('lib/official-content.ts', 'utf8');
const mpContent = fs.readFileSync('lib/mp-schemes-data.ts', 'utf8');

const combined = offContent + '\n' + mpContent;

const missing = [];
for (const slug of Object.keys(originalSeeds)) {
  const originalSrc = originalSeeds[slug];
  
  const blockRegex = new RegExp("'" + slug + "':\\s*\\{([\\s\\S]*?)(?=\\n  '[a-z0-9\\-]+':\\s*\\{|$)");
  const blockMatch = blockRegex.exec(combined);
  
  let finalSrc = originalSrc;
  let finalApp = '';
  
  if (blockMatch) {
    const body = blockMatch[1];
    const appMatch = /applicationUrl:\s*'([^']*)'/.exec(body);
    const srcMatch = /sourceUrl:\s*'([^']*)'/.exec(body);
    
    if (srcMatch) finalSrc = srcMatch[1];
    if (appMatch) finalApp = appMatch[1];
  }
  
  if (!finalSrc && !finalApp) {
    missing.push(slug);
  }
}

console.log('Schemes missing official link from seed.ts:');
if (missing.length === 0) {
  console.log('None! All schemes have at least one link.');
} else {
  missing.forEach(m => console.log('- ' + m));
}
