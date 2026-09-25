import { summarizeScheme } from '@/lib/scheme-summary';
import { allSchemes } from '@/lib/server';
import { Directory } from '@/components/directory';
import { DEFAULT_OG_IMAGE, SITE_NAME_EN, SITE_ALTERNATE_NAMES, SITE_URL } from '@/lib/config';
import { SchemeIndex } from '@/components/scheme-index';
import { isIndexableScheme } from '@/lib/seo';

const title = 'Sarkari Yojana — सरकारी योजनाओं के लाभ, पात्रता और आवेदन';
const description = 'Sarkari Yojana पर केंद्र और मध्य प्रदेश की योजनाएं खोजें। लाभ, पात्रता, दस्तावेज़ और आवेदन प्रक्रिया सरल हिन्दी में समझें और आधिकारिक स्रोत देखें। स्वतंत्र सूचना मंच।';
export const metadata = {
  title: {absolute: title}, description,
  alternates: {canonical: '/'},
  openGraph: {title, description, url: SITE_URL, siteName: SITE_NAME_EN, type: 'website', locale: 'hi_IN', images: [{url: DEFAULT_OG_IMAGE, alt: 'Sarkari Yojana लोगो'}]},
  twitter: {card: 'summary', title, description, images: [DEFAULT_OG_IMAGE]},
};

export const revalidate = 3600;

export default async function Home() {
  const schemes = await allSchemes();
  const reviewedSchemes = schemes.filter(isIndexableScheme);
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
    logo:`${SITE_URL}/icon-192.png`
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
      <Directory schemes={schemes.map(summarizeScheme)} initialState="central" isHomePage={true} />
      <SchemeIndex schemes={schemes} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteSchema).replace(/</g,'\\u003c')}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organizationSchema).replace(/</g,'\\u003c')}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(collectionSchema).replace(/</g,'\\u003c')}}/>
    </>
  );
}
