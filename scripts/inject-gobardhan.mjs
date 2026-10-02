import fs from 'fs';
import { marked } from 'marked';

const rawMd = fs.readFileSync('C:/Users/HP/.gemini/antigravity-ide/brain/40e05082-6059-4819-812d-246819fef0cb/scratch/gobardhan_raw.md', 'utf-8');
const htmlContent = marked.parse(rawMd);

const fileContent = fs.readFileSync('c:/Users/HP/Desktop/Sarkari Yojna/lib/official-content.ts', 'utf-8');

// We need to replace the detailedDescription array of gobardhan-scheme with a single HTML string
const updatedContent = fileContent.replace(
  /detailedDescription:\s*\[[\s\S]*?\],/,
  `detailedDescription: [\`${htmlContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`],\n    benefitsList: [],\n    benefitsListEn: [],\n    eligibilityDescription: [],\n    eligibilityDescriptionEn: [],`
);

fs.writeFileSync('c:/Users/HP/Desktop/Sarkari Yojna/lib/official-content.ts', updatedContent);
console.log('Done replacing GOBARdhan markdown in official-content.ts');
