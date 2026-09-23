import {InformationPage} from '@/components/information-page';
import {informationMetadata} from '@/lib/information-pages';

export const metadata = informationMetadata('disclaimer');
export default function Page() { return <InformationPage page="disclaimer"/>; }
