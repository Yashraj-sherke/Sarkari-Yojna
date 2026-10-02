import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildSchemeNavigation} from '../lib/scheme-navigation';
import {officialContent} from '../lib/official-content';

const core = ['vivaran', 'labh', 'patrata', 'aavedan', 'faqs', 'sandarbh'].map(id => ({id, label: id}));

test('GOBARdhan TOC and sidebar target available article sections without losing content', () => {
  const description = officialContent['gobardhan-scheme'].detailedDescription!;
  const result = buildSchemeNavigation('gobardhan-scheme', description, core);
  assert.equal(result.toc.length, 14);
  assert.equal(result.sidebar.length, 13);
  assert.equal(result.toc[0].label, 'GOBARdhan Scheme क्या है?');
  assert.equal(result.toc[4].label, '₹2 करोड़ / TPD सहायता क्या है?');
  assert.equal(result.sidebar.some(item => item.label.includes('उद्देश्य')), false);
  const html = result.description.join('');
  const targets = new Set([...core.map(item => item.id), ...Array.from(html.matchAll(/\bid="([^"]+)"/g), match => match[1])]);
  for (const item of [...result.toc, ...result.sidebar]) assert(targets.has(item.id), item.id);
  assert.equal(new Set(result.toc.map(item => item.id)).size, result.toc.length);
  assert.deepEqual(result.description.map(html => html.replace(/ id="scheme-topic-[^"]+" style="scroll-margin-top: 30px"/g, '')), description);
});

test('missing optional topics are omitted rather than forcing fourteen headings', () => {
  const result = buildSchemeNavigation('gobardhan-scheme', ['<h2>CBG क्या होता है?</h2><p>मौजूदा जानकारी</p>'], core);
  assert.equal(result.toc.length, core.length + 1);
  assert.equal(result.sidebar.some(item => item.label.includes('TPD')), false);
  assert.equal(result.sidebar.some(item => item.label === 'जरूरी दस्तावेज'), false);
  assert.equal(result.sidebar.some(item => item.label === 'CBG'), true);
});

test('other schemes and English articles retain their existing navigation and text', () => {
  const description = ['मौजूदा लेख'];
  for (const [slug, language] of [['pm-kisan', 'hi'], ['gobardhan-scheme', 'en']] as const) {
    const result = buildSchemeNavigation(slug, description, core, language);
    assert.equal(result.customized, false);
    assert.deepEqual(result.sidebar, core);
    assert.deepEqual(result.description, description);
  }
});
