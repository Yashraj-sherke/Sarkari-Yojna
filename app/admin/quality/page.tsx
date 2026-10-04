import { allSchemes } from '@/lib/server';
import { runContentQualityGate } from '@/lib/quality-gate';
import Link from 'next/link';

export default async function QualityGateDashboard() {
  const schemes = await allSchemes();
  
  const evaluations = await Promise.all(schemes.map(async (scheme) => {
    const result = await runContentQualityGate(scheme);
    return { scheme, result };
  }));

  const failed = evaluations.filter(e => !e.result.passed);
  const passed = evaluations.filter(e => e.result.passed);
  const duplicateRisks = evaluations.filter(e => e.result.errors.some(err => err.includes('duplicate intent')));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e3a8a' }}>
        Phase 29: Content Quality & Intent Gate
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#166534', margin: 0 }}>Passed Quality Gate</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d', margin: '0.5rem 0 0 0' }}>{passed.length}</p>
        </div>
        <div style={{ padding: '1.5rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#991b1b', margin: 0 }}>Failed / Action Required</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#b91c1c', margin: '0.5rem 0 0 0' }}>{failed.length}</p>
        </div>
        <div style={{ padding: '1.5rem', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#92400e', margin: 0 }}>Duplicate Intent Risks</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#b45309', margin: '0.5rem 0 0 0' }}>{duplicateRisks.length}</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Failing Schemes</h2>
      {failed.length === 0 ? (
        <p style={{ color: '#166534' }}>All schemes passed the quality gate!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {failed.map(({ scheme, result }) => (
            <div key={scheme.slug} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>
                  <Link href={`/yojna/${scheme.slug}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                    {scheme.title}
                  </Link>
                </h3>
                <span style={{ padding: '0.25rem 0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                  Score: {result.score}
                </span>
              </div>
              
              {result.errors.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', color: '#991b1b', marginBottom: '0.5rem', margin: 0 }}>Errors (Phase 27/29)</h4>
                  <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', color: '#b91c1c' }}>
                    {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}
              
              {result.warnings.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#92400e', marginBottom: '0.5rem', margin: 0 }}>Warnings</h4>
                  <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', color: '#b45309' }}>
                    {result.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
