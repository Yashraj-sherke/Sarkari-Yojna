import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';

test('scheme cluster links use existing anchors, related schemes and guides', async () => {
  const source = await readFile(new URL('../components/scheme/cluster-links.tsx', import.meta.url), 'utf8');
  assert(source.includes('href={`#${item.id}`}'));
  assert(source.includes("/yojna/${scheme.slug}"));
  assert(source.includes("/guide/${guide.slug}"));
});

test('scheme detail renders the cluster block once', async () => {
  const source = await readFile(new URL('../components/yojna-detail-client.tsx', import.meta.url), 'utf8');
  assert.equal((source.match(/<SchemeClusterLinks/g) ?? []).length, 1);
  assert.equal((source.match(/यह भी पढ़ें \(संबंधित योजनाएं\)/g) ?? []).length, 0);
});