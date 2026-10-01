import {notFound, permanentRedirect} from 'next/navigation';
import {getScheme} from '@/lib/server';
import {isIndexableScheme} from '@/lib/seo';

// These legacy pages duplicated the main article and had no independently reviewed guide.
const sections: Record<string, string> = {
  apply: 'aavedan', status: 'stithi', 'beneficiary-list': 'sandarbh',
  list: 'sandarbh', 'e-kyc': 'sandarbh',
};
export default async function Page({params}: {params: Promise<{slug: string; subIntent: string}>}) {
  const {slug, subIntent} = await params;
  if (!Object.hasOwn(sections, subIntent)) notFound();
  const scheme = await getScheme(slug);
  if (!scheme || !isIndexableScheme(scheme)) notFound();
  const section = subIntent === 'status' && !scheme.trackingGuidance ? 'sandarbh' : sections[subIntent];
  permanentRedirect(`/yojna/${scheme.slug}#${section}`);
}
