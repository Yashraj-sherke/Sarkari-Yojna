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
});

export type Samachar = z.infer<typeof samacharSchema>;

export function getSamacharRelatedSchemeSlugs(item: Pick<Samachar, 'body'>) {
  return [...new Set([...item.body.join('\n').matchAll(/href=['"]\/yojna\/([^'"/?#]+)['"]/gi)].map(match => match[1]))];
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
          summary: row.summary
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
          summary: row.summary
        };
      }
    }
  } catch (error) {
    console.error('getSamachar error', error);
  }

  const data = samacharData as Samachar[];
  return data.find(s => s.slug === slug) || null;
}
