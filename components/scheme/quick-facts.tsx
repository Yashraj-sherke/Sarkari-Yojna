import React from 'react';
import { type Scheme } from '@/lib/domain';

export function SchemeQuickFacts({ s, pageLang = 'hi' }: { s: Scheme; pageLang?: 'en' | 'hi' }) {
  const hasProcess = s.applicationProcess && s.applicationProcess.length > 0;
  
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <h2 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '16px', fontWeight: 600, borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        {pageLang === 'en' ? 'Scheme at a Glance' : 'योजना एक नज़र में'}
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          <strong style={{ width: '40%', color: '#64748b', fontSize: '0.9rem' }}>{pageLang === 'en' ? 'Department' : 'विभाग / मंत्रालय'}</strong>
          <span style={{ width: '60%', color: '#334155', fontWeight: 500 }}>{s.department}</span>
        </div>
        
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          <strong style={{ width: '40%', color: '#64748b', fontSize: '0.9rem' }}>{pageLang === 'en' ? 'Category' : 'लाभार्थी'}</strong>
          <span style={{ width: '60%', color: '#334155', fontWeight: 500 }}>{s.category}</span>
        </div>
        
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          <strong style={{ width: '40%', color: '#64748b', fontSize: '0.9rem' }}>{pageLang === 'en' ? 'Main Benefit' : 'मुख्य लाभ'}</strong>
          <span style={{ width: '60%', color: '#0f172a', fontWeight: 500 }}>{pageLang === 'en' ? (s.benefitEn ?? s.benefit) : s.benefit}</span>
        </div>

        {s.sourceUrl && (
          <div style={{ display: 'flex', paddingTop: '4px' }}>
            <strong style={{ width: '40%', color: '#64748b', fontSize: '0.9rem' }}>{pageLang === 'en' ? 'Official Portal' : 'आधिकारिक पोर्टल'}</strong>
            <span style={{ width: '60%' }}>
              <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#059669', textDecoration: 'underline', fontWeight: 500 }}>
                {new URL(s.sourceUrl).hostname}
              </a>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
