export type SchemeNavigationItem = { id: string; label: string };

type Topic = {
  key: string;
  label: string;
  sidebarLabel?: string;
  coreId?: string;
  match?: RegExp;
  sidebar?: boolean;
};

// Core slots use existing sections. Scheme-specific topics require a real target.
const schemeTopics: Record<string, Topic[]> = {
  'gobardhan-scheme': [
    {key: 'about', coreId: 'vivaran', match: /GOBARdhan.*क्या है/i, label: 'GOBARdhan Scheme क्या है?', sidebarLabel: 'योजना क्या है?'},
    {key: 'objective', match: /GOBARdhan.*उद्देश्य/i, label: 'GOBARdhan Scheme का उद्देश्य', sidebar: false},
    {key: 'latest', match: /2026.*GOBARdhan.*नई बात/i, label: '2026 की नवीनतम जानकारी', sidebarLabel: 'नवीनतम जानकारी'},
    {key: 'benefits', coreId: 'labh', label: 'GOBARdhan Scheme के मुख्य लाभ', sidebarLabel: 'मुख्य लाभ'},
    {key: 'capital', match: /CBG प्लांट.*कैपिटल/i, label: '₹2 करोड़ / TPD सहायता क्या है?', sidebarLabel: '₹2 करोड़ / TPD सहायता'},
    {key: 'eligibility', coreId: 'patrata', label: 'कौन आवेदन कर सकता है?', sidebarLabel: 'पात्रता'},
    {key: 'documents', coreId: 'dastavej', match: /जरूरी दस्तावेज और जानकारी/, label: 'जरूरी दस्तावेज'},
    {key: 'application', coreId: 'aavedan', match: /GOBARdhan.*आवेदन कैसे/i, label: 'आवेदन कैसे करें?', sidebarLabel: 'आवेदन प्रक्रिया'},
    {key: 'farmers', match: /किसानों को GOBARdhan.*फायदा/i, label: 'किसानों और पशुपालकों को क्या फायदा होगा?', sidebarLabel: 'किसान/पशुपालक लाभ'},
    {key: 'cbg', match: /CBG क्या होता है/i, label: 'CBG क्या है और इसका क्या संबंध है?', sidebarLabel: 'CBG'},
    {key: 'plant', match: /CBG क्षेत्र की स्थिति/i, label: 'Project / Plant से जुड़ी महत्वपूर्ण जानकारी', sidebarLabel: 'Project / Plant जानकारी'},
    {key: 'important', match: /^निष्कर्ष$/, label: 'महत्वपूर्ण बातें'},
    {key: 'faqs', coreId: 'faqs', label: 'अक्सर पूछे जाने वाले सवाल', sidebarLabel: 'FAQs'},
    {key: 'sources', coreId: 'sandarbh', label: 'आधिकारिक स्रोत और उपयोगी लिंक', sidebarLabel: 'आधिकारिक स्रोत'},
  ],
};

export function buildSchemeNavigation(slug: string, description: string[], core: SchemeNavigationItem[], language: 'hi' | 'en' = 'hi') {
  const topics = language === 'hi' ? schemeTopics[slug] : undefined;
  if (!topics) return {description, toc: core, sidebar: core, customized: false};

  const targets = new Map<string, string>();
  const coreIds = new Set(core.map(item => item.id));
  const annotated = description.map(html => html.replace(
    /<(h[2-6]|p)\b([^>]*)>([\s\S]*?)<\/\1>/gi,
    (markup: string, tag: string, attrs: string, body: string) => {
      const title = body.replace(/<[^>]+>/g, '').trim();
      // Only a short standalone document label may anchor a paragraph.
      const topic = topics.find(item => item.match?.test(title) && !targets.has(item.key) &&
        (tag.toLowerCase() !== 'p' || (item.key === 'documents' && title.length < 80)));
      if (!topic) return markup;
      const existingId = attrs.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1];
      const id = existingId || `scheme-topic-${topic.key}`;
      targets.set(topic.key, id);
      return existingId ? markup : `<${tag}${attrs} id="${id}" style="scroll-margin-top: 30px">${body}</${tag}>`;
    },
  ));

  const available = topics.flatMap(topic => {
    const id = targets.get(topic.key) || (topic.coreId && coreIds.has(topic.coreId) ? topic.coreId : undefined);
    return id ? [{topic, id}] : [];
  });
  return {
    description: annotated,
    toc: available.map(({topic, id}) => ({id, label: topic.label})),
    sidebar: available.filter(({topic}) => topic.sidebar !== false).map(({topic, id}) => ({id, label: topic.sidebarLabel || topic.label})),
    customized: true,
  };
}
