import React from 'react';
import { type Scheme } from '@/lib/domain';

export function SchemeQuickAnswer({ s, pageLang = 'hi' }: { s: Scheme; pageLang?: 'en' | 'hi' }) {
  // We use the summary field as the quick answer since it's already a concise 2-4 lines.
  const title = pageLang === 'en' ? (s.english || s.title) : s.title;
  const summary = pageLang === 'en' ? (s.summaryEn ?? s.summary) : s.summary;

  return (
    <div style={{
      background: '#f8fafc',
      borderLeft: '4px solid #1e293b',
      padding: '16px',
      borderRadius: '4px',
      marginBottom: '32px'
    }}>
      <strong style={{ display: 'block', fontSize: '1.1rem', color: '#0f172a', marginBottom: '8px' }}>
        {pageLang === 'en' ? `What is ${title}?` : `${title} क्या है?`}
      </strong>
      <p style={{ margin: 0, color: '#334155', lineHeight: '1.6' }}>
        {summary}
      </p>
    </div>
  );
}
