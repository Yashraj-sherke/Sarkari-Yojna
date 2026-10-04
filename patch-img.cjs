const fs = require('fs');
let file = fs.readFileSync('lib/official-content.ts', 'utf8');
const search = `  'rani-durgavati-shri-anna-protsahan-yojana': {\n    ...reviewed,\n    title: 'रानी दुर्गावती श्रीअन्न (मिलेट्स) प्रोत्साहन योजना',`;
const search2 = `  'rani-durgavati-shri-anna-protsahan-yojana': {\r\n    ...reviewed,\r\n    title: 'रानी दुर्गावती श्रीअन्न (मिलेट्स) प्रोत्साहन योजना',`;
const replace = `  'rani-durgavati-shri-anna-protsahan-yojana': {\n    ...reviewed,\n    imageUrl: '/rani-durgavati-shri-anna-protsahan-yojana.jpg',\n    title: 'रानी दुर्गावती श्रीअन्न (मिलेट्स) प्रोत्साहन योजना',`;
const replace2 = `  'rani-durgavati-shri-anna-protsahan-yojana': {\r\n    ...reviewed,\r\n    imageUrl: '/rani-durgavati-shri-anna-protsahan-yojana.jpg',\r\n    title: 'रानी दुर्गावती श्रीअन्न (मिलेट्स) प्रोत्साहन योजना',`;

if(file.includes(search)) {
  fs.writeFileSync('lib/official-content.ts', file.replace(search, replace));
  console.log('Replaced successfully (LF)');
} else if (file.includes(search2)) {
  fs.writeFileSync('lib/official-content.ts', file.replace(search2, replace2));
  console.log('Replaced successfully (CRLF)');
} else {
  console.log('Search string not found');
}
