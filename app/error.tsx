'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="empty-state" style={{ padding: '40px 20px', textAlign: 'center' }}>
      <h2>कुछ गलत हो गया</h2>
      <p>पृष्ठ लोड करने में समस्या आई है। कृपया पुनः प्रयास करें।</p>
      <button className="button" onClick={() => reset()}>
        पुनः प्रयास करें
      </button>
    </div>
  );
}
