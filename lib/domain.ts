import type { SchemeSummary } from './scheme-summary';
import { z } from 'zod';
import Fuse from 'fuse.js';

export const categories = [
  { id: 'kisan', name: 'किसान और कृषि', short: 'किसान', icon: 'Sprout', color: 'green' },
  { id: 'mahila', name: 'महिला और बाल विकास', short: 'महिलाएं', icon: 'HeartHandshake', color: 'rose' },
  { id: 'shiksha', name: 'शिक्षा और छात्रवृत्ति', short: 'विद्यार्थी', icon: 'GraduationCap', color: 'blue' },
  { id: 'swasthya', name: 'स्वास्थ्य और देखभाल', short: 'स्वास्थ्य', icon: 'HeartPulse', color: 'red' },
  { id: 'awas', name: 'आवास और बुनियादी सुविधा', short: 'आवास', icon: 'House', color: 'orange' },
  { id: 'rojgar', name: 'रोज़गार और स्वरोज़गार', short: 'रोज़गार', icon: 'BriefcaseBusiness', color: 'purple' },
  { id: 'pension', name: 'पेंशन और सामाजिक सुरक्षा', short: 'वरिष्ठ नागरिक', icon: 'Accessibility', color: 'teal' },
  { id: 'khadya', name: 'खाद्य और राशन', short: 'राशन', icon: 'Wheat', color: 'amber' },
] as const;
export const profileSchema = z.object({
  state: z.enum(['madhya-pradesh', 'other']).optional(),
  age: z.number().int().min(0).max(120).optional(),
  gender: z.enum(['female', 'male', 'other']).optional(),
  occupation: z.enum(['farmer', 'student', 'worker', 'self-employed', 'other']).optional(),
  income: z.number().min(0).max(100000000).optional(),
  rural: z.boolean().optional(),
}).strict();
export type Profile = z.infer<typeof profileSchema>;
export const ruleSchema = z.object({ field: z.enum(['state','age','gender','occupation','income','rural']), op: z.enum(['eq','lte','gte']), value: z.union([z.string().max(80),z.number(),z.boolean()]), label: z.string().min(1).max(250) }).superRefine((r: any,c: any)=>{
  const numeric=r.field==='age'||r.field==='income';
  if(numeric && (typeof r.value!=='number'||r.value<0)) c.addIssue({code:'custom',message:'Numeric rule requires a nonnegative number'});
  if(!numeric && r.op!=='eq') c.addIssue({code:'custom',message:'Only numeric fields support comparisons'});
  if(r.field==='rural' && typeof r.value!=='boolean') c.addIssue({code:'custom',message:'Rural must be boolean'});
  const allowed:Record<string,string[]>={state:['madhya-pradesh','other'],gender:['female','male','other'],occupation:['farmer','student','worker','self-employed','other']};
  if(allowed[r.field]&&!allowed[r.field].includes(String(r.value))) c.addIssue({code:'custom',message:'Invalid rule value'});
});
export type Rule = z.infer<typeof ruleSchema>;
export function officialUrl(value:string) { try { const u=new URL(value); return u.protocol==='https:'&&!u.username&&!u.password&&(/\.(gov|nic)\.in$/.test(u.hostname)||u.hostname==='myscheme.gov.in'); } catch { return false; } }
const official = z.string().max(1500).refine((v: any)=>v===''||officialUrl(v),'Use an HTTPS government .gov.in or .nic.in URL');
export const schemeSchema = z.object({
  slug:z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/).max(100), title:z.string().min(5).max(180), english:z.string().max(180),
  category:z.string().refine(v=>categories.some(c=>c.id===v)), state:z.enum(['central','madhya-pradesh']),
  summary:z.string().min(10).max(1500), benefit:z.string().min(3).max(600), department:z.string().min(2).max(180),
  documents:z.array(z.string().min(1).max(250)).max(20), steps:z.array(z.string().min(1).max(500)).max(20), rules:z.array(ruleSchema).max(20),
  sourceUrl:official, applicationUrl:official, sourceNotes:z.string().max(2000),
  status:z.enum(['REQUIRES_OFFICIAL_VERIFICATION','ACTIVE','NEEDS_REVIEW','ARCHIVED','CLOSED']),
  priority:z.boolean(), isSample:z.boolean(), verifiedAt:z.string().nullable(), nextReviewAt:z.string().nullable(),
  detailedDescription: z.array(z.string()).optional(),
  benefitsList: z.array(z.object({ heading: z.string(), points: z.array(z.string()) })).optional(),
  eligibilityDescription: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  applicationProcess: z.array(z.object({ mode: z.string(), steps: z.array(z.string()) })).optional(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  lastUpdated: z.string().optional(),
  editorial: z.object({
    verificationStatus: z.enum(['VERIFIED_CORE', 'NEEDS_VERIFICATION']),
    publicationStatus: z.enum(['REVIEWED', 'DRAFT_REVIEW_REQUIRED']),
    reviewedAt: z.string().nullable(),
    note: z.string(),
  }).optional(),
  references: z.array(z.object({ title: z.string(), organization: z.string(), url: official, sections: z.array(z.string()), accessedAt: z.string().nullable(), note: z.string().optional() })).optional(),
  practicalGuidance: z.array(z.string()).optional(),
  trackingGuidance: z.string().optional(),
  // English Translation Fields
  summaryEn: z.string().optional(),
  benefitEn: z.string().optional(),
  documentsEn: z.array(z.string()).optional(),
  stepsEn: z.array(z.string()).optional(),
  detailedDescriptionEn: z.array(z.string()).optional(),
  benefitsListEn: z.array(z.object({ heading: z.string(), points: z.array(z.string()) })).optional(),
  eligibilityDescriptionEn: z.array(z.string()).optional(),
  exclusionsEn: z.array(z.string()).optional(),
  applicationProcessEn: z.array(z.object({ mode: z.string(), steps: z.array(z.string()) })).optional(),
  faqsEn: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
}).superRefine((s: any,c: any)=>{
  if(s.status==='ACTIVE' && (!s.sourceUrl||s.isSample)) c.addIssue({code:'custom',message:'Active schemes need an official source and must not be sample records'});
  const mins=new Map<string,number>(),maxs=new Map<string,number>(),equals=new Map<string,unknown>();
  for(const r of s.rules){if(r.op==='gte')mins.set(r.field,Math.max(mins.get(r.field)??-Infinity,Number(r.value)));if(r.op==='lte')maxs.set(r.field,Math.min(maxs.get(r.field)??Infinity,Number(r.value)));if(r.op==='eq'){if(equals.has(r.field)&&equals.get(r.field)!==r.value)c.addIssue({code:'custom',message:'Conflicting equality rules'});equals.set(r.field,r.value);}}
  for(const [f,min]of mins)if(min>(maxs.get(f)??Infinity))c.addIssue({code:'custom',message:'Conflicting numeric rules'});
  for(const [f,v]of equals)if(typeof v==='number'&&(v<(mins.get(f)??-Infinity)||v>(maxs.get(f)??Infinity)))c.addIssue({code:'custom',message:'Conflicting exact and range rules'});
});
export type Scheme = z.infer<typeof schemeSchema>;
export function effectiveStatus(s:Pick<Scheme, 'status' | 'nextReviewAt'>,now=new Date()){return s.status==='ACTIVE'&&(!s.nextReviewAt||new Date(s.nextReviewAt)<=now)?'NEEDS_REVIEW':s.status;}

const searchSynonyms: Record<string, string[]> = {
  awas: ['house', 'housing', 'ghar', 'makan', 'aawas', 'shahri', 'urban', 'gramin', 'rural', 'pmay'],
  kisan: ['krishi', 'farmer', 'kheti', 'agriculture', 'farming', 'fasal', 'crop', 'bima'],
  mahila: ['women', 'woman', 'aurat', 'girl', 'nari', 'beti', 'kanya', 'ladli', 'behna', 'laxmi', 'sukanya', 'samriddhi'],
  shiksha: ['education', 'padhai', 'student', 'school', 'college', 'scholarship', 'chatrvati', 'chatravriti', 'chhatravriti', 'chhatravrity', 'छात्रवृत्ति'],
  swasthya: ['health', 'medical', 'hospital', 'ilaj', 'bima', 'insurance', 'ayushman'],
  rojgar: ['employment', 'job', 'naukri', 'kaushal', 'skill', 'business', 'vyapar', 'loan', 'mudra', 'vishwakarma', 'svanidhi'],
  pension: ['old', 'age', 'vridha', 'vridhavastha', 'atal', 'retirement', 'social', 'security'],
  bima: ['insurance', 'suraksha', 'jeevan', 'jyoti', 'policy', 'premium'],
  khadya: ['ration', 'food', 'anaj', 'bhojan']
};

function getSearchSynonyms(term: string): string[] {
  const termLower = term.toLowerCase();
  for (const [key, related] of Object.entries(searchSynonyms)) {
    if (key === termLower || related.includes(termLower)) {
      return [key, ...related];
    }
  }
  return [termLower];
}

export function searchSchemes<T extends SchemeSummary>(items: T[], q = '', category = 'all', state = 'all') {
  const filtered = items.filter(s => 
    !['ARCHIVED', 'CLOSED'].includes(s.status) &&
    (category === 'all' || s.category === category) &&
    (state === 'all' || s.state === 'central' || s.state === state)
  );

  const originalTerms = q.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!originalTerms.length) {
    return filtered.sort((a, b) => Number(effectiveStatus(b) === 'ACTIVE') - Number(effectiveStatus(a) === 'ACTIVE'));
  }

  const fuse = new Fuse(filtered, {
    keys: ['title', 'english', 'summary', 'category', 'department', 'benefit', 'slug'],
    threshold: 0.3,
    ignoreLocation: true,
  });

  const termGroups = originalTerms.map(term => getSearchSynonyms(term));

  let validItems = new Set(filtered);

  for (const group of termGroups) {
    const groupMatches = new Set<T>();
    for (const syn of group) {
      const results = fuse.search(syn);
      for (const r of results) {
        groupMatches.add(r.item);
      }
    }
    // Intersect validItems with groupMatches
    validItems = new Set([...validItems].filter(x => groupMatches.has(x)));
  }

  return Array.from(validItems).sort((a, b) => Number(effectiveStatus(b) === 'ACTIVE') - Number(effectiveStatus(a) === 'ACTIVE'));
}
export function evaluate(s:Scheme,p:Profile) {
  const rules:Rule[]=[...(s.state==='madhya-pradesh'?[{field:'state' as const,op:'eq' as const,value:'madhya-pradesh',label:'मध्य प्रदेश के निवासी'}]:[]),...s.rules];
  const reasons=rules.map(r=>{const v=p[r.field];const result=v===undefined?'unknown':(r.op==='eq'?v===r.value:r.op==='gte'?Number(v)>=Number(r.value):Number(v)<=Number(r.value))?'match':'no';return{label:r.label,result};});
  const matches=reasons.filter(r=>r.result==='match').length, missing=reasons.filter(r=>r.result==='unknown').length;
  const blocked=reasons.some(r=>r.result==='no')||['ARCHIVED','CLOSED'].includes(s.status);
  return {scheme:s,reasons,missing,blocked,score:blocked?0:Math.round(matches/Math.max(1,rules.length)*100),trust:effectiveStatus(s)==='ACTIVE'?1:0};
}
export function rankSchemes(s:Scheme[],p:Profile){return s.map(x=>evaluate(x,p)).filter(x=>!x.blocked).sort((a,b)=>b.trust-a.trust||b.score-a.score);}
export const reportSchema=z.object({slug:z.string().max(100),reason:z.enum(['wrong-benefit','wrong-eligibility','broken-link','closed','outdated','contact','other']),detail:z.string().max(1000)}).strict();
export const reminderSchema=z.object({slug:z.string().max(100),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/)}).strict();
export const statusLabels:Record<string,string>={ACTIVE:'स्रोत से सत्यापित',REQUIRES_OFFICIAL_VERIFICATION:'सत्यापन बाकी',NEEDS_REVIEW:'दोबारा समीक्षा जरूरी',ARCHIVED:'संग्रहित',CLOSED:'योजना बंद'};
