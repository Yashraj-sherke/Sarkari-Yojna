import { allSchemes } from '@/lib/server';

export async function GET() {
  const schemes = await allSchemes();
  
  const headers = ['Scheme Name', 'Department', 'Operational Status', 'Verification Date', 'Next Review Date', 'Official Source'];
  
  const rows = schemes.map(s => {
    return [
      `"${s.title.replace(/"/g, '""')}"`,
      `"${(s.department || '').replace(/"/g, '""')}"`,
      s.status,
      s.verifiedAt ? new Date(s.verifiedAt).toISOString().split('T')[0] : '',
      s.nextReviewAt ? new Date(s.nextReviewAt).toISOString().split('T')[0] : '',
      `"${(s.sourceUrl || '').replace(/"/g, '""')}"`
    ].join(',');
  });
  
  const csv = [headers.join(','), ...rows].join('\n');
  
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="sarkari-yojana-verification-status.csv"',
    }
  });
}
