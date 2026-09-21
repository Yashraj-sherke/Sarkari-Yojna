import { allSchemes } from '@/lib/server';
import { Directory } from '@/components/directory';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const breadcrumbSchema={
    '@context':'https://schema.org',
    '@type':'BreadcrumbList',
    itemListElement:[
      {'@type':'ListItem',position:1,name:'होम',item:'https://sarkariyojnasetu.com/'},
    ]
  };

  const websiteSchema={
    '@context':'https://schema.org',
    '@type':'WebSite',
    url:'https://sarkariyojnasetu.com/',
    potentialAction:{
      '@type':'SearchAction',
      target:'https://sarkariyojnasetu.com/?q={search_term_string}',
      'query-input':'required name=search_term_string'
    }
  };


  return (
    <>
      <Directory schemes={await allSchemes()} initialState="central" isHomePage={true} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,'\\u003c')}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteSchema).replace(/</g,'\\u003c')}}/>
    </>
  );
}
