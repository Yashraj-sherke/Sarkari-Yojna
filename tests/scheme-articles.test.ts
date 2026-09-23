import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seeds} from '../lib/seed';
import {schemeSchema, officialUrl} from '../lib/domain';
import {enrichSchemeArticle} from '../lib/scheme-articles';
import {getSchemeFaqs, getSchemeProcess} from '../lib/scheme-details';

test('every catalogue article has all content sections and honest source provenance', () => {
  assert.equal(seeds.length, 153);
  for (const s of seeds) {
    assert(schemeSchema.safeParse(s).success, s.slug);
    for (const field of ['detailedDescription','benefitsList','eligibilityDescription','exclusions','applicationProcess','documents','references'] as const) assert(s[field]?.length, `${s.slug}: ${field}`);
    assert((s.faqs?.length ?? 0) >= 6, `${s.slug}: FAQs`);
    assert(s.trackingGuidance, s.slug);
    for (const ref of s.references!) assert(officialUrl(ref.url));
    if (s.editorial?.verificationStatus === 'NEEDS_VERIFICATION') {
      assert.equal(s.editorial.reviewedAt, null);
      assert.equal(s.editorial.publicationStatus, 'DRAFT_REVIEW_REQUIRED');
    }
  }
});
test('article enrichment is idempotent and does not mutate the source', () => {
  for (const s of seeds) {
    const before = JSON.stringify(s);
    assert.deepEqual(enrichSchemeArticle(s), s, s.slug);
    assert.equal(JSON.stringify(s), before);
  }
});
test('ration distinguishes household amounts and state-specific unknowns', () => {
  const s = seeds.find(s => s.slug === 'ration-support')!;
  const benefits = JSON.stringify(s.benefitsList);
  assert.match(benefits, /4 × 5 = 20/);
  assert.match(benefits, /35 किलो.*पूरे परिवार/);
  assert.equal(s.applicationUrl, '');
  assert.match(s.documents.join(' '), /एक समान सूची नहीं/);
  assert.match(s.exclusions!.join(' '), /पूरे भारत पर लागू नहीं/);
  assert.equal(s.references!.length, 5);
});
test('FAQ metadata uses the same questions as the rendered Hindi article', () => {
  for (const s of seeds) assert.deepEqual(getSchemeFaqs(s), s.faqs!.map(f => ({q:f.question,a:f.answer})));
});
test('an official homepage alone does not establish online application mode', () => {
  const s = {...seeds[0], applicationProcess: undefined, applicationUrl: 'https://pmkisan.gov.in/'};
  assert.match(getSchemeProcess(s).mode, /सत्यापन आवश्यक/);
});
test('reviewed changes do not leave contradictory English fields or old loan caps', () => {
  const s = seeds.find(s => s.slug === 'pm-mudra')!;
  assert.match(s.benefit, /20 लाख/);
  assert.match(s.eligibilityDescription!.join(' '), /पुनर्भुगतान/);
  assert.equal(s.benefitEn, undefined);
  assert.equal(s.applicationUrl, '');
  assert.equal(seeds.find(s => s.slug === 'ladli-behna')!.editorial!.publicationStatus, 'DRAFT_REVIEW_REQUIRED');
});
