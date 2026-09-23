import {mkdirSync, writeFileSync} from 'node:fs';
import {seeds} from '../lib/seed';

// A reviewable citizen article and structured database-import data from the same source.
mkdirSync('artifacts', {recursive: true});
writeFileSync('artifacts/scheme-articles.json', JSON.stringify(seeds, null, 2) + '\n', 'utf8');
const sections = seeds.map(s => [
  `# ${s.title}`, s.editorial?.note,
  '## विवरण', ...s.detailedDescription!,
  '## लाभ', ...s.benefitsList!.flatMap(b => [`### ${b.heading}`, ...b.points.map(p => `- ${p}`)]),
  '## पात्रता', ...s.eligibilityDescription!.map(p => `- ${p}`),
  '## कौन पात्र नहीं है?', ...s.exclusions!.map(p => `- ${p}`),
  '## आवेदन प्रक्रिया', ...s.applicationProcess!.flatMap(p => [`### ${p.mode}`, ...p.steps.map((step,i) => `${i+1}. ${step}`)]),
  '## आवश्यक दस्तावेज़', ...s.documents.map(p => `- ${p}`),
  '## आवेदन की स्थिति', s.trackingGuidance,
  '## अक्सर पूछे जाने वाले सवाल', ...s.faqs!.flatMap(f => [`### ${f.question}`, f.answer]),
  '## स्रोत और संदर्भ', ...s.references!.map(r => `- [${r.title}](${r.url}) — ${r.organization}; देखा: ${r.accessedAt ?? 'नई स्वतंत्र जाँच बाकी'}`),
  `अंतिम स्वतंत्र सत्यापन: ${s.editorial?.reviewedAt ?? 'सत्यापन आवश्यक'}`,
  `आधिकारिक आवेदन लिंक: ${s.applicationUrl || 'सत्यापन आवश्यक / राज्यवार प्रक्रिया देखें'}`,
  '## प्रतिपुष्टि', 'इस लेख में सुधार भेजने के लिए योजना पृष्ठ के प्रतिपुष्टि फॉर्म का उपयोग करें। व्यक्तिगत दस्तावेज या बैंक विवरण न भेजें।',
  '## महत्वपूर्ण सूचना', 'अंतिम पात्रता संबंधित विभाग द्वारा निर्धारित की जाती है।',
].filter(Boolean).join('\n\n'));
writeFileSync('artifacts/scheme-articles.md', sections.join('\n\n---\n\n') + '\n', 'utf8');
console.log(`Exported ${seeds.length} articles and structured scheme records.`);
