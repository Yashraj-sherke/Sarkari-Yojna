import Link from 'next/link';
import type { SchemeNavigationItem } from '@/lib/scheme-navigation';

type RelatedScheme = { slug: string; title: string; english: string };
type RelatedGuide = { slug: string; title: string };
type RelatedUpdate = { slug: string; title: string };

export function SchemeClusterLinks({
  navigation,
  relatedSchemes,
  relatedGuides,
  relatedUpdates,
  pageLang,
}: {
  navigation: SchemeNavigationItem[];
  relatedSchemes: RelatedScheme[];
  relatedGuides: RelatedGuide[];
  relatedUpdates: RelatedUpdate[];
  pageLang: 'hi' | 'en';
}) {
  if (!navigation.length && !relatedSchemes.length && !relatedGuides.length && !relatedUpdates.length) return null;

  return (
    <section className="scheme-cluster-links" aria-labelledby="scheme-cluster-heading">
      <h2 id="scheme-cluster-heading">{pageLang === 'en' ? 'Explore this scheme' : 'इस योजना से जुड़े रास्ते'}</h2>
      {navigation.length > 0 && (
        <nav aria-label={pageLang === 'en' ? 'Scheme sections' : 'योजना के अनुभाग'}>
          <ul>
            {navigation.map(item => <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>)}
          </ul>
        </nav>
      )}
      {relatedSchemes.length > 0 && (
        <div>
          <h3>{pageLang === 'en' ? 'Related schemes' : 'संबंधित योजनाएं'}</h3>
          <ul>
            {relatedSchemes.map(scheme => <li key={scheme.slug}><Link href={`/yojna/${scheme.slug}`}>{pageLang === 'en' ? scheme.english : scheme.title}</Link></li>)}
          </ul>
        </div>
      )}
      {relatedGuides.length > 0 && (
        <div>
          <h3>{pageLang === 'en' ? 'Application guides' : 'आवेदन से जुड़े गाइड'}</h3>
          <ul>
            {relatedGuides.map(guide => <li key={guide.slug}><Link href={`/guide/${guide.slug}`}>{guide.title}</Link></li>)}
          </ul>
        </div>
      )}
      {relatedUpdates.length > 0 && (
        <div>
          <h3>{pageLang === 'en' ? 'Latest related updates' : 'इस योजना से जुड़े नवीनतम अपडेट'}</h3>
          <ul>
            {relatedUpdates.map(update => <li key={update.slug}><Link href={`/samachar/${update.slug}`}>{update.title}</Link></li>)}
          </ul>
        </div>
      )}
    </section>
  );
}