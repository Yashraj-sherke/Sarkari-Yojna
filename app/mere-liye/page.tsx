import { Eligibility } from '@/components/eligibility';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'मेरे लिए योजनाएं',
  alternates: { canonical: '/mere-liye' },
};

export default function MereLiyePage() {
  return <Eligibility />;
}
