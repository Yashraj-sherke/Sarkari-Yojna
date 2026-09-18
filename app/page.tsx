import { allSchemes } from '@/lib/server';
import { Directory } from '@/components/directory';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const breadcrumbSchema={
    '@context':'https://schema.org',
    '@type':'BreadcrumbList',
    itemListElement:[
      {'@type':'ListItem',position:1,name:'होम',item:'https://sarkari-yojna-navigator.ombhayde.chatgpt.site/'},
    ]
  };

  return (
    <>
      <Directory schemes={await allSchemes()} initialState="central" isHomePage={true} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,'\\u003c')}}/>
    </>
  );
}
