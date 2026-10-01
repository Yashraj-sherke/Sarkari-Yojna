import { mpSchemes } from './lib/mp-schemes-data.ts';

const mahilaSchemes = mpSchemes.filter(s => s.category === 'mahila');
console.log('List of Yojanas with category "mahila":\n');
mahilaSchemes.forEach((s, idx) => {
  console.log(`${idx + 1}. ${s.title} (${s.slug})`);
});
