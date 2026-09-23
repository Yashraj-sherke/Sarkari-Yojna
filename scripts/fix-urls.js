const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'components/whatsapp-share.tsx',
  'app/yojna/[slug]/page.tsx',
  'app/sitemap.ts',
  'app/robots.ts',
  'app/page.tsx',
  'app/layout.tsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.resolve(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/https:\/\/sarkariyojanasetu\.com/g, 'https://sarkari-yojna.vercel.app');
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
