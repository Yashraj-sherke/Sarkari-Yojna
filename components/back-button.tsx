'use client';
import { useEffect, useState } from 'react';

export function BackButton({ fallbackUrl = '/' }: { fallbackUrl?: string }) {
  // We remove the history.length check because it is unreliable in iframes/preview environments.

  return (
    <button 
      type="button"
      onClick={(e) => { 
        e.preventDefault(); 
        const currentPath = window.location.pathname + window.location.search;
        window.history.back(); 
        
        // Fallback if back() didn't do anything (e.g., opened in new tab)
        setTimeout(() => {
          if (window.location.pathname + window.location.search === currentPath) {
            window.location.href = fallbackUrl;
          }
        }, 100);
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
