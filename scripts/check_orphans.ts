import { allSchemes } from '../lib/server';

async function main() {
  const schemes = await allSchemes();
  const orphans = schemes.filter(s => s.status === 'ACTIVE' && !s.isSample && (!s.category || s.category.trim() === ''));
  console.log("Orphans:", orphans.map(o => o.slug));
  process.exit(0);
}
main();
