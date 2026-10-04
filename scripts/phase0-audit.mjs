// scripts/phase0-audit.mjs
// Phase 0 – Indexing Audit
// Checks for accidental noindex, missing robots.txt, sitemap, canonical tags.

import { fetch } from 'undici';

const TARGET = process.env.AUDIT_URL || 'http://localhost:3000';
const CHECK_PATHS = [
  '/',
  '/yojna/pm-kisan',
  '/yojna/gobardhan-scheme-2026',
  '/robots.txt',
  '/sitemap.xml',
];

function extractMeta(html, name) {
  const regex = new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractLink(html, rel) {
  const regex = new RegExp(`<link\\s+[^>]*rel=["']${rel}["'][^>]*href=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

async function checkUrl(path) {
  const url = new URL(path, TARGET).toString();
  try {
    const resp = await fetch(url);
    const status = resp.status;
    const headers = resp.headers;
    const body = await resp.text();
    const metaRobots = extractMeta(body, 'robots');
    const metaGooglebot = extractMeta(body, 'googlebot');
    const xRobots = headers.get('x-robots-tag') || '';
    const canonical = extractLink(body, 'canonical');
    const hasNoindex = (metaRobots && /noindex/i.test(metaRobots)) ||
      (metaGooglebot && /noindex/i.test(metaGooglebot)) ||
      /noindex/i.test(xRobots);
    const result = {
      url,
      status,
      hasNoindex,
      canonical: canonical || null,
      xRobots,
    };
    console.log(JSON.stringify(result));
  } catch (e) {
    console.error(`FAIL: ${url} -> ${e.message}`);
  }
}

async function run() {
  console.log('=== Phase 0 Indexing Audit ===');
  for (const p of CHECK_PATHS) {
    await checkUrl(p);
  }
  console.log('Audit completed');
}

run();
