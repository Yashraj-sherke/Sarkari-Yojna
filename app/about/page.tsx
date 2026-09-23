import {InformationPage} from '@/components/information-page';
import {informationMetadata} from '@/lib/information-pages';

export const metadata = informationMetadata('about');
export default function Page() { return <InformationPage page="about"/>; }
