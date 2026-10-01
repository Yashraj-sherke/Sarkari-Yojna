import Link from 'next/link';
import { db } from '@/lib/server';
import { schemeSchema } from '@/lib/domain';
import { enrichSchemeArticle } from '@/lib/scheme-articles';
import { schemeHealth } from '@/lib/seo-health';
import crawl from '@/artifacts/seo/live/latest.json';
import performance from '@/artifacts/seo/search-console-baseline.json';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'SEO Health', robots: { index: false, follow: false } };

export default async function SeoHealthPage() {
  const records: ReturnType<typeof schemeHealth>[] = [];
  let databaseError = '';
  const invalidRecords: string[] = [];
  try {
    const sql = db();
    if (!sql) databaseError = 'Database is not configured. Content readiness is unavailable; no seed data is substituted.';
    else {
      const rows = await sql`SELECT slug, data FROM schemes ORDER BY slug`;
      for (const row of rows) {
        try {
          const scheme = schemeSchema.parse(typeof row.data === 'string' ? JSON.parse(row.data) : row.data);
          records.push(schemeHealth(enrichSchemeArticle(scheme)));
        } catch { invalidRecords.push(String(row.slug)); }
      }
    }
  } catch {
    databaseError = 'The database could not be read. Retry later; this is not a zero-record report.';
  }
  const observations = crawl.pages.flatMap(page => page.issues.map(issue => ({ url: page.url, issue })));

  return <div className="space-y-6">
    <header>
      <h1 className="text-3xl font-bold">SEO health & editorial readiness</h1>
      <p className="mt-2 text-slate-600">Technical observations are not Google indexing status or ranking predictions. No content is published by these checks.</p>
    </header>
    <section className="rounded-lg border bg-white p-5">
      <h2 className="text-xl font-semibold">Search Console baseline · {performance.providedAt}</h2>
      <p>{performance.source}. {performance.period}. {performance.searchType}.</p>
      <dl className="my-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[['Clicks', performance.clicks], ['Impressions', performance.impressions], ['CTR', performance.ctr], ['Average position', performance.averagePosition]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd className="text-2xl font-bold">{value}</dd></div>)}
      </dl>
      <p className="text-amber-800">{performance.limitation}</p>
      <p className="mt-3">Next: export Queries, Pages, Countries, Devices and Search appearance for 7 days, 28 days and 3 months. Supply Page indexing, Sitemaps and URL Inspection reports separately.</p>
    </section>
    <section className="rounded-lg border bg-white p-5">
      <h2 className="text-xl font-semibold">Public HTML crawl snapshot</h2>
      <p>Origin: {crawl.origin} · Checked: {crawl.checkedAt}</p>
      <p>{crawl.pages.length} pages sampled · Sitemap HTTP {crawl.sitemapStatus} · Robots HTTP {crawl.robotsStatus}</p>
      <p className="text-sm text-slate-600">{crawl.scope}</p>
      <p className="mt-2">Refresh with <code>node scripts/seo-audit.mjs</code> from the project, then rebuild/deploy to update this saved snapshot. Loading this screen does not crawl websites.</p>
      {(crawl.limited || crawl.networkFailures > 0) && <p className="text-amber-800">Incomplete scan: page cap reached or requests failed. Do not treat missing observations as passing checks.</p>}
      <ul className="list-disc pl-5">{crawl.notices.map(notice => <li key={notice}>{notice}</li>)}</ul>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="text-left font-semibold">Page-level and cross-page observations</caption>
          <thead><tr><th className="p-2">Public URL</th><th className="p-2">Observation</th></tr></thead>
          <tbody>{[...observations, ...crawl.findings].map((finding, index) => <tr key={`${finding.url}-${index}`} className="border-t"><td className="p-2 break-all"><a href={finding.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{new URL(finding.url).pathname}</a></td><td className="p-2">{finding.issue}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
    <section className="rounded-lg border bg-white p-5">
      <h2 className="text-xl font-semibold">Current scheme readiness</h2>
      <p>{records.length} valid records · {records.filter(record => record.indexable).length} meet the current indexing policy.</p>
      <p className="text-sm text-slate-600">Uses the same editorial enrichment as public pages. Checks detect missing fields, not factual truth. Closed or unreviewed pages must not be made indexable just to increase URL counts.</p>
      {databaseError && <p role="alert" className="text-red-700">{databaseError}</p>}
      {invalidRecords.length > 0 && <p role="alert" className="text-red-700">Invalid records requiring repair: {invalidRecords.join(', ')}</p>}
      <ul className="mt-4 space-y-4">{records.map(record => <li key={record.slug} className="border-t pt-3">
        <Link href={`/admin/schemes/edit/${record.slug}`} className="font-semibold text-blue-700 underline">{record.title}</Link>
        <p>{record.indexable ? 'Indexable under current policy' : 'Excluded under current policy'}</p>
        <ul className="list-disc pl-5">{record.issues.map(issue => <li key={issue}>{issue}</li>)}</ul>
        {!record.issues.length && <p>No missing-field observations. Human factual review remains required.</p>}
      </li>)}</ul>
    </section>
    <section className="rounded-lg border bg-amber-50 p-5">
      <h2 className="text-xl font-semibold">Morning drafts: evidence before publishing</h2>
      <p>The existing scheduled generator has no measured trend feed or official-announcement retrieval. Its suggestions are unverified drafts, not confirmed trending questions or newly launched schemes.</p>
      <ol className="list-decimal pl-5"><li>Record a dated query from Search Console or a manually observed search question; do not invent popularity.</li><li>Check the responsible department notification and record sources, applicability, verification date and conflicts.</li><li>Edit an original answer; retain uncertainties and distinguish loans from grants.</li><li>Preview, obtain human review and publish. Verify public URL, canonical and sitemap after deployment.</li></ol>
      <Link href="/admin/news" className="mt-3 inline-block text-blue-700 underline">Review news drafts</Link>
    </section>
  </div>;
}
