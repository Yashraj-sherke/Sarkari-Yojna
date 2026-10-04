/**
 * Phase 28: URL Strategy Enforcer
 * 
 * Rules:
 * - Stable, readable URLs.
 * - No unnecessary year duplication (e.g., remove "2024", "2025" from slugs).
 * - No random query strings or parameters in base URLs.
 * - Enforce lowercase, hyphenated formatting.
 */

export function sanitizeSlug(input: string): string {
  if (!input) return '';

  let slug = input.toLowerCase();

  // 1. Remove financial years and standalone years (e.g. 2024, 2024-25, 2025)
  slug = slug.replace(/\b20\d{2}(?:-20\d{2}|-\d{2})?\b/g, '');

  // 2. Remove common unnecessary words/suffixes that bloat the URL
  const stopWords = ['yojana', 'scheme', 'in', 'hindi', 'apply', 'online', 'registration'];
  
  // 3. Replace non-alphanumeric characters (including spaces) with hyphens
  slug = slug.replace(/[^a-z0-9]+/g, '-');

  // 4. Remove stop words from the slug (only if they are standalone parts)
  const parts = slug.split('-').filter(Boolean);
  const cleanParts = parts.filter(part => !stopWords.includes(part));

  // If removing stop words made it empty (e.g. they typed "Yojana Scheme"), revert to original words
  if (cleanParts.length === 0) {
    slug = parts.join('-');
  } else {
    slug = cleanParts.join('-');
  }

  // 5. Trim hyphens from ends
  slug = slug.replace(/^-+|-+$/g, '');

  return slug;
}

/**
 * Checks if an existing slug violates Phase 28 rules.
 */
export function validateUrlStrategy(slug: string): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  if (/\b20\d{2}\b/.test(slug)) {
    warnings.push('Slug contains a year (violates stable URL principle).');
  }

  if (/[A-Z]/.test(slug)) {
    warnings.push('Slug contains uppercase letters (should be entirely lowercase).');
  }

  if (/[^a-z0-9-]/.test(slug)) {
    warnings.push('Slug contains invalid characters (only lowercase letters, numbers, and hyphens allowed).');
  }

  if (slug.includes('--')) {
    warnings.push('Slug contains consecutive hyphens.');
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
}
