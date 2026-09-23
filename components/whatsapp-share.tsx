'use client';
import { track } from './site';
import {useLanguage} from '@/lib/i18n';
import {SITE_URL} from '@/lib/config';

const WA_ICON = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12.031 0C5.405 0 0 5.405 0 12.031c0 2.12.548 4.17 1.592 5.986L.085 23.915l6.04-1.584A11.963 11.963 0 0 0 12.031 24c6.626 0 12.031-5.404 12.031-12.031S18.657 0 12.031 0zm0 20.038c-1.782 0-3.528-.48-5.06-1.387l-.362-.214-3.766.988.998-3.673-.235-.374a9.98 9.98 0 0 1-1.537-5.348c0-5.508 4.48-9.988 9.987-9.988 5.507 0 9.987 4.48 9.987 9.988 0 5.508-4.48 9.988-9.987 9.988zm5.474-7.48c-.301-.151-1.78-.88-2.056-.98-.276-.101-.478-.151-.678.151-.201.301-.779.98-.955 1.18-.176.201-.352.226-.653.075-.301-.151-1.27-.468-2.42-1.493-.896-.798-1.503-1.785-1.68-2.086-.176-.301-.019-.464.132-.615.136-.135.301-.352.452-.528.151-.176.201-.301.301-.502.1-.201.05-.377-.025-.528-.075-.151-.678-1.633-.929-2.236-.246-.588-.496-.508-.678-.518-.176-.008-.377-.01-.578-.01-.201 0-.528.075-.803.376-.276.301-1.055 1.03-1.055 2.513 0 1.483 1.08 2.915 1.231 3.116.151.201 2.126 3.246 5.146 4.548.718.31 1.278.495 1.716.634.721.229 1.378.196 1.895.12.576-.085 1.78-.729 2.03-1.434.251-.704.251-1.307.176-1.434-.076-.126-.277-.201-.578-.352z"/>
  </svg>
);

const SHARE_ICON = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

function getWhatsAppUrl(title: string, url: string) {
  const text = `📋 *${title}*\n\nयोजना की पूरी जानकारी — पात्रता, लाभ, दस्तावेज़ और आवेदन प्रक्रिया:\n${url}\n\n✅ Sarkari Yojna Setu पर देखें`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

/** Floating sticky WhatsApp CTA for mobile scheme detail pages */
export function WhatsAppFloatingCTA({ title, slug }: { title: string; slug: string }) {
  const {t} = useLanguage();
  const url = `${SITE_URL}/yojna/${slug}`;
  return (
    <a
      href={getWhatsAppUrl(title, url)}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-floating-cta"
      aria-label={t.waShareText}
      onClick={() => track('wa_share_floating')}
    >
      {WA_ICON}
      <span>{t.waShareText}</span>
      <span className="wa-pulse" />
    </a>
  );
}

/** Inline WhatsApp share banner for scheme detail pages */
export function WhatsAppShareBanner({ title, slug }: { title: string; slug: string }) {
  const {t} = useLanguage();
  const url = `${SITE_URL}/yojna/${slug}`;
  return (
    <div className="wa-share-banner">
      <div className="wa-share-banner-icon">{WA_ICON}</div>
      <div className="wa-share-banner-text">
        <p>{t.waShareBannerMsg}</p>
        <span>{t.waShareBannerSub}</span>
      </div>
      <a
        href={getWhatsAppUrl(title, url)}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-share-banner-btn"
        onClick={() => track('wa_share_banner')}
      >
        {WA_ICON}
        {t.waShareBtn}
      </a>
    </div>
  );
}

/** Small WhatsApp share button for scheme cards */
export function CardWhatsAppShare({ title, slug }: { title: string; slug: string }) {
  const url = `${SITE_URL}/yojna/${slug}`;

  function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    track('wa_share_card');

    // Use native share API if available (mobile browsers)
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: title,
        text: `${title} — पात्रता, लाभ और आवेदन प्रक्रिया`,
        url: url,
      }).catch(() => {
        // Fallback to WhatsApp if native share cancelled
        window.open(getWhatsAppUrl(title, url), '_blank');
      });
    } else {
      window.open(getWhatsAppUrl(title, url), '_blank');
    }
  }

  return (
    <button className="card-wa-share" onClick={handleShare} aria-label="WhatsApp पर शेयर करें">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M12.031 0C5.405 0 0 5.405 0 12.031c0 2.12.548 4.17 1.592 5.986L.085 23.915l6.04-1.584A11.963 11.963 0 0 0 12.031 24c6.626 0 12.031-5.404 12.031-12.031S18.657 0 12.031 0zm0 20.038c-1.782 0-3.528-.48-5.06-1.387l-.362-.214-3.766.988.998-3.673-.235-.374a9.98 9.98 0 0 1-1.537-5.348c0-5.508 4.48-9.988 9.987-9.988 5.507 0 9.987 4.48 9.987 9.988 0 5.508-4.48 9.988-9.987 9.988zm5.474-7.48c-.301-.151-1.78-.88-2.056-.98-.276-.101-.478-.151-.678.151-.201.301-.779.98-.955 1.18-.176.201-.352.226-.653.075-.301-.151-1.27-.468-2.42-1.493-.896-.798-1.503-1.785-1.68-2.086-.176-.301-.019-.464.132-.615.136-.135.301-.352.452-.528.151-.176.201-.301.301-.502.1-.201.05-.377-.025-.528-.075-.151-.678-1.633-.929-2.236-.246-.588-.496-.508-.678-.518-.176-.008-.377-.01-.578-.01-.201 0-.528.075-.803.376-.276.301-1.055 1.03-1.055 2.513 0 1.483 1.08 2.915 1.231 3.116.151.201 2.126 3.246 5.146 4.548.718.31 1.278.495 1.716.634.721.229 1.378.196 1.895.12.576-.085 1.78-.729 2.03-1.434.251-.704.251-1.307.176-1.434-.076-.126-.277-.201-.578-.352z"/>
      </svg>
      शेयर
    </button>
  );
}
