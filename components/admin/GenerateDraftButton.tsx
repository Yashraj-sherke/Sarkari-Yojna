'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GenerateDraftButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/admin/api/generate-news-draft', { method: 'POST' });
      const data = (await res.json()) as any;
      if (data.success) {
        router.push(`/admin/news/edit/${data.slug}`);
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert('Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleGenerate}
      disabled={loading}
      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
    >
      {loading ? '✨ Generating...' : '✨ Generate AI Draft'}
    </button>
  );
}
