import Link from 'next/link';
import type { Scheme } from '@/lib/domain';
import { categories } from '@/lib/domain';
import { isIndexableScheme } from '@/lib/seo';

export function StateOpportunity({ stateName, schemes }: { stateName: string; schemes: Scheme[] }) {
  const reviewed = schemes.filter(isIndexableScheme);
  if (!reviewed.length) return null;

  const categoryLinks = categories.map(category => ({
    ...category,
    count: reviewed.filter(scheme => scheme.category === category.id).length,
  })).filter(category => category.count > 0);
  const recent = [...reviewed]
    .sort((a, b) => (b.lastUpdated ?? b.editorial?.reviewedAt ?? '').localeCompare(a.lastUpdated ?? a.editorial?.reviewedAt ?? ''))
    .slice(0, 5);

  return (
    <section className="page-wrap panel state-opportunity" aria-labelledby="state-opportunity-title">
      <h2 id="state-opportunity-title">{stateName} की सरकारी योजनाएं</h2>
      <p>{stateName} से जुड़ी उपलब्ध योजनाओं को विषय के आधार पर देखें। अंतिम पात्रता और आवेदन नियम संबंधित विभाग के आधिकारिक स्रोत से मिलाएं।</p>
      <div className="state-opportunity-grid">
        <div>
          <h2>श्रेणी के अनुसार</h2>
          <ul className="flat-list">
            {categoryLinks.map(category => <li key={category.id}><Link className="inline-link" href={`/category/${category.id}`}>{category.name} ({category.count})</Link></li>)}
          </ul>
        </div>
        <div>
          <h2>हाल में संपादित लेख</h2>
          <ul className="flat-list">
            {recent.map(scheme => <li key={scheme.slug}><Link className="inline-link" href={`/yojna/${scheme.slug}`}>{scheme.title}</Link></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
