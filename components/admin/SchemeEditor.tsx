'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <span className="text-slate-400 text-xl">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  );
}

function ArrayEditor({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            type="text" value={item}
            onChange={e => { const copy = [...items]; copy[idx] = e.target.value; onChange(copy); }}
            className="flex-1 p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder={placeholder}
          />
          <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))} className="px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ''])} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">+ Add item</button>
    </div>
  );
}

function FaqEditor({ faqs, onChange }: { faqs: { question: string; answer: string }[]; onChange: (v: any[]) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">FAQs (प्रश्नोत्तर)</label>
      {faqs.map((faq, idx) => (
        <div key={idx} className="border border-slate-200 rounded-lg p-3 mb-3 bg-slate-50">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500">Q{idx + 1}</span>
            <button type="button" onClick={() => onChange(faqs.filter((_, i) => i !== idx))} className="text-red-400 text-xs hover:text-red-600">Remove</button>
          </div>
          <input type="text" value={faq.question} onChange={e => { const copy = [...faqs]; copy[idx] = { ...copy[idx], question: e.target.value }; onChange(copy); }} placeholder="प्रश्न..." className="w-full p-2 border rounded-lg text-sm mb-2" />
          <textarea value={faq.answer} onChange={e => { const copy = [...faqs]; copy[idx] = { ...copy[idx], answer: e.target.value }; onChange(copy); }} placeholder="उत्तर..." rows={2} className="w-full p-2 border rounded-lg text-sm" />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...faqs, { question: '', answer: '' }])} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">+ Add FAQ</button>
    </div>
  );
}

export function SchemeEditor({ initialData, slug }: { initialData: any; slug: string }) {
  const [data, setData] = useState(() => ({
    ...initialData,
    documents: initialData.documents || [],
    steps: initialData.steps || [],
    rules: initialData.rules || [],
    detailedDescription: initialData.detailedDescription || [],
    eligibilityDescription: initialData.eligibilityDescription || [],
    exclusions: initialData.exclusions || [],
    faqs: initialData.faqs || [],
    practicalGuidance: initialData.practicalGuidance || [],
    applicationProcess: initialData.applicationProcess || [],
    references: initialData.references || [],
  }));
  const [saving, setSaving] = useState(false);
  const [editorialNote, setEditorialNote] = useState('');
  const [preview, setPreview] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prev: any) => ({ ...prev, [name]: value }));
  };

  const setField = (name: string, value: any) => {
    setData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorialNote.trim()) {
      alert('Please provide an editorial note describing your changes.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...data,
        editorialNote,
        priority: data.priority === true || data.priority === 'true',
        isSample: data.isSample === true || data.isSample === 'true',
        verifiedAt: data.verifiedAt || null,
        nextReviewAt: data.nextReviewAt || null,
      };
      // Clean empty arrays from faqs
      if (payload.faqs) {
        payload.faqs = payload.faqs.filter((f: any) => f.question && f.answer);
      }
      // Clean empty strings from arrays
      ['documents', 'steps', 'detailedDescription', 'eligibilityDescription', 'exclusions', 'practicalGuidance'].forEach(key => {
        if (payload[key]) payload[key] = payload[key].filter((s: string) => s.trim());
      });

      const res = await fetch('/admin/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert('✅ Scheme saved successfully!');
        router.push('/admin/schemes');
        router.refresh();
      } else {
        const err = (await res.json()) as any;
        alert('❌ Error: ' + (err.error || 'Save failed'));
      }
    } catch (error: any) {
      alert('❌ Network error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-5xl">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur py-3 flex items-center justify-between border-b border-slate-200 -mx-8 px-8 -mt-8 pt-8">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => router.back()} className="text-slate-500 hover:text-slate-700 text-sm">← Back</button>
          <h1 className="text-xl font-bold text-slate-800">{slug ? `Edit: ${data.title || slug}` : 'Create New Scheme'}</h1>
        </div>
        <div className="flex items-center gap-3">
          {slug && (
            <a href={`/yojna/${slug}`} target="_blank" className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-white">
              👁 Preview Live
            </a>
          )}
          <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium">
            {saving ? '⏳ Saving...' : '💾 Save Scheme'}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <Section title="📌 Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
            <input type="text" name="slug" value={data.slug || ''} onChange={handleChange} required readOnly={!!slug}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. ladli-behna" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select name="status" value={data.status || 'DRAFT'} onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="DRAFT">📝 DRAFT</option>
              <option value="FACT_CHECK">🔍 FACT_CHECK</option>
              <option value="REQUIRES_OFFICIAL_VERIFICATION">⏳ REQUIRES_OFFICIAL_VERIFICATION</option>
              <option value="ACTIVE">✅ ACTIVE (Published)</option>
              <option value="NEEDS_REVIEW">⚠️ NEEDS_REVIEW</option>
              <option value="UPDATE_REQUIRED">🔄 UPDATE_REQUIRED</option>
              <option value="CLOSED">🚫 CLOSED</option>
              <option value="ARCHIVED">📦 ARCHIVED</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Title (Hindi)</label>
            <input type="text" name="title" value={data.title || ''} onChange={handleChange} required
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Title (English)</label>
            <input type="text" name="english" value={data.english || ''} onChange={handleChange} required
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select name="category" value={data.category || ''} onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="kisan">🌾 Kisan (Agriculture)</option>
              <option value="mahila">👩 Mahila (Women & Child)</option>
              <option value="shiksha">📚 Shiksha (Education)</option>
              <option value="swasthya">🏥 Swasthya (Health)</option>
              <option value="awas">🏠 Awas (Housing)</option>
              <option value="rojgar">💼 Rojgar (Employment)</option>
              <option value="pension">👴 Pension</option>
              <option value="khadya">🍚 Khadya (Ration)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">State / Level</label>
            <select name="state" value={data.state || ''} onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="central">🇮🇳 Central Government</option>
              <option value="madhya-pradesh">🏛️ Madhya Pradesh</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department / Ministry</label>
            <input type="text" name="department" value={data.department || ''} onChange={handleChange} required
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Benefit Amount / Short</label>
            <input type="text" name="benefit" value={data.benefit || ''} onChange={handleChange} required
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="₹1,250/माह" />
          </div>
        </div>
      </Section>

      {/* Summary & Description */}
      <Section title="📝 Content">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Short Summary (सारांश)</label>
          <textarea name="summary" value={data.summary || ''} onChange={handleChange} rows={3} required
            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <ArrayEditor
          label="Detailed Description (विस्तृत विवरण) — Each paragraph"
          items={data.detailedDescription || []}
          onChange={v => setField('detailedDescription', v)}
          placeholder="Add a paragraph..."
        />
      </Section>

      {/* Eligibility */}
      <Section title="✅ Eligibility (पात्रता)">
        <ArrayEditor
          label="Eligibility Criteria"
          items={data.eligibilityDescription || []}
          onChange={v => setField('eligibilityDescription', v)}
          placeholder="Add an eligibility condition..."
        />
        <ArrayEditor
          label="Exclusions (अपवाद — who is NOT eligible)"
          items={data.exclusions || []}
          onChange={v => setField('exclusions', v)}
          placeholder="Add an exclusion..."
        />
      </Section>

      {/* Documents & Steps */}
      <Section title="📄 Documents & Application Steps">
        <ArrayEditor
          label="Required Documents (आवश्यक दस्तावेज़)"
          items={data.documents || []}
          onChange={v => setField('documents', v)}
          placeholder="E.g., आधार कार्ड, निवास प्रमाण पत्र..."
        />
        <ArrayEditor
          label="Application Steps (आवेदन के चरण)"
          items={data.steps || []}
          onChange={v => setField('steps', v)}
          placeholder="Step 1: ..."
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tracking Guidance (स्थिति जाँच)</label>
          <textarea name="trackingGuidance" value={data.trackingGuidance || ''} onChange={handleChange} rows={2}
            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="How to check application status..." />
        </div>
      </Section>

      {/* FAQs */}
      <Section title="❓ FAQs (प्रश्नोत्तर)" defaultOpen={false}>
        <FaqEditor faqs={data.faqs || []} onChange={v => setField('faqs', v)} />
      </Section>

      {/* Practical Guidance */}
      <Section title="💡 Practical Guidance" defaultOpen={false}>
        <ArrayEditor
          label="Tips & Practical Advice for applicants"
          items={data.practicalGuidance || []}
          onChange={v => setField('practicalGuidance', v)}
          placeholder="Helpful tip for applying..."
        />
      </Section>

      {/* Official Sources */}
      <Section title="🔗 Official Sources">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Official Portal URL</label>
            <input type="url" name="sourceUrl" value={data.sourceUrl || ''} onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://....gov.in/..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Application Portal URL</label>
            <input type="url" name="applicationUrl" value={data.applicationUrl || ''} onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Source Notes</label>
          <textarea name="sourceNotes" value={data.sourceNotes || ''} onChange={handleChange} rows={2}
            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
      </Section>

      {/* Media & SEO */}
      <Section title="🖼️ Media & SEO">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Custom Image URL</label>
          <div className="flex gap-2">
            <input type="text" name="imageUrl" value={data.imageUrl || ''} onChange={handleChange}
              className="flex-1 p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="/kisan-1.jpg or https://..." />
            <label className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 whitespace-nowrap text-sm font-medium flex items-center gap-1">
              📤 Upload
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('file', file);
                try {
                  const res = await fetch('/admin/api/upload', { method: 'POST', body: formData });
                  const uploadData = (await res.json()) as any;
                  if (res.ok) setField('imageUrl', uploadData.url);
                  else alert('Upload failed: ' + uploadData.error);
                } catch { alert('Upload error'); }
              }} />
            </label>
          </div>
          {data.imageUrl && (
            <div className="mt-2">
              <Image
                src={data.imageUrl}
                alt="Preview"
                width={160}
                height={96}
                unoptimized
                className="h-24 w-auto rounded-lg object-cover border"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description (Meta Tag)</label>
          <textarea name="seoDescription" value={data.seoDescription || ''} onChange={handleChange} rows={2} maxLength={300}
            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Short description optimized for Google..." />
          <p className="text-xs text-slate-400 mt-1">{(data.seoDescription || '').length}/300 characters</p>
        </div>
      </Section>

      {/* Editorial Note - Always visible */}
      <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-6">
        <h2 className="text-lg font-bold text-indigo-900 mb-3">📋 Editorial Note (Required)</h2>
        <textarea
          value={editorialNote}
          onChange={e => setEditorialNote(e.target.value)}
          rows={2}
          required
          className="w-full p-2.5 border border-indigo-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          placeholder="Describe what you changed and why (e.g., 'Updated eligibility criteria from latest govt notification')..."
        />
        <p className="text-xs text-indigo-500 mt-1">This is saved in the audit log for accountability.</p>
      </div>

      {/* Bottom actions */}
      <div className="flex justify-between items-center pt-4">
        <div>
          {slug && (
            <a href={`/admin/schemes/edit/${slug}/history`} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              🕒 View Version History
            </a>
          )}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-white text-sm">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium">
            {saving ? '⏳ Saving...' : '💾 Save Scheme'}
          </button>
        </div>
      </div>
    </form>
  );
}
