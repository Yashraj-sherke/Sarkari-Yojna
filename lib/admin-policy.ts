import { z } from 'zod';
import { schemeSchema, type Scheme } from './domain';

export const roles = ['SUPER_ADMIN', 'EDITOR', 'REVIEWER'] as const;
export type AdminRole = typeof roles[number];
export type Permission = 'edit' | 'review' | 'publish' | 'users' | 'settings';
export function permitted(role: AdminRole, permission: Permission) {
  return role === 'SUPER_ADMIN' || (role === 'EDITOR' && permission === 'edit') || (role === 'REVIEWER' && permission === 'review');
}
export const workflowStates = ['DRAFT', 'IN_REVIEW', 'REVIEWED', 'PUBLISHED', 'ARCHIVED'] as const;
export type WorkflowState = typeof workflowStates[number];
export const actions = ['submit', 'approve', 'return', 'publish', 'unpublish', 'archive', 'restore'] as const;
export type WorkflowAction = typeof actions[number];
export const reviewEvidenceSchema = z.object({
  benefits: z.literal(true), eligibility: z.literal(true), documents: z.literal(true), application: z.literal(true), sources: z.literal(true), schemeStatus:z.literal(true),
  note: z.string().trim().min(20).max(2000),
}).strict();
export function nextState(state: WorkflowState, action: WorkflowAction, role: AdminRole): WorkflowState {
  const required: Permission = action === 'approve' || action === 'return' ? 'review' : action === 'submit' ? 'edit' : 'publish';
  if (!permitted(role, required)) throw new Error('इस कार्य की अनुमति नहीं है।');
  const transitions: Partial<Record<WorkflowAction, Partial<Record<WorkflowState, WorkflowState>>>> = {
    submit: { DRAFT: 'IN_REVIEW' }, approve: { IN_REVIEW: 'REVIEWED' }, return: { IN_REVIEW: 'DRAFT', REVIEWED: 'DRAFT' },
    publish: { REVIEWED: 'PUBLISHED' }, unpublish: { PUBLISHED: 'DRAFT', DRAFT:'DRAFT', IN_REVIEW:'DRAFT', REVIEWED:'DRAFT' }, archive: { PUBLISHED: 'ARCHIVED', DRAFT:'ARCHIVED', IN_REVIEW:'ARCHIVED', REVIEWED:'ARCHIVED' }, restore: { ARCHIVED: 'DRAFT' },
  };
  const result = transitions[action]?.[state];
  if (!result) throw new Error('इस स्थिति में यह कार्य संभव नहीं है।');
  return result;
}

// Extend the established contract, including eligibility rules, translations and references.
export const importSchema = schemeSchema.innerType().extend({
  benefitsList:z.array(z.object({heading:z.string().trim().min(1),points:z.array(z.string().trim().min(1))}).strict()).optional(),
  applicationProcess:z.array(z.object({mode:z.string().trim().min(1),steps:z.array(z.string().trim().min(1))}).strict()).optional(),
  faqs:z.array(z.object({question:z.string().trim().min(1),answer:z.string().trim().min(1)}).strict()).optional(),
  benefitsListEn:z.array(z.object({heading:z.string().trim().min(1),points:z.array(z.string().trim().min(1))}).strict()).optional(),
  applicationProcessEn:z.array(z.object({mode:z.string().trim().min(1),steps:z.array(z.string().trim().min(1))}).strict()).optional(),
  faqsEn:z.array(z.object({question:z.string().trim().min(1),answer:z.string().trim().min(1)}).strict()).optional(),
  editorial:schemeSchema.innerType().shape.editorial.unwrap().strict().optional(),
  references:z.array(schemeSchema.innerType().shape.references.unwrap().element.strict()).optional(),
  rules:z.array(schemeSchema.innerType().shape.rules.element.innerType().strict()).max(20),
}).strict().superRefine((value, context) => {
  const parsed = schemeSchema.safeParse(value);
  if (!parsed.success) for (const issue of parsed.error.issues) context.addIssue(issue);
});
export function draftContent(input: unknown): Scheme {
  const value = importSchema.parse(input);
  return { ...value, verifiedAt: null, nextReviewAt: null, editorial: {
    verificationStatus: 'NEEDS_VERIFICATION', publicationStatus: 'DRAFT_REVIEW_REQUIRED', reviewedAt: null, note: '',
  } };
}
export function publishingIssues(value: Scheme, now = new Date()) {
  const errors: string[] = [];
  if([value.title,value.summary,value.benefit,value.department].some(field=>field.trim()==='सत्यापन आवश्यक'))errors.push('मुख्य तथ्य अभी सत्यापन आवश्यक हैं। वास्तविक स्रोत-समर्थित जानकारी भरें।');
  if (value.isSample) errors.push('नमूना योजना प्रकाशित नहीं हो सकती।');
  if(!['ACTIVE','CLOSED','ARCHIVED','NEEDS_REVIEW','UPDATE_REQUIRED'].includes(value.status))errors.push('योजना की वास्तविक संचालन स्थिति चुनें; draft/review प्रकाशन से अलग हैं।');
  if (!value.sourceUrl) errors.push('आधिकारिक स्रोत आवश्यक है।');
  if (!value.references?.length) errors.push('स्रोत संदर्भ और वास्तविक सत्यापन तिथि आवश्यक हैं।');
  for (const ref of value.references ?? []) {
    const date = ref.accessedAt ? new Date(ref.accessedAt) : null;
    if (!ref.title.trim() || !ref.organization.trim() || !ref.sections.length || ref.sections.some(section=>!section.trim()) || !date || !Number.isFinite(date.getTime()) || date > now) errors.push('हर संदर्भ में संस्था, संबंधित अनुभाग और वैध पिछली सत्यापन तिथि भरें।');
  }
  if (!value.detailedDescription?.length || !value.benefitsList?.length || !value.eligibilityDescription?.length) errors.push('विवरण, लाभ और पात्रता पूर्ण करें।');
  if (!value.applicationProcess?.length) errors.push('सत्यापित आवेदन प्रक्रिया आवश्यक है।');
  if(value.benefitsList?.some(group=>!group.heading.trim()||!group.points.length||group.points.some(point=>!point.trim()))) errors.push('लाभ समूहों में वास्तविक लाभ बिंदु भरें।');
  if(value.applicationProcess?.some(method=>!method.mode.trim()||!method.steps.length||method.steps.some(step=>!step.trim()))) errors.push('आवेदन माध्यम और सत्यापित चरण भरें।');
  if(value.eligibilityDescription?.some(condition=>!condition.trim())||value.detailedDescription?.some(paragraph=>!paragraph.trim())) errors.push('खाली विवरण / पात्रता हटाएँ।');
  return errors;
}
export const blankScheme: Scheme = {
  slug: '', title: '', english: '', category: 'kisan', state: 'central', summary: '', benefit: '', department: '',
  documents: [], steps: [], rules: [], sourceUrl: '', applicationUrl: '', sourceNotes: '', status: 'DRAFT', priority: false, isSample: false,
  verifiedAt: null, nextReviewAt: null, detailedDescription: [], benefitsList: [], eligibilityDescription: [], exclusions: [], applicationProcess: [], faqs: [], references: [],
};
