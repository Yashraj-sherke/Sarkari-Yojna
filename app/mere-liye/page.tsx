import { Eligibility } from '@/components/eligibility';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'मेरे लिए योजनाएं',
  alternates: { canonical: '/mere-liye' },
  robots: { index: true, follow: true },
};

export default function MereLiyePage() {
  return <Eligibility />;
}
