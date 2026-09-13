import { Family } from '@/components/eligibility';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'परिवार के लिए योजनाएं',
  alternates: { canonical: '/family' },
};

export default function FamilyPage() {
  return <Family />;
}
