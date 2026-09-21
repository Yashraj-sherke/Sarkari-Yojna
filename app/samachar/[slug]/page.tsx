import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSamachar } from '@/lib/samachar';
import { Sidebar } from '@/components/site';
import { AdSensePlaceholder } from '@/components/ads';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const s = await getSamachar(slug);
  if (!s) return { title: 'समाचार नहीं मिला' };
  
  return {
    title: s.title,
    description: s.summary,
    openGraph: { title: s.title, description: s.summary, type: 'article', locale: 'hi_IN' }
  };
}

export default async function SamacharDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const s = await getSamachar(slug);
  
  if (!s) return notFound();

  return (
    <div className="workspace">
      <Sidebar />
      <main id="main" className="directory" style={{padding: '2rem'}}>
        <div className="breadcrumb" style={{marginBottom: '20px'}}>
          <Link href="/">होम</Link> <span>/</span> <Link href="/samachar">समाचार</Link> <span>/</span> {s.title}
        </div>
        
        <article style={{background: 'white', borderRadius: '12px', padding: '30px', border: '1px solid #e2e8f0'}}>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px'}}>
            <span style={{background: '#edf2f7', color: '#4a5568', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600}}>
              {s.category}
            </span>
            <time style={{color: '#718096', fontSize: '0.85rem'}}>
              {new Date(s.date).toLocaleDateString('hi-IN')}
            </time>
          </div>
          
          <h1 style={{fontSize: '2.2rem', fontWeight: 800, marginBottom: '20px', color: '#111', lineHeight: 1.3}}>
            {s.title}
          </h1>
          
          <div style={{marginBottom: '30px', color: '#4a5568', fontWeight: 500}}>
            लेखा: {s.author}
          </div>

          <div style={{marginTop: 20, marginBottom: 40}}>
            <AdSensePlaceholder client="ca-pub-xxxxxxxx" slot="xxxxxxxxx" />
          </div>
          
          <div className="article-body" style={{fontSize: '1.1rem', color: '#2d3748', lineHeight: 1.7}}>
            {s.body.map((p, idx) => (
              <p key={idx} style={{marginBottom: '20px'}}>{p}</p>
            ))}
          </div>

          <div style={{marginTop: 40}}>
            <AdSensePlaceholder client="ca-pub-xxxxxxxx" slot="xxxxxxxxx" />
          </div>
        </article>
      </main>
    </div>
  );
}
