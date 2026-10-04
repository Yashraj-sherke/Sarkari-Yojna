import { seeds } from './lib/seed.ts';

const scheme = seeds.find(s => s.slug === 'rani-durgavati-shri-anna-protsahan-yojana');
if (scheme) {
  console.log("Scheme found!");
  console.log("First item of detailedDescription:", scheme.detailedDescription?.[0]);
} else {
  console.log("Scheme not found in seeds!");
}
