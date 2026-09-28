export function decodeText(value = '') {
  return value.replace(/&#(x[\da-f]+|\d+);/gi, (entity, number) => {
    const code = number[0].toLowerCase() === 'x' ? parseInt(number.slice(1), 16) : Number(number);
    return code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  }).replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map(match => [match[1].toLowerCase(), decodeText(match[2] ?? match[3] ?? match[4])]));
}

export function auditHtml(html, url, headerRobots = '') {
  const markup = html.replace(/<!--[^]*?-->/g, '').replace(/<script\b[^>]*>[^]*?<\/script>/gi, '');
  const title = decodeText(markup.match(/<title\b[^>]*>([^]*?)<\/title>/i)?.[1] ?? '').trim();
  const metas = [...markup.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0]));
  const description = metas.find(meta => meta.name?.toLowerCase() === 'description')?.content ?? '';
  const robots = [headerRobots, ...metas.filter(meta => /^(robots|googlebot)$/i.test(meta.name ?? '')).map(meta => meta.content)].join(', ');
  const canonicalValue = [...markup.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0])).find(link => link.rel?.toLowerCase() === 'canonical')?.href;
  let canonical = '';
  try { if (canonicalValue) canonical = new URL(canonicalValue, url).href; } catch {}
  const links = [...new Set([...markup.matchAll(/<a\b[^>]*>/gi)].flatMap(match => {
    const href = attributes(match[0]).href;
    if (!href || href.startsWith('#')) return [];
    try {
      const target = new URL(href, url);
      target.hash = '';
      return /^https?:$/.test(target.protocol) ? [target.href] : [];
    } catch { return []; }
  }))];
  const images = [...new Set([...markup.matchAll(/<img\b[^>]*>/gi)].flatMap(match => {
    const src = attributes(match[0]).src;
    if (!src) return [];
    try {
      const target = new URL(src, url);
      target.hash = '';
      return /^https?:$/.test(target.protocol) ? [target.href] : [];
    } catch { return []; }
  }))];
  const h1Count = [...markup.matchAll(/<h1(?:\s|>)/gi)].length;
  const noindex = /\b(noindex|none)\b/i.test(robots);
  const issues = [];
  if (!title) issues.push('Missing title');
  if (!description) issues.push('Missing meta description');
  if (title && (title.length < 15 || title.length > 75)) issues.push('Review title length (editorial heuristic, not a ranking rule)');
  if (h1Count !== 1) issues.push(`Expected one H1; found ${h1Count}`);
  if (!canonical) issues.push('Missing or invalid canonical');
  else if (canonical.replace(/\/$/, '') !== url.replace(/\/$/, '')) issues.push('Canonical differs from requested URL');
  const structuredTypes = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([^]*?)<\/script>/gi)) {
    if (attributes(match[1]).type !== 'application/ld+json') continue;
    try {
      const data = JSON.parse(match[2]);
      const entries = Array.isArray(data) ? data : [data, ...(data['@graph'] ?? [])];
      structuredTypes.push(...entries.flatMap(entry => entry?.['@type'] ?? []));
    } catch { issues.push('Invalid JSON-LD'); }
  }
  if (/^\/(yojna|guide|category|state|samachar)\/.+/.test(new URL(url).pathname) && !structuredTypes.includes('BreadcrumbList')) issues.push('Breadcrumb structured data absent; inspect visible navigation');
  return { url, title, description, canonical, noindex, h1Count, structuredTypes, links, images, issues };
}

export function isPublicAuditUrl(value, origin) {
  try {
    const url = new URL(value, origin);
    return url.origin === origin && !url.username && !url.password && !url.search && !url.hash &&
      !/^\/(admin(?:-login)?|api|out|saved|family|reminders|mere-liye|signin-with-chatgpt)(\/|$)/i.test(url.pathname) &&
      !/\.[a-z0-9]{1,8}$/i.test(url.pathname);
  } catch { return false; }
}

export function auditCollection(pages, sitemapUrls) {
  const normalized = value => value.replace(/\/$/, '');
  const sitemap = new Set(sitemapUrls.map(normalized));
  const findings = [];
  for (const page of pages) {
    if (page.status !== 200) continue;
    if (page.noindex && sitemap.has(normalized(page.url))) findings.push({ url: page.url, issue: 'Sitemap URL is noindex' });
    if (!page.noindex && !sitemap.has(normalized(page.url))) findings.push({ url: page.url, issue: 'Indexable page absent from sitemap; review inclusion' });
    if (sitemap.has(normalized(page.url)) && new URL(page.url).pathname !== '/' &&
      !pages.some(other => other.url !== page.url && other.links.some(link => normalized(link) === normalized(page.url)))) {
      findings.push({ url: page.url, issue: 'No incoming link in scanned HTML (orphan candidate, not proof)' });
    }
    if (page.noindex) continue;
    for (const field of ['title', 'description']) {
      if (page[field] && pages.some(other => other.url !== page.url && other.status === 200 && !other.noindex && other[field] === page[field])) {
        findings.push({ url: page.url, issue: `Duplicate ${field}` });
      }
    }
  }
  return findings;
}
