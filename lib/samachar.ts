import { z } from 'zod';

export const samacharSchema = z.object({
  slug: z.string().max(100),
  title: z.string().min(5).max(180),
  date: z.string(), // ISO date string
  category: z.string(),
  author: z.string(),
  body: z.array(z.string()),
  summary: z.string().max(300),
});

export type Samachar = z.infer<typeof samacharSchema>;

// Mock data for demonstration
export const mockSamachar: Samachar[] = [
  {
    slug: 'pm-kisan-14th-installment-update',
    title: 'पीएम किसान 14वीं किस्त: किसानों के खाते में जल्द आएंगे पैसे',
    date: '2026-09-15T10:00:00Z',
    category: 'किसानों के लिए',
    author: 'डेस्क',
    summary: 'प्रधानमंत्री किसान सम्मान निधि योजना के तहत 14वीं किस्त का इंतजार कर रहे किसानों के लिए बड़ी खबर है।',
    body: [
      'प्रधानमंत्री किसान सम्मान निधि योजना के तहत 14वीं किस्त का इंतजार कर रहे किसानों के लिए बड़ी खबर है। सरकार जल्द ही किसानों के खाते में 2000 रुपये ट्रांसफर कर सकती है।',
      'कृषि मंत्रालय के सूत्रों के अनुसार, सभी तैयारियां पूरी कर ली गई हैं और अगले सप्ताह तक राशि ट्रांसफर होने की उम्मीद है।',
      'जिन किसानों ने अभी तक ई-केवाईसी (e-KYC) नहीं कराया है, वे जल्द से जल्द अपना केवाईसी पूरा कर लें, अन्यथा उन्हें इस किस्त का लाभ नहीं मिलेगा।'
    ]
  },
  {
    slug: 'ladli-behna-yojana-third-phase',
    title: 'लाडली बहना योजना: तीसरे चरण के आवेदन जल्द होंगे शुरू',
    date: '2026-09-18T14:30:00Z',
    category: 'महिलाओं के लिए',
    author: 'डेस्क',
    summary: 'मध्य प्रदेश सरकार की लोकप्रिय लाडली बहना योजना के तीसरे चरण के आवेदन की प्रक्रिया जल्द ही शुरू होने वाली है।',
    body: [
      'मध्य प्रदेश सरकार की लोकप्रिय लाडली बहना योजना के तीसरे चरण के आवेदन की प्रक्रिया जल्द ही शुरू होने वाली है।',
      'इस योजना के तहत अब तक लाखों महिलाओं को लाभ मिल चुका है। सरकार का लक्ष्य है कि कोई भी पात्र महिला इस योजना से वंचित न रहे।',
      'नए चरण में उन महिलाओं को मौका मिलेगा जो पहले और दूसरे चरण में आवेदन नहीं कर पाई थीं। आवेदन प्रक्रिया पूरी तरह से ऑनलाइन होगी।'
    ]
  }
];

export async function getAllSamachar(): Promise<Samachar[]> {
  // In the future, fetch from database or CMS
  return mockSamachar.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getSamachar(slug: string): Promise<Samachar | null> {
  // In the future, fetch from database or CMS
  return mockSamachar.find(s => s.slug === slug) || null;
}
