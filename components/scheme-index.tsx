import Link from 'next/link';
import type { Scheme } from '@/lib/domain';
import { isIndexableScheme } from '@/lib/seo';

/** Visible HTML links keep reviewed articles discoverable beyond interactive pagination. */
export function SchemeIndex({ schemes }: { schemes: Scheme[] }) {
  const reviewed = schemes.filter(isIndexableScheme);
  if (!reviewed.length) return null;

  return <section className="page-wrap panel" aria-labelledby="collection-articles">
    <h2 id="collection-articles">इस सूची के समीक्षित योजना लेख</h2>
    <p>पात्रता, दस्तावेज़ और सरकारी स्रोत पढ़ने के लिए योजना चुनें।</p>
    <ul className="flat-list">
      {reviewed.map(scheme => <li key={scheme.slug}>
        <Link className="inline-link" href={`/yojna/${scheme.slug}`}>{scheme.title}</Link>
      </li>)}
    </ul>
    <p><Link className="inline-link" href="/yojna">सभी समीक्षित सरकारी योजना लेख देखें</Link></p>
  </section>;
}
