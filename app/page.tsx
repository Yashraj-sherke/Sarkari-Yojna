import { summarizeScheme } from '@/lib/scheme-summary';
import { allSchemes } from '@/lib/server';
import { getAllSamachar } from '@/lib/samachar';
import { Directory } from '@/components/directory';
import { DEFAULT_OG_IMAGE, SITE_NAME_EN, SITE_ALTERNATE_NAMES, SITE_URL, SOCIAL_X_URL, SOCIAL_INSTAGRAM_URL, SOCIAL_FACEBOOK_URL, SOCIAL_YOUTUBE_URL } from '@/lib/config';
import { isIndexableScheme } from '@/lib/seo';
import Link from 'next/link';
import { DiscoveryIndex } from '@/components/discovery-index';

const title = 'Sarkari Yojana 2026: सभी सरकारी योजनाओं की सूची';
const description = 'Sarkari Yojana 2026 की सत्यापित सूची, लाभ, पात्रता, आवश्यक दस्तावेज़, और ऑनलाइन आवेदन की पूरी आधिकारिक जानकारी आसान हिन्दी में यहाँ प्राप्त करें।';
export const metadata = {
  title: {absolute: title}, description,
  alternates: {canonical: '/'},
  openGraph: {title, description, url: SITE_URL, siteName: SITE_NAME_EN, type: 'website', locale: 'hi_IN', images: [{url: DEFAULT_OG_IMAGE, alt: 'Sarkari Yojana लोगो'}]},
  twitter: {card: 'summary', title, description, images: [DEFAULT_OG_IMAGE]},
};

export const revalidate = 3600;

export default async function Home() {
  const schemes = await allSchemes();
  const news = await getAllSamachar();
  const latestNews = news.slice(0, 3).map(({ body, ...rest }) => rest);
  const reviewedSchemes = schemes.filter(isIndexableScheme);
  const centralSchemes = schemes.filter(s => s.state === 'central' && isIndexableScheme(s)).slice(0, 9);
  const websiteSchema={
    '@context':'https://schema.org',
    '@type':'WebSite',
    '@id':`${SITE_URL}/#website`,
    inLanguage:'hi-IN',
    publisher:{'@id':`${SITE_URL}/#organization`},
    name:SITE_NAME_EN,
    alternateName:SITE_ALTERNATE_NAMES,
    url:`${SITE_URL}/`,
  };

  const organizationSchema={
    '@context':'https://schema.org',
    '@type':'Organization',
    '@id':`${SITE_URL}/#organization`,
    description:'Sarkari Yojana is an independent citizen-information platform for discovering and understanding Indian Central and State Government schemes.',
    name:SITE_NAME_EN,
    alternateName:SITE_ALTERNATE_NAMES,
    url:`${SITE_URL}/`,
    logo:`${SITE_URL}/icon-192.png`,
    sameAs: [SOCIAL_X_URL, SOCIAL_INSTAGRAM_URL, SOCIAL_FACEBOOK_URL, SOCIAL_YOUTUBE_URL].filter(Boolean)
  };

  const collectionSchema={
    '@context':'https://schema.org',
    '@type':'CollectionPage',
    '@id':`${SITE_URL}/#schemes`,
    name:title,
    description,
    inLanguage:'hi-IN',
    isPartOf:{'@id':`${SITE_URL}/#website`},
    mainEntity:{
      '@type':'ItemList',
      numberOfItems:reviewedSchemes.length,
      itemListElement:reviewedSchemes.map((scheme,index)=>({
        '@type':'ListItem',
        position:index+1,
        name:scheme.title,
        url:`${SITE_URL}/yojna/${scheme.slug}`,
      })),
    },
  };

  return (
    <>
      <Directory schemes={schemes.map(summarizeScheme)} centralSchemes={centralSchemes.map(summarizeScheme)} latestNews={latestNews} initialState="all" isHomePage={true} />
      <DiscoveryIndex schemes={schemes} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteSchema).replace(/</g,'\\u003c')}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organizationSchema).replace(/</g,'\\u003c')}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(collectionSchema).replace(/</g,'\\u003c')}}/>
    </>
  );
}
