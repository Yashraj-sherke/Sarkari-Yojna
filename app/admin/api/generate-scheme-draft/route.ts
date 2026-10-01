import { getAdminUser } from '@/lib/admin-auth';
import { db } from '@/lib/server';
import { NextRequest, NextResponse } from 'next/server';
import { generateNewSchemeDraft } from '@/lib/news-generator';

export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sql = db();
  if (!sql) return NextResponse.json({ error: 'No DB' }, { status: 500 });

  try {
    const aiScheme = await generateNewSchemeDraft();

    await sql`
      INSERT INTO schemes (
        slug, data, status, next_review_at, updated_at
      ) VALUES (
        ${aiScheme.slug}, ${JSON.stringify(aiScheme)}, ${aiScheme.status}, ${aiScheme.nextReviewAt}, ${new Date().toISOString()}
      )
    `;
    return NextResponse.json({ success: true, slug: aiScheme.slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
