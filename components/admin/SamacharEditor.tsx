'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SamacharEditor({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    slug: initialData?.slug || '',
    title: initialData?.title || '',
    summary: initialData?.summary || '',
    category: initialData?.category || 'योजना अपडेट',
    imageUrl: initialData?.image_url || '',
    body: initialData?.body ? (Array.isArray(initialData.body) ? initialData.body.join('\n\n') : initialData.body) : '',
    status: initialData?.status || 'DRAFT',
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (overrideStatus?: string) => {
    if (!formData.slug || !formData.title || !formData.body) {
      alert('Please fill in slug, title, and body');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...formData,
        status: overrideStatus || formData.status,
        body: formData.body.split('\n\n').filter((p: string) => p.trim() !== ''),
      };

      const res = await fetch('/admin/api/samachar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = (await res.json()) as any;
        throw new Error(err.error || 'Save failed');
      }
      alert('✅ Article saved successfully!');
      router.push('/admin/news');
      router.refresh();
    } catch (e: any) {
      alert('❌ Error saving: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-700 text-sm">← Back</button>
          <h1 className="text-2xl font-bold text-slate-800">{initialData ? 'Edit Article' : 'Create Article'}</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.back()} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white text-sm font-medium">
            Cancel
          </button>
          <button onClick={() => handleSave()} disabled={saving} className="px-5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-50 text-sm font-medium">
            {saving ? '⏳ Saving...' : '💾 Save Draft'}
          </button>
          <button onClick={() => handleSave('PUBLISHED')} disabled={saving} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium flex items-center gap-2">
            🚀 Publish Directly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-5">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">📌 Basic Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange}
                  disabled={!!initialData}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50"
                  placeholder="e.g. pm-kisan-update" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="DRAFT">📝 Draft</option>
                  <option value="PUBLISHED">✅ Published</option>
                  <option value="ARCHIVED">📦 Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">📝 Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input type="text" name="category" value={formData.category} onChange={handleChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                  <div className="flex gap-2">
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                      className="flex-1 p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="/images/samachar/..." />
                    <label className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 text-sm font-medium flex items-center gap-1 whitespace-nowrap">
                      📤 Upload
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append('file', file);
                        try {
                          const res = await fetch('/admin/api/upload', { method: 'POST', body: fd });
                          const data = (await res.json()) as { url?: string; error?: string };
                          if (res.ok && data.url) setFormData(prev => ({ ...prev, imageUrl: data.url }));
                          else alert('Upload failed: ' + (data.error || 'Unknown error'));
                        } catch { alert('Upload error'); }
                      }} />
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Summary (1-2 lines for card preview)</label>
                <textarea name="summary" value={formData.summary} onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Body Content</label>
                <p className="text-xs text-slate-400 mb-1">Separate paragraphs with a blank line (double Enter)</p>
                <textarea name="body" value={formData.body} onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none" rows={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-3 flex items-center gap-2">
            👁 Live Website Preview
          </h2>
          <article className="samachar-detail-article" style={{fontFamily: 'sans-serif', margin: 0, padding: 0}}>
            <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px'}}>
              <span style={{background: '#edf2f7', color: '#4a5568', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600}}>
                {formData.category || 'श्रेणी'}
              </span>
              <time style={{color: '#718096', fontSize: '0.85rem'}}>
                {new Date().toLocaleDateString('hi-IN')}
              </time>
            </div>
            
            <h1 style={{fontSize: '2rem', fontWeight: 700, marginBottom: '15px', color: '#1a202c', lineHeight: 1.3}}>
              {formData.title || 'यहाँ आपका शीर्षक दिखाई देगा'}
            </h1>

            <div style={{marginBottom: '20px', color: '#4a5568', fontWeight: 500, fontSize: '0.9rem'}}>
              लेखा: Sarkari Yojana Desk
            </div>

            {formData.imageUrl ? (
              <div style={{marginBottom: '25px'}}>
                <Image
                  src={formData.imageUrl}
                  alt="Cover"
                  width={960}
                  height={350}
                  unoptimized
                  style={{objectFit: 'cover', width: '100%', height: 'auto', borderRadius: '8px', maxHeight: '350px'}}
                />
              </div>
            ) : (
              <div style={{marginBottom: '25px', height: '200px', background: '#f7fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0'}}>
                No Image Selected
              </div>
            )}
            
            <div style={{fontSize: '1.1rem', color: '#2d3748', lineHeight: 1.8}}>
              {formData.body ? formData.body.split('\n\n').filter((p: string) => p.trim() !== '').map((p: string, idx: number) => (
                <p key={idx} dangerouslySetInnerHTML={{ __html: p }} style={{marginBottom: '1.5rem'}} />
              )) : (
                <p style={{color: '#a0aec0'}}>लेख की सामग्री यहाँ दिखाई देगी...</p>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
