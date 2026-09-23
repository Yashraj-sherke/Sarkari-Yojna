'use client';
import { useState } from 'react';
import { officialImages } from '@/lib/scheme-images';
import type { Scheme } from '@/lib/domain';

const categoryBanners: Record<string, { src: string; alt: string; credit: string }> = {
  kisan: { src: '/banners/cat-kisan.svg', alt: 'किसान कल्याण एवं कृषि योजनाएं', credit: 'किसान कल्याण तथा कृषि विकास विभाग' },
  mahila: { src: '/banners/cat-mahila.svg', alt: 'महिला एवं बाल विकास योजनाएं', credit: 'महिला एवं बाल विकास विभाग' },
  shiksha: { src: '/banners/cat-shiksha.svg', alt: 'शिक्षा एवं छात्रवृत्ति योजनाएं', credit: 'स्कूल एवं उच्च शिक्षा विभाग' },
  swasthya: { src: '/banners/cat-swasthya.svg', alt: 'स्वास्थ्य एवं चिकित्सा योजनाएं', credit: 'लोक स्वास्थ्य एवं परिवार कल्याण विभाग' },
  awas: { src: '/banners/cat-awas.svg', alt: 'आवास एवं बुनियादी सुविधा योजनाएं', credit: 'पंचायत एवं ग्रामीण विकास विभाग' },
  rojgar: { src: '/banners/cat-rojgar.svg', alt: 'रोज़गार, कौशल एवं स्वरोज़गार योजनाएं', credit: 'कौशल विकास एवं रोज़गार विभाग' },
  pension: { src: '/banners/cat-pension.svg', alt: 'पेंशन एवं सामाजिक सुरक्षा योजनाएं', credit: 'सामाजिक न्याय एवं दिव्यांगजन विभाग' },
  khadya: { src: '/banners/cat-khadya.svg', alt: 'खाद्य एवं नागरिक आपूर्ति योजनाएं', credit: 'खाद्य, नागरिक आपूर्ति विभाग' },
};

import Image from 'next/image';

export function OfficialImage({ slug, scheme, priority = false }: { slug: string; scheme?: Pick<Scheme, 'category' | 'title' | 'english' | 'sourceUrl' | 'department'>, priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  const specific = officialImages[slug];
  const cat = scheme?.category || 'kisan';
  const catBanner = categoryBanners[cat] || categoryBanners.kisan;

  const asset = specific || {
    src: catBanner.src,
    alt: scheme ? `${scheme.title} | ${scheme.english} — आधिकारिक योजना बैनर / Official Scheme Banner` : catBanner.alt,
    source: scheme?.sourceUrl || 'https://myscheme.gov.in/',
    credit: scheme?.department || catBanner.credit,
    width: 1200,
    height: 400
  };

  const finalSrc = failed ? catBanner.src : asset.src;

  return <figure className="official-image" style={{ position: 'relative', width: '100%', aspectRatio: `${asset.width}/${asset.height}`, backgroundColor: '#f1f5f9' }}>
    <Image
      src={finalSrc}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom' }}
      onError={() => setFailed(true)}
    />
  </figure>;
}

