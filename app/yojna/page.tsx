import { summarizeScheme } from '@/lib/scheme-summary';
import { allSchemes } from '@/lib/server';
import { Directory } from '@/components/directory';
import { DEFAULT_OG_IMAGE, SITE_NAME_EN, SITE_URL } from '@/lib/config';

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
  return (
    <>
      <Directory schemes={schemes.map(summarizeScheme)} initialCategory="all" initialState="all" isHomePage={false} />
    </>
  );
}
