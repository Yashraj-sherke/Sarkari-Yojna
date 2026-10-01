import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, 'artifacts', 'scheme_drafts');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    // 1. Get all internal pages for linking
    const allRes = await pool.query("SELECT slug, data::jsonb->>'title' as title FROM schemes");
    const internalLinks = allRes.rows.map(r => `- https://www.sarkariyojanasetu.com/${r.slug} (${r.title})`).join('\n');

    // 2. Get remaining MP schemes
    const res = await pool.query("SELECT slug, data FROM schemes WHERE data::jsonb->>'state' = 'madhya-pradesh'");
    
    const remaining = [];
    for (const row of res.rows) {
      const data = JSON.parse(row.data);
      const hasDetailedDesc = Array.isArray(data.detailedDescription) && data.detailedDescription.length > 0;
      const isReviewed = data.editorial?.publicationStatus === 'REVIEWED';
      
      if (!hasDetailedDesc || !isReviewed) {
        remaining.push({ slug: row.slug, data });
      }
    }

    console.log(`Found ${remaining.length} remaining MP schemes to generate drafts for.`);

    // 3. Process each scheme (doing 3 as a test first, or maybe batches)
    // To respect rate limits and time, we'll do them sequentially or in small batches.
    for (let i = 0; i < remaining.length; i++) {
      const { slug, data } = remaining[i];
      const filePath = path.join(outputDir, `${slug}.md`);
      
      if (fs.existsSync(filePath)) {
        console.log(`[${i+1}/${remaining.length}] Skipping ${slug} (already generated)`);
        continue;
      }

      console.log(`[${i+1}/${remaining.length}] Generating draft for ${slug}...`);

      const prompt = `Act as a Hindi government-scheme researcher, editor, and SEO content strategist for Sarkari Yojana Setu:
https://www.sarkariyojanasetu.com

Create an original, accurate article that helps readers understand a scheme and complete the correct next step. Aim to provide more practical value than competing pages without copying them.

INPUTS
Scheme name: ${data.title} (${data.english || ''})
State or coverage: Madhya Pradesh
Existing article URL and content: https://www.sarkariyojanasetu.com/${slug}
Summary: ${data.summary || 'None'}
Benefit: ${data.benefit || 'None'}
Official scheme or department URLs: ${data.sourceUrl || 'None'}, ${data.applicationUrl || 'None'}
Existing internal pages available for linking:
${internalLinks}

Target language: Simple Hindi, with familiar English search terms where natural.

[... Rest of instructions applied ...]
1. RESEARCH FIRST: Use your knowledge to provide accurate details.
2. KEYWORD RESEARCH: Primary keyword based on this scheme.
3. COMPETITOR COMPARISON: Unanswered questions.
4. WRITE THE ARTICLE: (SEO title, Meta description, Suggested URL, H1, Quick facts, Main sections).
5. CONTEXTUAL INTERNAL LINKS: From the provided list.
6. OFFICIAL REFERENCES AND BACKLINK OPPORTUNITIES.
7. EDITORIAL CHECK.

FINAL OUTPUT
1. Keyword recommendations and their evidence.
2. Brief competitor content-gap analysis.
3. SEO title, description, and suggested URL.
4. Complete article in Markdown with contextual links.
5. Internal-link placement table and incoming-link suggestions.
6. Claim-to-source verification table.
7. Any unresolved facts requiring review.
8. One useful resource idea for earning genuine backlinks.

Generate the draft only. Do not publish or change website settings unless separately instructed.`;

      let success = false;
      let retries = 0;
      
      while (!success && retries < 3) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              temperature: 0.2,
            }
          });

          const draftContent = response.text;
          fs.writeFileSync(filePath, draftContent, 'utf-8');
          console.log(`Successfully generated and saved ${slug}.md`);
          success = true;
        } catch (err) {
          if (err.status === 429) {
            console.log(`Rate limited on ${slug}. Waiting 60 seconds...`);
            await new Promise(r => setTimeout(r, 60000));
            retries++;
          } else {
            console.error(`Failed to generate draft for ${slug}:`, err);
            break;
          }
        }
      }
      
      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 4500));
    }
    
    console.log("All drafts generated!");
  } finally {
    await pool.end();
  }
}
run();
