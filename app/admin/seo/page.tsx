import Link from 'next/link';
import { db } from '@/lib/server';
import { schemeSchema } from '@/lib/domain';
import { enrichSchemeArticle } from '@/lib/scheme-articles';
import { schemeContentBrief, schemeHealth, schemeInventory, schemeOnPageAudit, schemeQualityGate } from '@/lib/seo-health';
import { getAllSamachar, samacharQuality } from '@/lib/samachar';
import { searchConsoleOpportunityReport } from '@/lib/search-console';
import crawl from '@/artifacts/seo/live/latest.json';
import performance from '@/artifacts/seo/search-console-baseline.json';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'SEO Health', robots: { index: false, follow: false } };

export default async function SeoHealthPage() {
  const records: ReturnType<typeof schemeHealth>[] = [];
  const inventory: ReturnType<typeof schemeInventory>[] = [];
  const briefs: ReturnType<typeof schemeContentBrief>[] = [];
  const onPageAudits: ReturnType<typeof schemeOnPageAudit>[] = [];
  const qualityGates: ReturnType<typeof schemeQualityGate>[] = [];
  const updateQuality = (await getAllSamachar()).map(samacharQuality);
  const searchConsoleReport = searchConsoleOpportunityReport('queries' in performance ? performance.queries : null);
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
            const enriched = enrichSchemeArticle(scheme);
            records.push(schemeHealth(enriched));
            inventory.push(schemeInventory(enriched));
            briefs.push(schemeContentBrief(enriched));
            onPageAudits.push(schemeOnPageAudit(enriched));
            qualityGates.push(schemeQualityGate(enriched));
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
      <h2 className="text-xl font-semibold">Search opportunity queue</h2>
      <p className="text-sm text-slate-600">Uses only imported Search Console query/page rows. No volume, ranking probability, or traffic estimate is inferred.</p>
      {!searchConsoleReport.available ? <p className="mt-3 text-amber-800">Data unavailable: {searchConsoleReport.reason}. Export query/page rows before prioritizing opportunities.</p> : <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm"><caption className="text-left font-semibold">Phase 19 SEO Optimization Queue (Avg Imp: {Math.round(searchConsoleReport.metrics?.avgImpressions || 0)}, Avg CTR: {((searchConsoleReport.metrics?.avgCtr || 0) * 100).toFixed(1)}%)</caption><thead><tr className="border-b"><th className="p-2">Query</th><th className="p-2">Page</th><th className="p-2">Imp</th><th className="p-2">Pos</th><th className="p-2">Rule Trigger</th><th className="p-2">Suggested Action</th></tr></thead><tbody>{searchConsoleReport.rows.map(row => <tr key={`${row.query}-${row.page}`} className="border-t"><td className="p-2">{row.query ?? 'Data unavailable'}</td><td className="p-2 break-all">{row.page ?? 'Data unavailable'}</td><td className="p-2">{row.impressions}</td><td className="p-2">{row.position}</td><td className="p-2 font-semibold text-amber-800">{row.opportunity}</td><td className="p-2">{row.suggestedAction}</td></tr>)}</tbody></table>
      </div>}
    </section>
    <section className="rounded-lg border bg-white p-5">
      <h2 className="text-xl font-semibold">On-page SEO quality gate</h2>
      <p className="text-sm text-slate-600">Checks are implementation readiness signals, not ranking guarantees. Failed checks require review; this dashboard does not rewrite public metadata.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="text-left font-semibold">Title, description, media and structured-data readiness</caption>
          <thead><tr className="border-b"><th className="p-2">Scheme</th><th className="p-2">Title</th><th className="p-2">Description</th><th className="p-2">Canonical/H1</th><th className="p-2">Hero/alt</th><th className="p-2">Structured data</th><th className="p-2">Result</th></tr></thead>
          <tbody>{onPageAudits.map(audit => <tr key={audit.slug} className="border-t align-top">
            <td className="p-2"><Link href={`/admin/schemes/edit/${audit.slug}`} className="text-blue-700 underline">{audit.title}</Link></td>
            <td className="p-2">{audit.checks.title ? 'Pass' : 'Review'}</td>
            <td className="p-2">{audit.checks.description ? 'Pass' : 'Review'}</td>
            <td className="p-2">{audit.checks.canonical && audit.checks.h1 ? 'Pass' : 'Review'}</td>
            <td className="p-2">{audit.checks.heroImage && audit.checks.imageAlt ? 'Pass' : 'Review'}</td>
            <td className="p-2">{audit.checks.structuredData ? 'Pass' : 'Review'}</td>
            <td className="p-2"><strong>{audit.status}</strong>{audit.issues.length > 0 && <><br /><span className="text-xs text-slate-500">{audit.issues.join(', ')}</span></>}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
    <section className="rounded-lg border bg-white p-5">
      <h2 className="text-xl font-semibold">Update evidence queue</h2>
      <p className="text-sm text-slate-600">Updates enter the sitemap only after the headline, date, change summary, affected audience, official source, and scheme-pillar link are present.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="text-left font-semibold">Published update readiness</caption>
          <thead><tr className="border-b"><th className="p-2">Update</th><th className="p-2">Sitemap status</th><th className="p-2">Missing evidence</th></tr></thead>
          <tbody>{updateQuality.map(update => <tr key={update.slug} className="border-t align-top">
            <td className="p-2"><Link href={`/samachar/${update.slug}`} className="text-blue-700 underline">{update.title}</Link></td>
            <td className="p-2">{update.publishable ? 'Included' : 'Held for review'}</td>
            <td className="p-2">{update.issues.length ? update.issues.join(', ') : 'None recorded'}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
    <section className="rounded-lg border bg-white p-5">
      <h2 className="text-xl font-semibold">Content brief queue</h2>
      <p className="text-sm text-slate-600">Internal briefs convert verified inventory gaps into review tasks. They do not generate or publish content, and search evidence remains unavailable until an export is supplied.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="text-left font-semibold">Pillar improvement briefs</caption>
          <thead><tr className="border-b"><th className="p-2">Scheme</th><th className="p-2">Page type / intent</th><th className="p-2">Primary query / user problem</th><th className="p-2">Required sections</th><th className="p-2">Missing evidence</th><th className="p-2">Source requirement</th><th className="p-2">Related pages</th><th className="p-2">Priority</th></tr></thead>
          <tbody>{briefs.map(brief => <tr key={brief.slug} className="border-t align-top">
            <td className="p-2"><Link href={`/admin/schemes/edit/${brief.slug}`} className="text-blue-700 underline">{brief.title}</Link><br /><span className="text-xs text-slate-500">{brief.publishable ? 'Current policy: publishable' : 'Current policy: hold'}</span></td>
            <td className="p-2">{brief.pageType}<br />{brief.primaryIntent}</td>
            <td className="p-2">{brief.primaryQuery}<br /><span className="text-xs text-slate-500">{brief.userProblem}</span></td>
            <td className="p-2">{brief.requiredSections.join(', ')}</td>
            <td className="p-2">{brief.missingEvidence.length ? brief.missingEvidence.join(', ') : 'None recorded'}</td>
            <td className="p-2">{brief.officialSources.join(', ')}</td>
            <td className="p-2">{brief.relatedPages.join(', ')}</td>
            <td className="p-2"><strong>{brief.publishingPriority}</strong><br /><span className="text-xs text-slate-500">{brief.updateRequirement}</span></td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
    <section className="rounded-lg border bg-white p-5">
      <h2 className="text-xl font-semibold">Combined publishing quality gate</h2>
      <p className="text-sm text-slate-600">A scheme is publishable only when editorial evidence, content coverage, and on-page implementation all pass. This is an internal gate, not a ranking score.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="text-left font-semibold">Phase 12 + 13 readiness</caption>
          <thead><tr className="border-b"><th className="p-2">Scheme</th><th className="p-2">Evidence</th><th className="p-2">Content</th><th className="p-2">On-page</th><th className="p-2">Result</th><th className="p-2">Blockers</th></tr></thead>
          <tbody>{qualityGates.map(gate => <tr key={gate.slug} className="border-t align-top">
            <td className="p-2"><Link href={`/admin/schemes/edit/${gate.slug}`} className="text-blue-700 underline">{gate.title}</Link></td>
            <td className="p-2">{gate.evidenceReady ? 'Pass' : 'Hold'}</td>
            <td className="p-2">{gate.contentReady ? 'Pass' : 'Hold'}</td>
            <td className="p-2">{gate.onPageReady ? 'Pass' : 'Hold'}</td>
            <td className="p-2"><strong>{gate.publishable ? 'Publishable' : 'Hold'}</strong></td>
            <td className="p-2">{gate.blockers.length ? gate.blockers.join(', ') : 'None recorded'}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
    <section className="rounded-lg border bg-white p-5">
      <h2 className="text-xl font-semibold">Public HTML crawl snapshot</h2>
      <p>Origin: {crawl.origin} · Checked: {crawl.checkedAt}</p>
      <p>{crawl.pages.length} pages sampled · Sitemap HTTP {crawl.sitemapStatus} · Robots HTTP {crawl.robotsStatus}</p>
      <p className="text-sm text-slate-600">{crawl.scope}</p>
      <p className="mt-2">Refresh with <code>node scripts/seo-audit.mjs</code> from the project, then rebuild/deploy to update this saved snapshot. Loading this screen does not crawl websites.</p>
      {(crawl.limited || crawl.networkFailures > 0) && (
        <p className="text-amber-800 flex items-center">
          <img src="/images/status_incomplete.jpg" alt="Incomplete" className="inline mr-2 w-5 h-5" />
          Incomplete scan: page cap reached or requests failed. Do not treat missing observations as passing checks.
        </p>
      )}
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
    <section className="rounded-lg border bg-white p-5">
      <h2 className="text-xl font-semibold">Internal scheme inventory</h2>
      <p className="text-sm text-slate-600">Classifications are operational triage labels, not rankings or public scores. Search demand, duplicate risk and traffic metrics are Data unavailable until verified evidence is imported.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="text-left font-semibold">Coverage and publication inventory</caption>
          <thead><tr className="border-b"><th className="p-2">Scheme</th><th className="p-2">Category / state</th><th className="p-2">Status</th><th className="p-2">Indexable</th><th className="p-2">Priority</th><th className="p-2">Last review/update</th><th className="p-2">Primary intent</th><th className="p-2">Missing intents</th><th className="p-2">Class</th></tr></thead>
          <tbody>{inventory.map(item => <tr key={item.slug} className="border-t align-top">
            <td className="p-2"><Link href={`/admin/schemes/edit/${item.slug}`} className="text-blue-700 underline">{item.title}</Link><div className="text-xs text-slate-500">{item.slug}</div></td>
            <td className="p-2">{item.category}<br />{item.state}</td>
            <td className="p-2">{item.status}</td>
            <td className="p-2">{item.indexable ? 'Yes' : 'No'}<br /><span className="text-xs text-slate-500">Source: {item.officialSource ? 'Yes' : 'No'}</span></td>
            <td className="p-2">{item.priority ? 'High' : 'Normal'}</td>
            <td className="p-2">{item.latestKnownUpdate ? new Date(item.latestKnownUpdate).toLocaleDateString('en-IN') : 'Data unavailable'}</td>
            <td className="p-2">{item.primaryIntent}<br /><span className="text-xs text-slate-500">Evidence: {item.searchEvidence}</span></td>
            <td className="p-2">{item.missingIntents.length ? item.missingIntents.join(', ') : 'None recorded'}</td>
            <td className="p-2"><strong>{item.classification}</strong><br /><span className="text-xs text-slate-500">{item.classificationNote}</span></td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
    <section className="rounded-lg border bg-amber-50 p-5">
      <h2 className="text-xl font-semibold">Morning drafts: evidence before publishing</h2>
      <p>The existing scheduled generator has no measured trend feed or official-announcement retrieval. Its suggestions are unverified drafts, not confirmed trending questions or newly launched schemes.</p>
      <ol className="list-decimal pl-5"><li>Record a dated query from Search Console or a manually observed search question; do not invent popularity.</li><li>Check the responsible department notification and record sources, applicability, verification date and conflicts.</li><li>Edit an original answer; retain uncertainties and distinguish loans from grants.</li><li>Preview, obtain human review and publish. Verify public URL, canonical and sitemap after deployment.</li></ol>
      <Link href="/admin/news" className="mt-3 inline-block text-blue-700 underline">Review news drafts</Link>
    </section>
  </div>;
}
