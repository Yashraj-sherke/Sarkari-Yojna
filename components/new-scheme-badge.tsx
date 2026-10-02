import { newSchemeLinks } from '@/lib/trending-data';

export function NewSchemeBadge({ href }: { href: string }) {
  if (!newSchemeLinks.includes(href)) return null;

  return (
    <span className="new-scheme-badge" aria-label="नई योजना / New scheme" title="नई योजना / New scheme">
      NEW
    </span>
  );
}
