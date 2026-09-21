'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function BackButton({ fallbackUrl = '/' }: { fallbackUrl?: string }) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // If history length is > 2, there is likely a genuine previous page in this tab.
    // We also check if we are in a browser context.
    if (typeof window !== 'undefined') {
      setCanGoBack(window.history.length > 2);
    }
  }, []);

  return (
    <button 
      type="button"
      onClick={(e) => { 
        e.preventDefault(); 
        if (canGoBack) {
          router.back(); 
        } else {
          router.push(fallbackUrl);
        }
      }} 
      className="btn secondary" 
      style={{ padding: '4px 10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}
      aria-label="पीछे जाएं"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      पीछे
    </button>
  );
}
