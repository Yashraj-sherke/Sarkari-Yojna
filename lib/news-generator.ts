import { GoogleGenAI } from '@google/genai';

async function getEnv(key: string): Promise<string | undefined> {
  if (typeof process !== 'undefined' && process.env[key]) return process.env[key];
  try {
    // @ts-ignore
    const cf = await import(/* webpackIgnore: true */ "cloudflare:workers");
    if (cf && cf.env) {
      const env = cf.env as Record<string, any>;
      if (env[key]) return env[key];
    }
  } catch {}
  return undefined;
}

export async function generateDailyNewsDraft(topic = "trendy question the public is currently asking") {
  const apiKey = await getEnv('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert news editor for the Sarkari Yojna website (a platform detailing Indian government schemes in Hindi and English).
Generate a trending daily news draft (Samachar) about: ${topic}. Focus on government schemes, subsidies, or citizen services.
The response MUST be a valid JSON object with the following fields:
- "title": A catchy, SEO-friendly title in Hindi (up to 100 characters).
- "summary": A brief 1-2 sentence summary of the news in Hindi.
- "category": A category name (e.g. "Trending News", "Yojana Update", "Farmer's Scheme").
- "body": An array of strings, where each string is a paragraph of the news article in Hindi. Use simple HTML tags like <strong>, <em>, <h3> if needed. Make the article detailed and helpful.

Do NOT include markdown formatting like \`\`\`json around the response. Return ONLY the raw JSON object.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  const text = response.text;
  if (!text) throw new Error('No response text from Gemini');

  let aiDraft;
  try {
    aiDraft = JSON.parse(text);
  } catch (err) {
    throw new Error('Failed to parse Gemini response as JSON: ' + text);
  }

  const id = Math.random().toString(36).substring(2, 8);
  const slug = `trending-news-${id}`;
  const now = new Date().toISOString();

  return {
    slug,
    title: aiDraft.title || 'Untitled AI Draft',
    summary: aiDraft.summary || 'No summary provided',
    category: aiDraft.category || 'Trending News',
    imageUrl: `/images/samachar/pm-kisan.jpg`,
    body: aiDraft.body || ['News content coming soon.'],
    status: 'DRAFT',
    createdAt: now,
    updatedAt: now,
  };
}

export async function generateNewSchemeDraft() {
  const apiKey = await getEnv('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a researcher for the Sarkari Yojna website. Find a recently announced or highly trending Indian government scheme (either Central or Madhya Pradesh) and draft its details.
The response MUST be a valid JSON object matching this strict structure:
{
  "title": "Hindi Name of the Scheme (min 5, max 180 chars)",
  "english": "English Name of the Scheme (max 180 chars)",
  "category": "Must be one of: kisan, mahila, shiksha, swasthya, awas, rojgar, pension, khadya",
  "state": "Must be either 'central' or 'madhya-pradesh'",
  "summary": "Brief summary in Hindi (min 10, max 1500 chars)",
  "benefit": "Main benefit description in Hindi (min 3, max 600 chars)",
  "department": "Name of the government department in Hindi",
  "documents": ["Aadhaar Card", "Bank Passbook"], // Array of required documents in Hindi (max 20 items)
  "steps": ["Step 1 description", "Step 2 description"], // Array of application steps in Hindi (max 20 items)
  "sourceUrl": "https://www.india.gov.in", // Must be a valid HTTPS .gov.in or .nic.in URL
  "applicationUrl": "https://www.india.gov.in", // Must be a valid HTTPS .gov.in or .nic.in URL or empty string
  "sourceNotes": "Drafted by AI",
  "priority": false
}
Do NOT include markdown formatting like \`\`\`json around the response. Return ONLY the raw JSON object.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  const text = response.text;
  if (!text) throw new Error('No response text from Gemini');

  let draft;
  try {
    draft = JSON.parse(text);
  } catch (err) {
    throw new Error('Failed to parse Gemini response as JSON: ' + text);
  }

  const id = Math.random().toString(36).substring(2, 8);
  const slug = `new-scheme-${id}`;

  return {
    slug,
    title: draft.title || 'New AI Scheme Draft',
    english: draft.english || 'New AI Scheme Draft',
    category: draft.category || 'kisan',
    state: draft.state || 'central',
    summary: draft.summary || 'Summary coming soon.',
    benefit: draft.benefit || 'Benefit details coming soon.',
    department: draft.department || 'Government of India',
    documents: draft.documents || ['Aadhaar Card'],
    steps: draft.steps || ['Visit the official website.'],
    rules: [],
    sourceUrl: draft.sourceUrl || 'https://www.india.gov.in',
    applicationUrl: draft.applicationUrl || '',
    sourceNotes: draft.sourceNotes || 'AI Draft',
    status: 'DRAFT',
    priority: draft.priority || false,
    isSample: false,
    verifiedAt: null,
    nextReviewAt: null
  };
}

