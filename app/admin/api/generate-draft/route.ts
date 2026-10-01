import { NextRequest, NextResponse } from 'next/server';
import { saveScheme } from '@/lib/server';
import { getAdminUser } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, url } = (await req.json()) as { text: string; url: string; };

    // Here we would normally call OpenAI/Claude API to structure the `text`.
    // For now, we mock the extraction to demonstrate the Draft Workflow.
    const mockSlug = `draft-${Date.now()}`;
    
    const draftScheme = {
      slug: mockSlug,
      title: 'AI Draft: Needs Verification',
      english: 'AI Draft',
      category: 'mahila',
      state: 'central',
      summary: text.substring(0, 150) + '...',
      benefit: 'Extracted Benefit Amount',
      department: 'Extracted Department',
      documents: ['Aadhaar Card', 'Bank Passbook'],
      steps: ['Visit official portal', 'Fill application form'],
      rules: [],
      sourceUrl: url,
      applicationUrl: url,
      sourceNotes: 'AI Extracted from: ' + text.substring(0, 50),
      status: 'DRAFT', // FORCED DRAFT STATUS
      priority: false,
      isSample: false,
    };

    // Save to database as DRAFT
    await saveScheme(draftScheme, user.email, 'AI Generated Draft');

    return NextResponse.json({ success: true, slug: mockSlug });
  } catch (error: any) {
    console.error('AI Draft Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate draft' }, { status: 500 });
  }
}
