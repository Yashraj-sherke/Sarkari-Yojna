import Link from 'next/link';
import { getAllSamachar } from '@/lib/samachar';
import { Sidebar } from '@/components/site';
import { AdSensePlaceholder } from '@/components/ads';

export const metadata = {
  title: 'समाचार (News)',
  description: 'सरकारी योजनाओं से जुड़ी ताज़ा ख़बरें और अपडेट्स।',
};

export default async function SamacharIndex() {
  const news = await getAllSamachar();

  return (
    <div className="workspace">
      <Sidebar />
      <main id="main" className="directory" style={{padding: '2rem'}}>
        <div className="breadcrumb" style={{marginBottom: '20px'}}>
          <Link href="/">होम</Link> <span>/</span> समाचार
        </div>
        
        <h1 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#111'}}>ताज़ा समाचार</h1>
        <p style={{color: '#4a5568', marginBottom: '2rem'}}>सरकारी योजनाओं और नीतियों से जुड़ी नवीनतम जानकारी और अपडेट्स।</p>
        
        <div style={{marginTop: 20, marginBottom: 40}}>
          <AdSensePlaceholder client="ca-pub-xxxxxxxx" slot="xxxxxxxxx" />
        </div>

        <div style={{display: 'grid', gap: '20px'}}>
          {news.map(item => (
            <article key={item.slug} style={{border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', background: 'white'}}>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px'}}>
                <span style={{background: '#edf2f7', color: '#4a5568', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600}}>
                  {item.category}
                </span>
                <time style={{color: '#718096', fontSize: '0.85rem'}}>
                  {new Date(item.date).toLocaleDateString('hi-IN')}
                </time>
              </div>
              <h2 style={{fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px'}}>
                <Link href={`/samachar/${item.slug}`} style={{color: '#2b6cb0', textDecoration: 'none'}}>
                  {item.title}
                </Link>
              </h2>
              <p style={{color: '#4a5568', marginBottom: '15px'}}>{item.summary}</p>
              <Link href={`/samachar/${item.slug}`} style={{fontWeight: 600, color: '#3182ce'}}>
                पूरा पढ़ें →
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
