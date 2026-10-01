import { summarizeScheme } from '@/lib/scheme-summary';
import { allSchemes } from '@/lib/server';
import { Directory } from '@/components/directory';
import { DEFAULT_OG_IMAGE, SITE_NAME_EN, SITE_URL } from '@/lib/config';
import Link from 'next/link';
import { isIndexableScheme } from '@/lib/seo';
import { categories } from '@/lib/domain';
import { guides } from '@/lib/guides';

const title = 'Sarkari Yojana 2026 List — ऑनलाइन आवेदन और पात्रता';
const description = 'Sarkari Yojana 2026 की समीक्षा की गई सूची देखें। पात्रता, दस्तावेज़, लाभ, सरकारी पोर्टल और ऑनलाइन आवेदन की प्रक्रिया सरल हिन्दी में समझें।';
export async function generateMetadata({searchParams}: {searchParams: Promise<{page?: string}>}) {
  const page = Math.max(1, Number.parseInt((await searchParams).page ?? '1', 10) || 1);
  const canonical = page === 1 ? '/yojna' : `/yojna?page=${page}`;
  const pageTitle = page === 1 ? title : `${title} — पेज ${page}`;
  return {
    title: {absolute: pageTitle}, description,
    alternates: {canonical},
    openGraph: {title: pageTitle, description, url: `${SITE_URL}${canonical}`, siteName: SITE_NAME_EN, type: 'website', locale: 'hi_IN', images: [{url: DEFAULT_OG_IMAGE, alt: 'Sarkari Yojana लोगो'}]},
    twitter: {card: 'summary', title: pageTitle, description, images: [DEFAULT_OG_IMAGE]},
  };
}

export const revalidate = 3600;

export default async function YojnaDirectory({searchParams}: {searchParams: Promise<{page?: string}>}) {
  const page = Math.max(1, Number.parseInt((await searchParams).page ?? '1', 10) || 1);
  const schemes = await allSchemes();
  const reviewed = schemes.filter(isIndexableScheme);
  const topics = categories.filter(category => reviewed.some(scheme => scheme.category === category.id));
  return (
    <>
      <Directory schemes={schemes.map(summarizeScheme)} initialCategory="all" initialState="all" initialPage={page} paginationBasePath="/yojna" isHomePage={false} />
      <section className="page-wrap panel" aria-labelledby="reviewed-directory">
        <h2 id="reviewed-directory">सरकारी योजना सूची 2026</h2>
        <p>
          इस सूची में केंद्र और राज्य की योजनाओं के लाभ, पात्रता, दस्तावेज़ और आवेदन प्रक्रिया दी गई है।
          जिन लेखों की आधिकारिक स्रोतों से संपादकीय समीक्षा पूरी है, वे Google के लिए उपलब्ध हैं।
          ऑनलाइन आवेदन से पहले संबंधित सरकारी योजना पोर्टल पर वर्तमान तारीख और नियम जाँचें।
        </p>
        <nav aria-labelledby="reviewed-schemes-index">
          <h2 id="reviewed-schemes-index">समीक्षित योजनाओं की सूची</h2>
          <ul>
            {reviewed.map(scheme => (
              <li key={scheme.slug}><Link href={`/yojna/${scheme.slug}`}>{scheme.title}</Link></li>
            ))}
          </ul>
        </nav>
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
