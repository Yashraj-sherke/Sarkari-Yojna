'use client';
import { useEffect } from 'react';

export function AdSensePlaceholder({ client, slot, format = 'auto', responsive = 'true' }: { client: string, slot: string, format?: string, responsive?: string }) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className="adsense-container" style={{ minHeight: '250px', width: '100%', overflow: 'hidden' }}>
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
