import { mkdirSync, writeFileSync } from 'node:fs';
import { seeds } from '../lib/seed';
import { officialUrl } from '../lib/domain';
import { isIndexableScheme } from '../lib/seo';
import { selectRelatedSchemes } from '../lib/related-schemes';

const folder = 'artifacts/seo/runbook-2026-10-11';
mkdirSync(folder, { recursive: true });
const records = seeds.map(s => ({
  slug: s.slug, title: s.title, state: s.state, category: s.category, status: s.status,
  indexableInRepository: isIndexableScheme(s),
  verificationStatus: s.editorial?.verificationStatus ?? 'NEEDS_VERIFICATION',
  publicationStatus: s.editorial?.publicationStatus ?? 'DRAFT_REVIEW_REQUIRED',
  lastEditorialReview: s.editorial?.reviewedAt ?? null,
  officialSource: s.sourceUrl, applicationUrl: s.applicationUrl || null,
  relatedSlugs: selectRelatedSchemes(s, seeds).map(candidate => candidate.slug),
  reviewIssues: [
    !officialUrl(s.sourceUrl) && 'Official HTTPS source needs review',
    s.applicationUrl && !officialUrl(s.applicationUrl) && 'Application URL needs review',
    s.editorial?.verificationStatus !== 'VERIFIED_CORE' && 'Current scheme facts require verification',
    !s.editorial?.reviewedAt && 'No recorded independent review date',
    !s.references?.some(ref => ref.accessedAt) && 'No source access date recorded',
    !s.documents.length && 'Document requirements missing',
    !s.applicationProcess?.length && !s.steps.length && 'Application process missing',
    !s.faqs?.length && 'Source-supported FAQ missing',
  ].filter(Boolean),
}));
const priorities = ['rani-durgavati-shri-anna-protsahan-yojana', 'ladli-behna',
  'social-security-pension-portal-mp', 'mukhyamantri-swarojgar-yojana',
  'mukhyamantri-teerth-darshan-yojana', 'krishak-prashikshan-bhraman-yojana', 'pm-kisan'];
const candidates = records.filter(s => isIndexableScheme(seeds.find(seed => seed.slug === s.slug)!) &&
  (s.state === 'madhya-pradesh' || s.slug === 'pm-kisan'));
const targets = [...priorities.flatMap(slug => candidates.find(s => s.slug === slug) ?? []),
  ...candidates.filter(s => !priorities.includes(s.slug))].slice(0, 20);
const duplicateSources = Object.entries(Object.groupBy(records, s => s.officialSource))
  .filter(([source, group]) => source && (group?.length ?? 0) > 1)
  .map(([source, group]) => ({source, slugs: group!.map(s => s.slug), note: 'Shared source is a review candidate, not proof of duplicate intent.'}));
const report = { snapshotDate: '2026-10-11', scope: 'Repository fallback catalogue; no production database or Search Console access.',
  counts: {records: records.length, public: records.filter(s => s.indexableInRepository).length,
    reviewed: records.filter(s => s.publicationStatus === 'REVIEWED').length},
  searchEvidence: 'Historical runbook metrics only; current exports unavailable.',
  records, targets, duplicateSources };
writeFileSync(`${folder}/inventory.json`, JSON.stringify(report, null, 2) + '\n');
writeFileSync(`${folder}/target-pages.md`, '# Target-page review queue\n\nRepository-selected candidates, not verified query demand. Existing URLs remain unchanged. Abhyudaya is excluded from this MP queue because its record belongs to Uttar Pradesh.\n\n' +
  '| Priority | Existing page | Geography | Review status |\n|---|---|---|---|\n' +
  targets.map((s, i) => `| ${i + 1} | [${s.title}](/yojna/${s.slug}) | ${s.state} | ${s.verificationStatus} |`).join('\n') + '\n');
console.log(JSON.stringify(report.counts));

// Both requested skill outputs for the limited PM-KISAN factual correction.
const pm = seeds.find(s => s.slug === 'pm-kisan')!;
writeFileSync(`${folder}/pm-kisan.json`, JSON.stringify(pm, null, 2) + '\n');
writeFileSync(`${folder}/pm-kisan.md`, `# ${pm.title}\n\n${pm.summary}\n\n` +
  'यह सीमित तथ्य सुधार है। आवेदन प्रक्रिया और दस्तावेज़ सूची का पूरा नया सत्यापन नहीं किया गया है।\n\n' +
  '## स्रोत और संदर्भ\n\n' + pm.references!.map(ref => `- [${ref.title}](${ref.url}) — देखा: ${ref.accessedAt ?? 'सत्यापन आवश्यक'}`).join('\n') +
  '\n\nअंतिम पात्रता संबंधित विभाग द्वारा निर्धारित की जाती है।\n');
