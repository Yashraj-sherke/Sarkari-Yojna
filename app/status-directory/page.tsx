import { allSchemes } from '@/lib/server';
import { isIndexableScheme } from '@/lib/seo';
import Link from 'next/link';

export const metadata = {
  title: 'Government Scheme Verification and Status Directory',
  description: 'Independent editorial review status and source references for the Sarkari Yojana catalogue.',
  alternates: {canonical: '/status-directory'},
};

export default async function StatusDirectoryPage() {
  const schemes = await allSchemes();
  const reviewed = schemes.filter(isIndexableScheme);

  return (
    <main className="p-8 max-w-7xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      <h1 className="text-3xl font-bold mb-4">Government Scheme Verification and Status Directory</h1>
      <p className="mb-6 text-gray-700">
        This independent directory shows recorded catalogue status and editorial review dates.
        A catalogue entry does not confirm that applications are currently open. Check the official department source before applying.
      </p>
      
      <div className="flex gap-4 mb-8">
        <a href="/api/status-directory/csv" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Download CSV
        </a>
      </div>

      <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Scheme Name</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Recorded Status / Review</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Verification Date</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Next Review Date</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Official Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {reviewed.map(s => (
              <tr key={s.slug}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  <Link href={`/yojna/${s.slug}`} className="text-blue-600 hover:underline">{s.title}</Link>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{s.department || 'N/A'}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${s.status === 'ACTIVE' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10'}`}>
                    {s.status}
                  </span>
                  <div>{s.editorial?.verificationStatus ?? 'NEEDS_VERIFICATION'}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{s.editorial?.reviewedAt ? new Date(s.editorial.reviewedAt).toLocaleDateString('en-IN', {timeZone: 'Asia/Kolkata'}) : 'Verification required'}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{s.nextReviewAt ? new Date(s.nextReviewAt).toLocaleDateString() : 'N/A'}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {s.sourceUrl ? <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a> : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
