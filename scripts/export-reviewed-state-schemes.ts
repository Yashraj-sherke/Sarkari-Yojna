import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { reviewedStateSchemes } from '../lib/scheme-content/state-schemes-reviewed';
import { schemeSchema, officialUrl } from '../lib/domain';
import { enrichSchemeArticle } from '../lib/scheme-articles';
import { seeds } from '../lib/seed';
import { buildSchemeNavigation } from '../lib/scheme-navigation';
import { getSchemeTags } from '../lib/scheme-details';
import { stateNames } from '../lib/state-names';

const output = new URL('../artifacts/state-schemes-2026-10-11/', import.meta.url);
await mkdir(output, { recursive: true });
const manifest = [];
for (const [slug, input] of Object.entries(reviewedStateSchemes)) {
  const scheme = schemeSchema.parse(input);
  assert.equal(scheme.slug, slug);
  assert.ok(scheme.references?.every(source => officialUrl(source.url) && source.accessedAt));
  assert.ok(scheme.faqs && scheme.faqs.length >= 6);
  const html = scheme.detailedDescription!.join('\n');
  assert.ok(!/<h1\b|<script\b|\bon\w+=/i.test(html), 'Article must not add an H1 or executable markup');
  const navigation = buildSchemeNavigation(slug, scheme.detailedDescription!, [{id: 'faqs', label: 'FAQs'}]);
  assert.ok(navigation.customized && navigation.toc.length > 8);
  assert.equal(new Set(navigation.toc.map(item => item.id)).size, navigation.toc.length);
  for (const item of navigation.toc.filter(item => item.id !== 'faqs')) {
    assert.ok(navigation.description.join('').includes(`id="${item.id}"`));
  }
  const legacy = enrichSchemeArticle({...scheme, summary: 'Old database summary', documents: ['Old document'], detailedDescriptionEn: ['Outdated translation'], faqsEn: [{question: 'Old', answer: 'Old'}]});
  assert.equal(legacy.summary, scheme.summary, 'Database record must receive reviewed facts');
  assert.equal(legacy.detailedDescriptionEn, undefined, 'Do not display obsolete English facts');
  assert.equal(legacy.faqsEn, undefined);
  assert.ok(seeds.some(seed => seed.slug === slug && seed.summary === scheme.summary), 'Fallback route must exist');
  assert.ok(getSchemeTags(scheme).includes(stateNames[scheme.state]), 'State label must not become Central Government');

  const parts = [
    `# ${scheme.title}`, scheme.summary,
    `अंतिम स्रोत जाँच: 11 अक्टूबर 2026\n\nसत्यापन: ${scheme.editorial!.verificationStatus}\n\nप्रकाशन समीक्षा: ${scheme.editorial!.publicationStatus}\n\n${scheme.editorial!.note}`,
    ...scheme.detailedDescription!,
    '## लाभ', ...scheme.benefitsList!.map(group => `### ${group.heading}\n\n${group.points.map(point => `- ${point}`).join('\n')}`),
    '## पात्रता', ...scheme.eligibilityDescription!,
    '## कौन पात्र नहीं है?', ...scheme.exclusions!,
    '## आवश्यक दस्तावेज़', scheme.documents.map(item => `- ${item}`).join('\n'),
    '## आवेदन कैसे करें?', scheme.steps.map((item, index) => `${index + 1}. ${item}`).join('\n'),
    '## आवेदन की स्थिति कैसे देखें?', scheme.trackingGuidance!,
    '## अक्सर पूछे जाने वाले सवाल', ...scheme.faqs!.map(faq => `### ${faq.question}\n\n${faq.answer}`),
    '## स्रोत और संदर्भ', ...scheme.references!.map(source => `[${source.title}](${source.url}) — ${source.sections.join('; ')}${source.note ? `\n\n${source.note}` : ''}`),
    `आधिकारिक आवेदन मार्ग: ${scheme.applicationUrl}`,
    '## महत्वपूर्ण सूचना', 'Sarkari Yojana एक स्वतंत्र नागरिक सूचना मंच है। अंतिम पात्रता, स्वीकृति और भुगतान संबंधित सरकारी विभाग द्वारा निर्धारित होते हैं।',
  ];
  await writeFile(new URL(`${slug}.md`, output), parts.join('\n\n') + '\n');
  await writeFile(new URL(`${slug}.json`, output), JSON.stringify(scheme, null, 2) + '\n');
  manifest.push({slug, route: `/yojna/${slug}`, headingCount: (html.match(/<h2\b/g) ?? []).length, faqs: scheme.faqs!.length, articleCharacters: html.replace(/<[^>]+>/g, '').length, verificationStatus: scheme.editorial!.verificationStatus});
}
await writeFile(new URL('manifest.json', output), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({validated: manifest.length, articles: manifest}, null, 2));
