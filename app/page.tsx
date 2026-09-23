import { summarizeScheme } from '@/lib/scheme-summary';
import { allSchemes } from '@/lib/server';
import { Directory } from '@/components/directory';
import { SITE_NAME_HI, SITE_URL } from '@/lib/config';

export const revalidate = 3600;

export default async function Home() {
  const breadcrumbSchema={
    '@context':'https://schema.org',
    '@type':'BreadcrumbList',
    itemListElement:[
      {'@type':'ListItem',position:1,name:'होम',item:`${SITE_URL}/`},
    ]
  };

  const websiteSchema={
    '@context':'https://schema.org',
    '@type':'WebSite',
    name:SITE_NAME_HI,
    url:`${SITE_URL}/`
  };


  return (
    <>
      <Directory schemes={(await allSchemes()).map(summarizeScheme)} initialState="central" isHomePage={true} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,'\\u003c')}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteSchema).replace(/</g,'\\u003c')}}/>
    </>
  );
}
