import { getAdminUser } from '@/lib/admin-auth';
import { db } from '@/lib/server';
import { NextRequest, NextResponse } from 'next/server';
import { generateDailyNewsDraft } from '@/lib/news-generator';

export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sql = db();
  if (!sql) return NextResponse.json({ error: 'No DB' }, { status: 500 });

  try {
    const aiDraft = await generateDailyNewsDraft();

    await sql`
      INSERT INTO samachar (
        slug, title, summary, category, image_url, body, status, created_at, updated_at
      ) VALUES (
        ${aiDraft.slug}, ${aiDraft.title}, ${aiDraft.summary}, ${aiDraft.category}, ${aiDraft.imageUrl}, ${JSON.stringify(aiDraft.body)}, ${aiDraft.status}, ${aiDraft.createdAt}, ${aiDraft.updatedAt}
      )
    `;
    return NextResponse.json({ success: true, slug: aiDraft.slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
