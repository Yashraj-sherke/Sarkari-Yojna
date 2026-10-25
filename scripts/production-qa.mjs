import { spawn } from 'child_process';
import { auditHtml } from '../lib/seo-audit.mjs';

const TARGET_URL = process.env.QA_URL || 'http://localhost:3000';
const CRITICAL_ROUTES = [
  '/',
  '/yojna/pm-kisan',
  '/category/kisan',
  '/state/madhya-pradesh',
  '/samachar',
];

async function fetchPage(path) {
  try {
    const res = await fetch(`${TARGET_URL}${path}`);
    const text = await res.text();
    return { status: res.status, text, headers: res.headers };
  } catch (e) {
    return { status: 0, text: '', error: e.message };
  }
}

async function runCheck(name, fn) {
  process.stdout.write(`⏳ Checking: ${name}... `);
  try {
    const passed = await fn();
    if (passed) {
      console.log('✅ PASSED');
      return true;
    } else {
      console.log('❌ FAILED');
      return false;
    }
  } catch (e) {
    console.log(`❌ FAILED (${e.message})`);
    return false;
  }
}

async function runQA() {
  console.log(`\n============================================================`);
  console.log(`PHASE 30 — PRODUCTION QA AUTOMATION`);
  console.log(`Target: ${TARGET_URL}`);
  console.log(`============================================================\n`);

  let allPassed = true;

  // 1. Robots.txt
  allPassed &= await runCheck('Robots.txt check', async () => {
    const { status, text } = await fetchPage('/robots.txt');
    return status === 200 && /^User-agent:\s*\*\s*$/im.test(text) && /^Sitemap:\s*https:\/\/www\.sarkariyojanasetu\.com\/sitemap\.xml\s*$/im.test(text);
  });

  // 2. Sitemap.xml
  allPassed &= await runCheck('Sitemap check', async () => {
    const { status, text } = await fetchPage('/sitemap.xml');
    return status === 200 && text.includes('<urlset');
  });

  // 3. Route Check & 404 Check
  for (const route of CRITICAL_ROUTES) {
    allPassed &= await runCheck(`Route check: ${route}`, async () => {
      const { status } = await fetchPage(route);
      return status === 200;
    });
  }

  // 4. Canonical & Noindex check on Scheme Page
  allPassed &= await runCheck('Canonical & Noindex check on /yojna/pm-kisan', async () => {
    const { status, text, headers } = await fetchPage('/yojna/pm-kisan');
    const page = auditHtml(text, 'https://www.sarkariyojanasetu.com/yojna/pm-kisan', headers?.get('x-robots-tag') ?? '');
    return status === 200 && page.canonical === page.url && !page.noindex;
  });

  // 5. Structured Data Check
  allPassed &= await runCheck('Structured Data check on /yojna/pm-kisan', async () => {
    const { text } = await fetchPage('/yojna/pm-kisan');
    return auditHtml(text, 'https://www.sarkariyojanasetu.com/yojna/pm-kisan').structuredTypes.includes('Article');
  });

  console.log(`\n============================================================`);
  if (allPassed) {
    console.log(`🎉 ALL CHECKS PASSED. READY FOR PRODUCTION.`);
    process.exit(0);
  } else {
    console.error(`🚨 QA FAILED. DO NOT DEPLOY.`);
    process.exit(1);
  }
}

runQA();
