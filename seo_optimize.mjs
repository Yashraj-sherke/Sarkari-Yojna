import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const schemeImagesPath = path.join(__dirname, 'lib', 'scheme-images.ts');

let schemeImagesContent = fs.readFileSync(schemeImagesPath, 'utf8');

// List of all files in public
const files = fs.readdirSync(publicDir);

for (const file of files) {
  if (file.match(/^\d{2}_/) || file.includes('_')) {
    // Generate new name:
    // 1. Remove leading digits and underscore
    // 2. Replace all underscores with hyphens
    let newName = file.replace(/^\d{2}_/, '').replace(/_/g, '-');
    
    // Only rename if it's different
    if (newName !== file) {
      const oldPath = path.join(publicDir, file);
      const newPath = path.join(publicDir, newName);
      
      // Rename in file system
      if (fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath);
          console.log(`Renamed: ${file} -> ${newName}`);
      }

      // Update scheme-images.ts
      schemeImagesContent = schemeImagesContent.replaceAll(`/${file}`, `/${newName}`);
    }
  }
}

// 2. Update all alt texts to be more SEO friendly
// We'll replace "का आधिकारिक बैनर", "बैनर", etc., with more descriptive keywords
// E.g., 'Sarkari Yojana: <title> - Eligibility, Benefits & Application Process'
// E.g., in Hindi: '<title> - सरकारी योजना: पात्रता, लाभ और आवेदन प्रक्रिया'
// The regex finds the alt string
schemeImagesContent = schemeImagesContent.replace(/alt:\s*'([^']+)'/g, (match, p1) => {
  let newAlt = p1.replace(/ का आधिकारिक बैनर/g, '')
                 .replace(/ आधिकारिक बैनर/g, '')
                 .replace(/ बैनर/g, '')
                 .replace(/ आधिकारिक /g, '');
  
  if (!newAlt.includes('सरकारी योजना') && !newAlt.includes('Sarkari Yojana')) {
     newAlt = `${newAlt} - सरकारी योजना (Sarkari Yojana): पात्रता, लाभ और आवेदन प्रक्रिया`;
  }
  
  return `alt: '${newAlt}'`;
});

// Write back to scheme-images.ts
fs.writeFileSync(schemeImagesPath, schemeImagesContent, 'utf8');
console.log('Updated lib/scheme-images.ts');
