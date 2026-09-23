const fs = require('fs');

let site = fs.readFileSync('components/site.tsx', 'utf8');

// Fix navbar logo
site = site.replace(/width=\{860\}[\s\S]*?height=\{524\}[\s\S]*?priority=\{true\}[\s\S]*?unoptimized=\{true\}/, 'width={123}\n          height={75}\n          priority={true}');

// Fix Card component
site = site.replace(/export function Card\(\{s\}:\{s:SchemeSummary\}\)\{([\s\S]*?)<OfficialImage slug=\{s\.slug\} scheme=\{s\}\/>/, 'export function Card({s, priority = false}:{s:SchemeSummary, priority?: boolean}){$1<OfficialImage slug={s.slug} scheme={s} priority={priority}/>');

fs.writeFileSync('components/site.tsx', site);

console.log("Replaced successfully");
