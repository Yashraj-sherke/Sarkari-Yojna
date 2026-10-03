import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';

test('state opportunity surface is reviewed-only and links existing pages', async () => {
  const component = await readFile(new URL('../components/state-opportunity.tsx', import.meta.url), 'utf8');
  assert(component.includes('schemes.filter(isIndexableScheme)'));
  assert(component.includes('/category/${category.id}'));
  assert(component.includes('/yojna/${scheme.slug}'));
});

test('state route wires the reviewed opportunity surface', async () => {
  const source = await readFile(new URL('../app/state/[id]/page.tsx', import.meta.url), 'utf8');
  assert(source.includes('<StateOpportunity'));
  assert.match(source, /robots\s*:\s*\{\s*index:\s*indexable/s);
});