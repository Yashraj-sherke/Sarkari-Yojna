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

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    return (
      <div className="adsense-container-dev" style={{ minHeight: '90px', width: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
        AdSense Advertisement Slot
      </div>
    );
  }

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
