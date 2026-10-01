import { GoogleGenerativeAI, Schema, SchemaType as Type } from '@google/generative-ai';
import { seeds } from './lib/seed.ts';
import fs from 'fs';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { reviewedCorrections } from './lib/scheme-content/reviewed-corrections.ts';
import type { Scheme } from './lib/domain.ts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const sql = neon(process.env.DATABASE_URL!);

const promptTemplate = (schemeTitle: string, schemeSlug: string, schemeState: string, schemeSummary: string) => `
You are a senior Next.js engineer, Hindi/English bilingual content editor, technical SEO specialist, and fact-checker.

Your task is to fully research, create and format the content for the government scheme: "${schemeTitle}" (slug: ${schemeSlug}, state: ${schemeState}).
Original short summary: "${schemeSummary}"

REQUIREMENTS:
1. Provide content in BOTH Hindi and English exactly matching the JSON schema fields.
2. Direct Answer: A 40-80 word summary of the scheme (in Hindi for summary, English for summaryEn).
3. Detailed Description: Include internal links (e.g. [अन्य योजनाएं](/yojna)) and external official links (e.g. [Official Website](https://example.gov.in)) using markdown. No generic anchor texts like "click here".
4. Follow strict SEO tactics: accurate information, FAQ coverage (4-6 questions), Eligibility intent, Status Check, Documents, Online Apply steps.
5. "seoDescription": 120-150 character meta description.
6. Make sure to cover primary and secondary queries.
7. Return ONLY the raw JSON object matching the schema exactly.
`;

const schema: Schema = {
  type: Type.OBJECT,
  properties: {
    status: { type: Type.STRING },
    isSample: { type: Type.BOOLEAN },
    seoDescription: { type: Type.STRING },
    summary: { type: Type.STRING },
    summaryEn: { type: Type.STRING },
    detailedDescription: { type: Type.ARRAY, items: { type: Type.STRING } },
    detailedDescriptionEn: { type: Type.ARRAY, items: { type: Type.STRING } },
    benefitsList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { heading: { type: Type.STRING }, points: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["heading", "points"]
      }
    },
    benefitsListEn: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { heading: { type: Type.STRING }, points: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["heading", "points"]
      }
    },
    eligibilityDescription: { type: Type.ARRAY, items: { type: Type.STRING } },
    eligibilityDescriptionEn: { type: Type.ARRAY, items: { type: Type.STRING } },
    exclusions: { type: Type.ARRAY, items: { type: Type.STRING } },
    exclusionsEn: { type: Type.ARRAY, items: { type: Type.STRING } },
    documents: { type: Type.ARRAY, items: { type: Type.STRING } },
    documentsEn: { type: Type.ARRAY, items: { type: Type.STRING } },
    applicationProcess: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { mode: { type: Type.STRING }, steps: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["mode", "steps"]
      }
    },
    applicationProcessEn: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { mode: { type: Type.STRING }, steps: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["mode", "steps"]
      }
    },
    trackingGuidance: { type: Type.STRING },
    practicalGuidance: { type: Type.ARRAY, items: { type: Type.STRING } },
    faqs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } },
        required: ["question", "answer"]
      }
    },
    faqsEn: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } },
        required: ["question", "answer"]
      }
    },
    sourceNotes: { type: Type.STRING },
    editorial: {
      type: Type.OBJECT,
      properties: {
        verificationStatus: { type: Type.STRING },
        publicationStatus: { type: Type.STRING },
        reviewedAt: { type: Type.STRING },
        note: { type: Type.STRING }
      },
      required: ["verificationStatus", "publicationStatus", "reviewedAt", "note"]
    }
  },
  required: [
    "status", "isSample", "seoDescription", "summary", "summaryEn", "detailedDescription", "detailedDescriptionEn",
    "benefitsList", "benefitsListEn", "eligibilityDescription", "eligibilityDescriptionEn", "exclusions", "exclusionsEn",
    "documents", "documentsEn", "applicationProcess", "applicationProcessEn", "trackingGuidance", "practicalGuidance", 
    "faqs", "faqsEn", "sourceNotes", "editorial"
  ]
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function run() {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.8-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    }
  });

  const rows = await sql`SELECT slug, data FROM schemes`;
  const existingDbSlugs = new Set(rows.map(r => r.slug));

  const toProcess = seeds.filter(s => {
    if (reviewedCorrections[s.slug]) return false;
    const dbRow = rows.find(r => r.slug === s.slug);
    if (dbRow) {
      try {
        const parsed = JSON.parse(dbRow.data);
        if (parsed.status === 'ACTIVE' && parsed.editorial?.note?.includes('AI')) {
          return false;
        }
      } catch (e) {}
    }
    return true;
  });

  console.log(`Found ${toProcess.length} schemes to process...`);

  for (let i = 0; i < toProcess.length; i++) {
    const s = toProcess[i];
    console.log(`[${i+1}/${toProcess.length}] Processing ${s.title} (${s.slug})...`);
    
    let success = false;
    let attempts = 0;
    while (!success && attempts < 100) {
      try {
        const result = await model.generateContent(promptTemplate(s.title, s.slug, s.state, s.summary));
        const response = result.response;
        const jsonText = response.text();
        
        const aiData = JSON.parse(jsonText);
        
        const finalData: Scheme = {
          ...s,
          ...aiData
        };
        
        const jsonData = JSON.stringify(finalData);

        if (existingDbSlugs.has(s.slug)) {
          await sql`UPDATE schemes SET data = ${jsonData}, updated_at = NOW() WHERE slug = ${s.slug}`;
        } else {
          await sql`INSERT INTO schemes (slug, data) VALUES (${s.slug}, ${jsonData})`;
        }

        console.log(`✅ Successfully updated ${s.slug} in DB`);
        success = true;
        
      } catch (e: any) {
        if (e.status === 429 || e.status === 503) {
          console.log(`⏳ Rate limited or 503 on ${s.slug} (Error: ${e.statusText || e.message}), waiting 65 seconds...`);
          await delay(65000);
          attempts++;
        } else {
          console.error(`❌ Failed for ${s.slug}:`, e);
          attempts++;
          await delay(65000);
        }
      }
    }
    
    if (success) await delay(1000);
  }
  
  console.log('All done!');
}

run();
