import { Scheme, searchSchemes } from './domain';
import { allSchemes } from './server';
import Fuse from 'fuse.js';
import { validateUrlStrategy } from './url-strategy';

export interface QualityGateResult {
  passed: boolean;
  score: number;
  warnings: string[];
  errors: string[];
}

/**
 * Phase 27: Duplicate Intent Control
 * Checks if a proposed new scheme title or summary is too similar to existing content.
 */
export async function checkDuplicateIntent(proposedTitle: string, proposedCategory: string, currentSlug?: string): Promise<{
  isDuplicate: boolean;
  similarSchemes: Array<{slug: string; title: string; score: number}>;
}> {
  const schemes = await allSchemes();
  const existing = schemes.filter(s => s.slug !== currentSlug && s.status !== 'CLOSED' && s.status !== 'ARCHIVED');
  
  const fuse = new Fuse(existing, {
    keys: ['title', 'english', 'summary'],
    includeScore: true,
    threshold: 0.4
  });

  const results = fuse.search(proposedTitle);
  // Consider it a strong duplicate risk if score is very low (meaning high similarity) and same category
  const duplicates = results
    .filter(r => (r.score ?? 1) < 0.3 || (r.item.category === proposedCategory && (r.score ?? 1) < 0.4))
    .map(r => ({ slug: r.item.slug, title: r.item.title, score: r.score ?? 1 }));

  return {
    isDuplicate: duplicates.length > 0,
    similarSchemes: duplicates.slice(0, 3)
  };
}

/**
 * Phase 29: Content Quality Gate
 * Evaluates a scheme against the quality standards defined in Phase 29.
 */
export async function runContentQualityGate(scheme: Scheme): Promise<QualityGateResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // 1. Official source available
  if (!scheme.sourceUrl) {
    errors.push('Missing official source URL.');
    score -= 20;
  }

  // 2. Complete enough
  if (!scheme.benefit || scheme.benefit.length < 50) {
    warnings.push('Benefit description is too short. Ensure primary intent is directly answered.');
    score -= 10;
  }
  
  if (!scheme.eligibilityDescription && (!scheme.rules || scheme.rules.length === 0)) {
    warnings.push('Missing detailed eligibility criteria.');
    score -= 10;
  }

  // 3. Good structure & Unique value
  if (scheme.summary.length < 100) {
    warnings.push('Summary is too brief to provide unique value.');
    score -= 5;
  }

  // 4. Duplicate Intent Control (Phase 27 integration)
  const dupCheck = await checkDuplicateIntent(scheme.title, scheme.category, scheme.slug);
  if (dupCheck.isDuplicate) {
    errors.push(`High risk of duplicate intent with existing schemes: ${dupCheck.similarSchemes.map(s => s.title).join(', ')}. Please differentiate or merge.`);
    score -= 25;
  }

  // 5. No fake claims / Keyword stuffing check (basic heuristics)
  const keywords = scheme.title.split(' ');
  const uniqueKeywords = new Set(keywords);
  if (keywords.length > 8 && uniqueKeywords.size < keywords.length * 0.6) {
    warnings.push('Potential keyword stuffing detected in title.');
    score -= 5;
  }

  // 6. Current / Accurate (Editorial Verification)
  if (scheme.status === 'ACTIVE' && scheme.editorial?.publicationStatus !== 'REVIEWED') {
    errors.push('Active scheme must be editorially reviewed first.');
    score -= 15;
  }

  // 7. Phase 28: URL Strategy Enforcement
  const urlCheck = validateUrlStrategy(scheme.slug);
  if (!urlCheck.isValid) {
    urlCheck.warnings.forEach(warn => warnings.push(`URL Strategy (Phase 28): ${warn}`));
    score -= 5 * urlCheck.warnings.length;
  }

  return {
    passed: errors.length === 0 && score >= 70,
    score: Math.max(0, score),
    warnings,
    errors
  };
}
