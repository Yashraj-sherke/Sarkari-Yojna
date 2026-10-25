import React from 'react';
import { ImageResponse } from 'next/og.js';
import { writeFile } from 'node:fs/promises';

// Code-rendered social card: no government insignia or external asset requests.
const h = React.createElement;
const image = new ImageResponse(h('div', {style: {
  width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
  justifyContent: 'space-between', padding: '70px', background: '#f8fafc',
  color: '#0f172a', borderTop: '18px solid #0f766e',
}},
  h('div', {style: {display: 'flex', fontSize: 28, color: '#0f766e'}}, 'SARKARI YOJANA SETU'),
  h('div', {style: {display: 'flex', flexDirection: 'column', gap: 22}},
    h('div', {style: {fontSize: 72, fontWeight: 700, lineHeight: 1.08}}, 'Understand government schemes'),
    h('div', {style: {fontSize: 30, color: '#475569'}}, 'Benefits · Eligibility · Application guidance'),
  ),
  h('div', {style: {display: 'flex', flexDirection: 'column', gap: 12}},
    h('div', {style: {fontSize: 26}}, 'sarkariyojanasetu.com'),
    h('div', {style: {fontSize: 22, color: '#64748b'}}, 'Independent information platform'),
  ),
), {width: 1200, height: 630});
await writeFile('public/og-default.png', Buffer.from(await image.arrayBuffer()));
console.log('Created public/og-default.png (1200 × 630).');
