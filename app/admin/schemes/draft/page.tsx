'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AIDraftPage() {
  const [sourceText, setSourceText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/admin/api/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText, url: sourceUrl })
      });
      
      const data = (await res.json()) as any;
      
      if (res.ok) {
        alert('Draft generated successfully! Redirecting to editor...');
        router.push(`/admin/schemes/edit/${data.slug}`);
      } else {
        alert('Error: ' + data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">AI Draft Assistant</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <p className="text-slate-600 mb-6">
          Paste the official notification text or government portal content below. 
          The AI will automatically extract facts, benefits, and eligibility criteria 
          to generate a structured draft. It will be saved as <strong>DRAFT</strong> and will 
          not be published until you manually verify it.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Official Source URL (Evidence)</label>
            <input 
              type="url" 
              value={sourceUrl} 
              onChange={e => setSourceUrl(e.target.value)} 
              className="w-full p-2 border rounded" 
              placeholder="https://india.gov.in/..." 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Source Text / Content</label>
            <textarea 
              value={sourceText} 
              onChange={e => setSourceText(e.target.value)} 
              rows={10} 
              className="w-full p-2 border rounded" 
              placeholder="Paste the official scheme details here..." 
              required
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button 
              type="submit" 
              disabled={loading} 
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Analyzing Source...' : 'Generate Structured Draft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
