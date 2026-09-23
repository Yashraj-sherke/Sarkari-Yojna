import type { Scheme } from './domain';
import { rationArticle } from './scheme-content/ration-support';
import { reviewedCorrections } from './scheme-content/reviewed-corrections';

export function enrichSchemeArticle(input: Scheme): Scheme {
  const correction = input.slug === 'ration-support' ? rationArticle : reviewedCorrections[input.slug];
  const s: Scheme = correction ? { ...input, ...correction } : { ...input };
  // Do not retain English versions of fields whose facts changed in Hindi.
  if (correction) for (const field of ['summary','benefit','documents','steps','detailedDescription','benefitsList','eligibilityDescription','exclusions','applicationProcess','faqs'] as const) {
    if (field in correction) delete s[`${field}En`];
  }
  return {
    ...s,
    editorial: s.editorial ?? {
      verificationStatus: 'NEEDS_VERIFICATION', publicationStatus: 'DRAFT_REVIEW_REQUIRED', reviewedAt: null,
      note: 'इस योजना की पूरी जानकारी का वर्तमान आधिकारिक दिशानिर्देश से स्वतंत्र सत्यापन बाकी है। सत्यापन पूरा होने तक इस पेज को मसौदा मानें।',
    },
    references: s.references ?? (s.sourceUrl ? [{title: `${s.title} — विभागीय स्रोत`, organization: s.department, url: s.sourceUrl, sections: ['उपलब्ध योजना रिकॉर्ड'], accessedAt: null, note: s.sourceNotes}] : []),
  };
}
