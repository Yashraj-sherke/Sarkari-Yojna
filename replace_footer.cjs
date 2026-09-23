const fs = require('fs');

let site = fs.readFileSync('components/site.tsx', 'utf8');

site = site.replace(/priority=\{true\}\r?\n\s*unoptimized=\{true\}/, 'priority={true}');

fs.writeFileSync('components/site.tsx', site);
console.log("Replaced footer logo unoptimized");
