import { summarizeScheme } from '@/lib/scheme-summary';
import {notFound} from 'next/navigation';
import {allSchemes} from '@/lib/server';
import {Directory} from '@/components/directory';
import { SchemeIndex } from '@/components/scheme-index';
import { isIndexableScheme } from '@/lib/seo';
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/config';

export const revalidate = 3600;

import {stateNames} from '@/lib/state-names';

export async function generateMetadata({params}:{params:Promise<{id:string}>}){
  const id = (await params).id;
  const stateName = stateNames[id];
  if (!stateName) notFound();

  const schemes = await allSchemes();
  const indexable = schemes.some(s => s.state === id && isIndexableScheme(s));

  return {
    title: `${stateName} की सरकारी योजनाएं`,
    description: `${stateName} की योजनाओं के लाभ, पात्रता, दस्तावेज़, आवेदन प्रक्रिया और आधिकारिक स्रोत देखें।`,
    alternates: { canonical: `/state/${id}` },
    robots: { index: indexable, follow: true },
    openGraph: {
      title: `${stateName} की सरकारी योजनाएं`,
      description: `${stateName} की योजनाओं की सरल हिन्दी जानकारी।`,
      url: `/state/${id}`,
      type: 'website' as const,
      locale: 'hi_IN',
      images: [DEFAULT_OG_IMAGE]
    }
  };
}

export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{page?:string}>}){
  const {id}=await params;
  const page = Math.max(1, Number.parseInt((await searchParams).page ?? '1', 10) || 1);
  const stateName = stateNames[id];
  if (!stateName) notFound();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'होम', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: `${stateName} की योजनाएं`, item: `${SITE_URL}/state/${id}` },
    ]
  };

  const schemes = await allSchemes();
  const reviewedSchemes = schemes.filter(s => s.state === id && isIndexableScheme(s));
  const centralSchemes = schemes.filter(s => s.state === 'central' && isIndexableScheme(s)).slice(0, 9);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/state/${id}#collection`,
    name: `${stateName} की सरकारी योजनाएं`,
    inLanguage: 'hi-IN',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: reviewedSchemes.length,
      itemListElement: reviewedSchemes.map((scheme, index) => ({
        '@type': 'ListItem', position: index + 1, name: scheme.title, url: `${SITE_URL}/yojna/${scheme.slug}`
      })),
    },
  };

  return (
    <>
      <Directory
        schemes={schemes.map(summarizeScheme)}
        centralSchemes={id !== 'central' ? centralSchemes.map(summarizeScheme) : undefined}
        initialState={id}
        initialPage={page}
        paginationBasePath={`/state/${id}`}
      />
      <SchemeIndex schemes={schemes.filter(s => s.state === id)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,'\\u003c')}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(collectionSchema).replace(/</g,'\\u003c')}}/>
    </>
  );
}
