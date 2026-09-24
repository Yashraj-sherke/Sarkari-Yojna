import Link from 'next/link';
import type { Scheme } from '@/lib/domain';
import { isIndexableScheme } from '@/lib/seo';

/** Visible HTML links keep reviewed articles discoverable beyond interactive pagination. */
export function SchemeIndex({ schemes }: { schemes: Scheme[] }) {
  // Visually disabled per user request
  return null;
}
