import { summarizeScheme } from '@/lib/scheme-summary';
import { allSchemes } from '@/lib/server';
import { Directory } from '@/components/directory';
import { DEFAULT_OG_IMAGE, SITE_NAME_EN, SITE_URL } from '@/lib/config';
import Link from 'next/link';
import { isIndexableScheme } from '@/lib/seo';
import { categories } from '@/lib/domain';
import { guides } from '@/lib/guides';

const title = 'सत्यापित सरकारी योजनाएं — Sarkari Yojana';
const description = 'Sarkari Yojana पर सभी सत्यापित सरकारी योजनाओं की सूची देखें।';
export const metadata = {
  title: {absolute: title}, description,
  alternates: {canonical: '/yojna'},
  openGraph: {title, description, url: `${SITE_URL}/yojna`, siteName: SITE_NAME_EN, type: 'website', locale: 'hi_IN', images: [{url: DEFAULT_OG_IMAGE, alt: 'Sarkari Yojana लोगो'}]},
  twitter: {card: 'summary', title, description, images: [DEFAULT_OG_IMAGE]},
};

export const revalidate = 3600;

export default async function YojnaDirectory() {
  const schemes = await allSchemes();
  const reviewed = schemes.filter(isIndexableScheme);
  const topics = categories.filter(category => reviewed.some(scheme => scheme.category === category.id));
  return (
    <>
      <Directory schemes={schemes.map(summarizeScheme)} initialCategory="all" initialState="all" isHomePage={false} />
      <section className="page-wrap panel" aria-labelledby="reviewed-directory">

        {topics.length > 0 && <nav aria-labelledby="directory-topics">
          <h2 id="directory-topics">विषय के अनुसार योजनाएं</h2>
          <ul>{topics.map(category => <li key={category.id}><Link href={`/category/${category.id}`}>{category.name}</Link></li>)}</ul>
        </nav>}
        <nav aria-labelledby="directory-guides">
          <h2 id="directory-guides">आवेदन से पहले तैयारी करें</h2>
          <ul>{guides.map(guide => <li key={guide.slug}><Link href={`/guide/${guide.slug}`}>{guide.title}</Link></li>)}</ul>
        </nav>
      </section>
    </>
  );
}
