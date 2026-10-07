import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSamachar, getSamacharRelatedSchemeSlugs, samacharQuality } from '@/lib/samachar';
import { allSchemes } from '@/lib/server';
import { isIndexableScheme } from '@/lib/seo';
import { AdSensePlaceholder } from '@/components/ads';
import { SITE_URL } from '@/lib/config';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const s = await getSamachar(slug);
  if (!s) return { title: 'समाचार नहीं मिला' };
  const quality = samacharQuality(s);
  const title = s.title.length > 52 ? `${s.title.slice(0, 51).trim()}…` : s.title;
  
  return {
    title,
    description: s.summary,
    alternates: { canonical: `/samachar/${slug}` },
    robots: { index: true, follow: true },
    openGraph: { title: s.title, description: s.summary, url: `/samachar/${slug}`, type: 'article', locale: 'hi_IN' }
  };
}

export default async function SamacharDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const s = await getSamachar(slug);
  
  if (!s) return notFound();
  const relatedSlugs = getSamacharRelatedSchemeSlugs(s);
  const relatedSchemes = (await allSchemes()).filter(scheme => relatedSlugs.includes(scheme.slug) && isIndexableScheme(scheme));
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type':'ListItem', position:1, name:'होम', item:`${SITE_URL}/`},
      {'@type':'ListItem', position:2, name:'समाचार', item:`${SITE_URL}/samachar`},
      {'@type':'ListItem', position:3, name:s.title, item:`${SITE_URL}/samachar/${s.slug}`},
    ],
  };

  return (
    <div className="workspace">
      <main id="main" className="directory samachar-main">
        <div className="breadcrumb" style={{marginBottom: '20px'}}>
          <Link href="/">होम</Link> <span>/</span> <Link href="/samachar">समाचार</Link> <span>/</span> {s.title}
        </div>
        
        <article className="samachar-detail-article">
          <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px'}}>
            <span style={{background: '#edf2f7', color: '#4a5568', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600}}>
              {s.category}
            </span>
            <time style={{color: '#718096', fontSize: '0.85rem'}}>
              {new Date(s.date).toLocaleDateString('hi-IN')}
            </time>
          </div>
          
          <h1 className="samachar-detail-title">
            {s.title}
          </h1>

          <div style={{marginBottom: '30px', color: '#4a5568', fontWeight: 500}}>
            लेखा: {s.author}
          </div>

          {s.imageUrl && (
            <div className="samachar-cover">
              <Image src={s.imageUrl} alt={s.title} fill style={{objectFit: 'cover'}} />
            </div>
          )}

          {(s.changes || s.affected || s.sourceUrl) && (
            <div className="samachar-update-box" style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '30px', marginTop: '20px'}}>
              <h2 style={{fontSize: '1.25rem', marginTop: 0, marginBottom: '15px', color: '#1e293b'}}>अपडेट का सारांश</h2>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {s.changes && <li><strong style={{color: '#334155'}}>क्या बदला:</strong> <span style={{color: '#475569'}}>{s.changes}</span></li>}
                {s.affected && <li><strong style={{color: '#334155'}}>किस पर प्रभाव:</strong> <span style={{color: '#475569'}}>{s.affected}</span></li>}
                {s.sourceUrl && <li><strong style={{color: '#334155'}}>आधिकारिक स्रोत:</strong> <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" style={{color: '#2563eb', textDecoration: 'underline'}}>लिंक देखें ↗</a></li>}
              </ul>
            </div>
          )}


          <div style={{marginTop: 20, marginBottom: 40}}>
            <AdSensePlaceholder client="ca-pub-xxxxxxxx" slot="xxxxxxxxx" />
          </div>
          
          <div className="article-body samachar-body" style={{fontSize: '1.1rem', color: '#2d3748', lineHeight: 1.7}}>
            {s.body.map((p, idx) => {
              const isBlock = /^<(h[1-6]|ul|ol|div|blockquote)/i.test(p.trim());
              return isBlock ? (
                <div key={idx} dangerouslySetInnerHTML={{ __html: p }} style={{marginBottom: '1.5em'}} className="samachar-block" />
              ) : (
                <p key={idx} dangerouslySetInnerHTML={{ __html: p }} style={{marginBottom: '1.5em'}} />
              );
            })}
          </div>

          <div style={{marginTop: 40}}>
            <AdSensePlaceholder client="ca-pub-xxxxxxxx" slot="xxxxxxxxx" />
          </div>

          {relatedSchemes.length > 0 && <section className="scheme-cluster-links" aria-labelledby="update-schemes-heading">
            <h2 id="update-schemes-heading">इस अपडेट से जुड़ी योजनाएं</h2>
            <ul>
              {relatedSchemes.map(scheme => <li key={scheme.slug}><Link href={`/yojna/${scheme.slug}`}>{scheme.title}</Link></li>)}
            </ul>
          </section>}
        </article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb).replace(/</g,'\\u003c')}} />
      </main>
    </div>
  );
}
