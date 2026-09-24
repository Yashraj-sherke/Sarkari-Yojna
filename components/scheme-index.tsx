import Link from 'next/link';
import type { Scheme } from '@/lib/domain';
import { isIndexableScheme } from '@/lib/seo';

/** Visible HTML links keep reviewed articles discoverable beyond interactive pagination. */
export function SchemeIndex({ schemes }: { schemes: Scheme[] }) {
  const reviewed = schemes.filter(isIndexableScheme);
  if (!reviewed.length) return null;
  return <nav className="page-wrap" aria-label="समीक्षित योजनाओं की सूची">
    <h2>समीक्षित योजनाएं — पूरी सूची</h2>
    <ul className="flat-list">{reviewed.map(s => <li key={s.slug}>
      <Link className="inline-link" href={`/yojna/${s.slug}`}>{s.title}</Link>
    </li>)}</ul>
  </nav>;
}
