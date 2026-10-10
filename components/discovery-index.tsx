import Link from 'next/link';
import type { Scheme } from '@/lib/domain';
import { categories } from '@/lib/domain';
import { isIndexableScheme } from '@/lib/seo';
import { stateNames } from '@/lib/state-names';

type DiscoveryLink = { id: string; label: string; count: number };

export function DiscoveryIndex({
  schemes,
}: {
  schemes: Scheme[];
}) {
  const reviewedSchemes = schemes.filter(isIndexableScheme);
  const categoryLinks: DiscoveryLink[] = categories.map(category => ({
    id: category.id,
    label: category.name,
    count: reviewedSchemes.filter(scheme => scheme.category === category.id).length,
  })).filter(item => item.count > 0);
  const stateLinks: DiscoveryLink[] = Object.entries(stateNames).map(([id, label]) => ({
    id,
    label,
    count: reviewedSchemes.filter(scheme => scheme.state === id).length,
  })).filter(item => item.count > 0);

  if (categoryLinks.length === 0 && stateLinks.length === 0) return null;

  return (
    <section className="discovery-index page-wrap" aria-labelledby="discovery-index-title">
      <div className="discovery-index-heading">
        <p className="eyebrow">योजनाओं की खोज</p>
        <h2 id="discovery-index-title">श्रेणी और राज्य के अनुसार योजनाएं</h2>
        <p>समीक्षित योजनाओं को विषय या राज्य के आधार पर जल्दी खोजें।</p>
      </div>
      <div className="discovery-index-columns">
        {categoryLinks.length > 0 && (
          <nav aria-labelledby="discovery-categories-title">
            <h3 id="discovery-categories-title">श्रेणियां</h3>
            <ul>
              {categoryLinks.map((item) => (
                <li key={item.id}>
                  <Link href={`/category/${item.id}`} title={item.label}>
                    <span>{item.label}</span>
                    <span>{item.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {stateLinks.length > 0 && (
          <nav aria-labelledby="discovery-states-title">
            <h3 id="discovery-states-title">राज्य और केंद्र</h3>
            <ul>
              {stateLinks.map((item) => (
                <li key={item.id}>
                  <Link href={`/state/${item.id}`} title={item.label}>
                    <span>{item.label}</span>
                    <span>{item.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}