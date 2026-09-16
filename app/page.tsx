import { allSchemes } from '@/lib/server';
import { Directory } from '@/components/directory';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return <Directory schemes={await allSchemes()} initialState="central" isHomePage={true} />;
}
