import { db } from '@/lib/server';
import { NextRequest, NextResponse } from 'next/server';
import { generateDailyNewsDraft, generateNewSchemeDraft } from '@/lib/news-generator';

async function getEnv(key: string): Promise<string | undefined> {
  if (typeof process !== 'undefined' && process.env[key]) return process.env[key];
  try {
    // @ts-ignore
    const cf = await import(/* webpackIgnore: true */ "cloudflare:workers");
    if (cf && cf.env && (cf.env as any)[key]) return (cf.env as any)[key];
  } catch {}
  return undefined;
}

export async function GET(request: NextRequest) {
  // Protect the cron route with a secret key
  const authHeader = request.headers.get('authorization');
  const cronSecret = await getEnv('CRON_SECRET');
  
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sql = db();
  if (!sql) return NextResponse.json({ error: 'No DB' }, { status: 500 });

  try {
    // 1. Generate Daily News Drafts based on trendy topics
    const topics = [
      "women empowerment schemes or subsidies (e.g. Ladli Behna, PM Matru Vandana)",
      "farmers and agriculture schemes (e.g. PM Kisan, Krishi Yantra)",
      "youth employment or student scholarships"
    ];
    
    const newsSlugs = [];
    for (const topic of topics) {
      const aiDraft = await generateDailyNewsDraft(topic);
      await sql`
        INSERT INTO samachar (
          slug, title, summary, category, image_url, body, status, created_at, updated_at
        ) VALUES (
          ${aiDraft.slug}, ${aiDraft.title}, ${aiDraft.summary}, ${aiDraft.category}, ${aiDraft.imageUrl}, ${JSON.stringify(aiDraft.body)}, ${aiDraft.status}, ${aiDraft.createdAt}, ${aiDraft.updatedAt}
        )
      `;
      newsSlugs.push(aiDraft.slug);
    }

    // 2. Generate a Draft for a newly announced Scheme
    const aiScheme = await generateNewSchemeDraft();
    await sql`
      INSERT INTO schemes (
        slug, data, status, next_review_at, updated_at
      ) VALUES (
        ${aiScheme.slug}, ${JSON.stringify(aiScheme)}, ${aiScheme.status}, ${aiScheme.nextReviewAt}, ${new Date().toISOString()}
      )
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'Daily news and scheme drafts generated successfully', 
      newsSlugs,
      schemeSlug: aiScheme.slug
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
