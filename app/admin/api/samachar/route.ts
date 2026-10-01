import { getAdminUser } from '@/lib/admin-auth';
import { db } from '@/lib/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = (await request.json()) as any;
  const sql = db();
  if (!sql) return NextResponse.json({ error: 'No DB' }, { status: 500 });

  const now = new Date().toISOString();
  try {
    await sql`
      INSERT INTO samachar (
        slug, title, summary, category, image_url, body, status, created_at, updated_at
      ) VALUES (
        ${data.slug}, ${data.title}, ${data.summary}, ${data.category}, ${data.imageUrl || null}, ${JSON.stringify(data.body)}, ${data.status || 'DRAFT'}, ${now}, ${now}
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        summary = EXCLUDED.summary,
        category = EXCLUDED.category,
        image_url = EXCLUDED.image_url,
        body = EXCLUDED.body,
        status = EXCLUDED.status,
        updated_at = EXCLUDED.updated_at
    `;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
