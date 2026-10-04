import { z } from 'zod';
import samacharData from '../data/samachar.json';

export const samacharSchema = z.object({
  slug: z.string().max(100),
  title: z.string().min(5).max(180),
  date: z.string(), // ISO date string
  category: z.string(),
  author: z.string(),
  imageUrl: z.string().optional(),
  body: z.array(z.string()),
  summary: z.string().max(300),
  changes: z.string().optional(),
  affected: z.string().optional(),
  sourceUrl: z.string().optional(),
  schemeSlugs: z.array(z.string().max(100)).optional(),
});

export type Samachar = z.infer<typeof samacharSchema>;

export function getSamacharRelatedSchemeSlugs(item: Pick<Samachar, 'body'> & Partial<Samachar>) {
  const explicit: string[] = item.schemeSlugs ?? [];
  const linked = [...new Set([...item.body.join('\n').matchAll(/href=['"]\/yojna\/([^'"/?#]+)['"]/gi)].map(match => match[1]))];
  return [...new Set([...explicit, ...linked])];
}

export function samacharQuality(item: Samachar) {
  const officialBodySource = item.body.some(part => /https?:\/\/[^'"\s>]+\.(?:gov|nic)\.in(?:[/'"\s>?#]|$)/i.test(part));
  const issues = [
    !item.title.trim() ? 'Headline missing' : null,
    !item.summary.trim() ? 'Summary missing' : null,
    !item.body.length ? 'Update body missing' : null,
    Number.isNaN(new Date(item.date).getTime()) ? 'Update date invalid' : null,
    !item.changes ? 'What changed is not structured' : null,
    !item.affected ? 'Affected audience is not structured' : null,
    !(item.sourceUrl || officialBodySource) ? 'Official source missing' : null,
    !getSamacharRelatedSchemeSlugs(item).length ? 'Scheme pillar link missing' : null,
  ].filter((issue): issue is string => Boolean(issue));
  return {slug: item.slug, title: item.title, issues, publishable: issues.length === 0};
}

export async function getAllSamachar(): Promise<Samachar[]> {
  let dbNews: Samachar[] = [];
  try {
    const sql = await import('./server').then(m => m.db());
    if (sql) {
      const results = await sql`SELECT * FROM samachar WHERE status = 'PUBLISHED' ORDER BY updated_at DESC`;
      if (results.length > 0) {
        dbNews = results.map((row: any) => ({
          slug: row.slug,
          title: row.title,
          date: row.updated_at,
          category: row.category,
          author: 'Sarkari Yojana Desk',
          imageUrl: row.image_url || undefined,
          body: typeof row.body === 'string' ? JSON.parse(row.body) : row.body,
          summary: row.summary,
          changes: row.changes || undefined,
          affected: row.affected || undefined,
          sourceUrl: row.source_url || undefined,
          schemeSlugs: Array.isArray(row.scheme_slugs) ? row.scheme_slugs : undefined,
        }));
      }
    }
  } catch (error) {
    console.error('getAllSamachar error', error);
  }
  
  // Merge DB and static JSON, preventing duplicates by slug
  const data = samacharData as Samachar[];
  const allNews = [...dbNews, ...data];
  const uniqueNewsMap = new Map<string, Samachar>();
  
  allNews.forEach(item => {
    if (!uniqueNewsMap.has(item.slug)) {
      uniqueNewsMap.set(item.slug, item);
    }
  });

  return Array.from(uniqueNewsMap.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getSamachar(slug: string): Promise<Samachar | null> {
  try {
    const sql = await import('./server').then(m => m.db());
    if (sql) {
      const results = await sql`SELECT * FROM samachar WHERE slug = ${slug} AND status = 'PUBLISHED'`;
      if (results.length > 0) {
        const row = results[0];
        return {
          slug: row.slug,
          title: row.title,
          date: row.updated_at,
          category: row.category,
          author: 'Sarkari Yojana Desk',
          imageUrl: row.image_url || undefined,
          body: typeof row.body === 'string' ? JSON.parse(row.body) : row.body,
          summary: row.summary,
          changes: row.changes || undefined,
          affected: row.affected || undefined,
          sourceUrl: row.source_url || undefined,
          schemeSlugs: Array.isArray(row.scheme_slugs) ? row.scheme_slugs : undefined,
        };
      }
    }
  } catch (error) {
    console.error('getSamachar error', error);
  }

  const data = samacharData as Samachar[];
  return data.find(s => s.slug === slug) || null;
}
