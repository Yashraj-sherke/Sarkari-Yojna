import Link from 'next/link';
import type { Scheme } from '@/lib/domain';
import { isIndexableScheme } from '@/lib/seo';

/** Visible HTML links keep reviewed articles discoverable beyond interactive pagination. */
export function SchemeIndex({ schemes }: { schemes: Scheme[] }) {
  const reviewed = schemes.filter(isIndexableScheme);
  if (!reviewed.length) return null;
  return (
    <div className="scheme-index-wrapper">
      <nav className="page-wrap scheme-index-nav" aria-label="समीक्षित योजनाओं की सूची">
        <h2 className="index-heading">समीक्षित योजनाएं — पूरी सूची</h2>
        <ul className="index-grid">
          {reviewed.map(s => (
            <li key={s.slug}>
              <Link className="index-link" href={`/yojna/${s.slug}`}>
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
