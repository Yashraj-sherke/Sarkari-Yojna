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
  'rani-durgavati-shri-anna-protsahan-yojana': [
    {key: 'about', coreId: 'vivaran', match: /रानी दुर्गावती श्रीअन्न.*क्या है/i, label: 'योजना क्या है?', sidebarLabel: 'योजना क्या है?'},
    {key: 'highlights', match: /मुख्य जानकारी/i, label: 'मुख्य जानकारी', sidebarLabel: 'मुख्य जानकारी'},
    {key: 'objective', match: /^रानी दुर्गावती श्रीअन्न योजना का उद्देश्य$/, label: 'योजना का उद्देश्य', sidebarLabel: 'उद्देश्य'},
    {key: 'benefits', coreId: 'labh', match: /लाभ मिलता है/i, label: 'कितना लाभ मिलता है?', sidebarLabel: 'कितना लाभ मिलता है?'},
    {key: 'prices', match: /उपार्जन मूल्य/i, label: 'उपार्जन मूल्य', sidebarLabel: 'उपार्जन मूल्य'},
    {key: 'stats', match: /पंजीयन कराया/i, label: 'पंजीकरण आंकड़े', sidebarLabel: 'पंजीकरण आंकड़े'},
    {key: 'reg_date_old', match: /2025-26.*पंजीयन कब/i, label: '2025-26 पंजीयन तारीख', sidebarLabel: '2025-26 पंजीयन'},
    {key: 'reg_date_new', match: /2026-27.*पंजीयन कब/i, label: '2026-27 पंजीयन तारीख', sidebarLabel: '2026-27 पंजीयन'},
    {key: 'districts', match: /जिले शामिल/i, label: 'शामिल जिले', sidebarLabel: 'शामिल जिले'},
    {key: 'eligibility', coreId: 'patrata', match: /कौन पात्र है/i, label: 'कौन पात्र है?', sidebarLabel: 'पात्रता'},
    {key: 'documents', coreId: 'dastavej', match: /जरूरी दस्तावेज/i, label: 'जरूरी दस्तावेज', sidebarLabel: 'जरूरी दस्तावेज'},
    {key: 'application', coreId: 'aavedan', match: /आवेदन कैसे/i, label: 'आवेदन कैसे करें?', sidebarLabel: 'आवेदन प्रक्रिया'},
    {key: 'bonus_vs_hectare', match: /बोनस और ₹3,900/i, label: 'बोनस vs ₹3,900 सहायता', sidebarLabel: 'बोनस vs सहायता'},
    {key: 'what_is_shri_anna', match: /श्रीअन्न क्या है/i, label: 'श्रीअन्न क्या है?', sidebarLabel: 'श्रीअन्न क्या है?'},
    {key: 'status_2026', match: /2026 में.*स्थिति/i, label: '2026 में योजना की स्थिति', sidebarLabel: '2026 में स्थिति'},
    {key: 'important', match: /महत्वपूर्ण सूचना/i, label: 'महत्वपूर्ण सूचना', sidebarLabel: 'महत्वपूर्ण सूचना'},
    {key: 'sources', coreId: 'sandarbh', match: /आधिकारिक स्रोत/i, label: 'आधिकारिक स्रोत', sidebarLabel: 'आधिकारिक स्रोत'},
    {key: 'conclusion', match: /^निष्कर्ष$/, label: 'निष्कर्ष', sidebarLabel: 'निष्कर्ष'},
  ],
  'deendayal-antodaya-rasoi-yojana': [
    {key: 'about', coreId: 'vivaran', match: /दीनदयाल रसोई योजना क्या है/i, label: 'दीनदयाल रसोई योजना क्या है?', sidebarLabel: 'योजना क्या है?'},
    {key: 'objective', match: /दीनदयाल रसोई योजना का उद्देश्य/i, label: 'दीनदयाल रसोई योजना का उद्देश्य', sidebarLabel: 'उद्देश्य'},
    {key: 'price', match: /खाना कितने रुपये में मिलता है/i, label: 'खाना कितने रुपये में मिलता है? (₹5 या ₹10)', sidebarLabel: 'भोजन दर (₹5)'},
    {key: 'eligibility', coreId: 'patrata', match: /कौन खाना खा सकता है/i, label: 'कौन खाना खा सकता है? (पात्रता)', sidebarLabel: 'पात्रता'},
    {key: 'how_to_avail', match: /लाभ कैसे लें/i, label: 'दीनदयाल रसोई योजना का लाभ कैसे लें?', sidebarLabel: 'लाभ कैसे लें'},
    {key: 'online_apply', match: /ऑनलाइन आवेदन करना पड़ता है/i, label: 'क्या ऑनलाइन आवेदन करना पड़ता है?', sidebarLabel: 'ऑनलाइन आवेदन'},
    {key: 'timing', match: /दीनदयाल रसोई का समय क्या है/i, label: 'दीनदयाल रसोई का समय क्या है?', sidebarLabel: 'रसोई का समय'},
    {key: 'centers_count', match: /केंद्र लिस्ट MP: कितने केंद्र हैं/i, label: 'केंद्र लिस्ट MP: कितने केंद्र हैं?', sidebarLabel: 'केंद्रों की संख्या'},
    {key: 'find_center', match: /नजदीक कहां है.*लिस्ट कैसे देखें/i, label: 'नजदीकी केंद्र कैसे खोजें?', sidebarLabel: 'नजदीकी केंद्र'},
    {key: 'menu', match: /कौन सा खाना मिलता है/i, label: 'दीनदयाल रसोई में कौन सा खाना मिलता है? (मेन्यू)', sidebarLabel: 'मेन्यू'},
    {key: 'documents', coreId: 'dastavej', match: /दस्तावेज चाहिए/i, label: 'कौन से दस्तावेज चाहिए?', sidebarLabel: 'दस्तावेज'},
    {key: 'mobile_kitchen', match: /चलित दीनदयाल रसोई/i, label: 'चलित दीनदयाल रसोई (Mobile Kitchen) क्या है?', sidebarLabel: 'चलित रसोई'},
    {key: 'workers', match: /मजदूरों के लिए क्यों जरूरी है/i, label: 'मजदूरों के लिए क्यों जरूरी है?', sidebarLabel: 'मजदूरों के लिए लाभ'},
    {key: 'state_coverage', match: /पूरे मध्य प्रदेश में है/i, label: 'क्या पूरे मध्य प्रदेश में लागू है?', sidebarLabel: 'योजना दायरा'},
    {key: 'start_date', match: /कब शुरू हुई/i, label: 'दीनदयाल रसोई योजना कब शुरू हुई?', sidebarLabel: 'शुरुआत'},
    {key: 'at_a_glance', match: /एक नजर में/i, label: 'दीनदयाल रसोई योजना 2026: एक नजर में', sidebarLabel: 'एक नजर में'},
    {key: 'faqs', coreId: 'faqs', match: /अक्सर पूछे जाने वाले सवाल/i, label: 'अक्सर पूछे जाने वाले सवाल', sidebarLabel: 'FAQs'},
    {key: 'important', match: /महत्वपूर्ण सूचना/i, label: 'महत्वपूर्ण सूचना', sidebarLabel: 'महत्वपूर्ण सूचना'},
    {key: 'sources', coreId: 'sandarbh', match: /आधिकारिक स्रोत/i, label: 'आधिकारिक स्रोत', sidebarLabel: 'आधिकारिक स्रोत'},
    {key: 'conclusion', match: /^निष्कर्ष$/, label: 'निष्कर्ष', sidebarLabel: 'निष्कर्ष'},
  ],
  'deendayal-rasoi-yojana': [
    {key: 'about', coreId: 'vivaran', match: /दीनदयाल रसोई योजना क्या है/i, label: 'दीनदयाल रसोई योजना क्या है?', sidebarLabel: 'योजना क्या है?'},
    {key: 'objective', match: /दीनदयाल रसोई योजना का उद्देश्य/i, label: 'दीनदयाल रसोई योजना का उद्देश्य', sidebarLabel: 'उद्देश्य'},
    {key: 'price', match: /खाना कितने रुपये में मिलता है/i, label: 'खाना कितने रुपये में मिलता है? (₹5 या ₹10)', sidebarLabel: 'भोजन दर (₹5)'},
    {key: 'eligibility', coreId: 'patrata', match: /कौन खाना खा सकता है/i, label: 'कौन खाना खा सकता है? (पात्रता)', sidebarLabel: 'पात्रता'},
    {key: 'how_to_avail', match: /लाभ कैसे लें/i, label: 'दीनदयाल रसोई योजना का लाभ कैसे लें?', sidebarLabel: 'लाभ कैसे लें'},
    {key: 'online_apply', match: /ऑनलाइन आवेदन करना पड़ता है/i, label: 'क्या ऑनलाइन आवेदन करना पड़ता है?', sidebarLabel: 'ऑनलाइन आवेदन'},
    {key: 'timing', match: /दीनदयाल रसोई का समय क्या है/i, label: 'दीनदयाल रसोई का समय क्या है?', sidebarLabel: 'रसोई का समय'},
    {key: 'centers_count', match: /केंद्र लिस्ट MP: कितने केंद्र हैं/i, label: 'केंद्र लिस्ट MP: कितने केंद्र हैं?', sidebarLabel: 'केंद्रों की संख्या'},
    {key: 'find_center', match: /नजदीक कहां है.*लिस्ट कैसे देखें/i, label: 'नजदीकी केंद्र कैसे खोजें?', sidebarLabel: 'नजदीकी केंद्र'},
    {key: 'menu', match: /कौन सा खाना मिलता है/i, label: 'दीनदयाल रसोई में कौन सा खाना मिलता है? (मेन्यू)', sidebarLabel: 'मेन्यू'},
    {key: 'documents', coreId: 'dastavej', match: /दस्तावेज चाहिए/i, label: 'कौन से दस्तावेज चाहिए?', sidebarLabel: 'दस्तावेज'},
    {key: 'mobile_kitchen', match: /चलित दीनदयाल रसोई/i, label: 'चलित दीनदयाल रसोई (Mobile Kitchen) क्या है?', sidebarLabel: 'चलित रसोई'},
    {key: 'workers', match: /मजदूरों के लिए क्यों जरूरी है/i, label: 'मजदूरों के लिए क्यों जरूरी है?', sidebarLabel: 'मजदूरों के लिए लाभ'},
    {key: 'state_coverage', match: /पूरे मध्य प्रदेश में है/i, label: 'क्या पूरे मध्य प्रदेश में लागू है?', sidebarLabel: 'योजना दायरा'},
    {key: 'start_date', match: /कब शुरू हुई/i, label: 'दीनदयाल रसोई योजना कब शुरू हुई?', sidebarLabel: 'शुरुआत'},
    {key: 'at_a_glance', match: /एक नजर में/i, label: 'दीनदयाल रसोई योजना 2026: एक नजर में', sidebarLabel: 'एक नजर में'},
    {key: 'faqs', coreId: 'faqs', match: /अक्सर पूछे जाने वाले सवाल/i, label: 'अक्सर पूछे जाने वाले सवाल', sidebarLabel: 'FAQs'},
    {key: 'important', match: /महत्वपूर्ण सूचना/i, label: 'महत्वपूर्ण सूचना', sidebarLabel: 'महत्वपूर्ण सूचना'},
    {key: 'sources', coreId: 'sandarbh', match: /आधिकारिक स्रोत/i, label: 'आधिकारिक स्रोत', sidebarLabel: 'आधिकारिक स्रोत'},
    {key: 'conclusion', match: /^निष्कर्ष$/, label: 'निष्कर्ष', sidebarLabel: 'निष्कर्ष'},
  ],
  'social-security-pension-portal-mp': [
    {key: 'about', coreId: 'vivaran', match: /Social Security Pension Portal MP क्या है/i, label: 'Portal क्या है?', sidebarLabel: 'Portal क्या है?'},
    {key: 'services', match: /कौन-कौन सी सुविधाएं/i, label: 'उपलब्ध सुविधाएं', sidebarLabel: 'सुविधाएं'},
    {key: 'amount', match: /कितनी पेंशन/i, label: 'पेंशन राशि (₹600)', sidebarLabel: 'पेंशन राशि'},
    {key: 'eligibility', coreId: 'patrata', match: /कौन पात्र है/i, label: 'कौन पात्र है?', sidebarLabel: 'पात्रता'},
    {key: 'documents', coreId: 'dastavej', match: /जरूरी दस्तावेज/i, label: 'जरूरी दस्तावेज', sidebarLabel: 'दस्तावेज'},
    {key: 'online_apply', coreId: 'aavedan', match: /Online Apply कैसे करें/i, label: 'Online Apply कैसे करें?', sidebarLabel: 'Online Apply'},
    {key: 'offline_apply', match: /Offline आवेदन/i, label: 'Offline आवेदन', sidebarLabel: 'Offline आवेदन'},
    {key: 'status', match: /Status कैसे Check करें/i, label: 'Status कैसे Check करें?', sidebarLabel: 'Status Check'},
    {key: 'stoppage', match: /Pension नहीं आ रही/i, label: 'Pension नहीं आ रही है तो क्या करें?', sidebarLabel: 'Pension stoppage'},
    {key: 'payment_time', match: /पैसा कब आता है/i, label: 'पैसा कब आता है?', sidebarLabel: 'Payment Time'},
    {key: 'ekyc', match: /Aadhaar eKYC/i, label: 'Aadhaar eKYC', sidebarLabel: 'eKYC/Bank'},
    {key: 'fee', match: /आवेदन शुल्क/i, label: 'आवेदन शुल्क', sidebarLabel: 'आवेदन शुल्क'},
    {key: 'processing_time', match: /कितना समय लगता है/i, label: 'आवेदन में कितना समय लगता है?', sidebarLabel: 'Processing Time'},
    {key: 'apply_where', match: /आवेदन कहां करें/i, label: 'आवेदन कहां करें?', sidebarLabel: 'आवेदन कहां करें?'},
    {key: 'schemes_list', match: /कौन-कौन सी Pension Schemes/i, label: 'Schemes List', sidebarLabel: 'Schemes List'},
    {key: 'difference', match: /वृद्धावस्था पेंशन में अंतर/i, label: 'Old Age Pension vs Social Security', sidebarLabel: 'Difference'},
    {key: 'payment_status', match: /Payment Status/i, label: 'Payment Status', sidebarLabel: 'Payment Status'},
    {key: 'overview', match: /मुख्य जानकारी/i, label: 'मुख्य जानकारी (Table)', sidebarLabel: 'मुख्य जानकारी'},
    {key: 'official_link', match: /Official Link/i, label: 'Official Link', sidebarLabel: 'Official Link'},
    {key: 'sources', coreId: 'sandarbh', match: /आधिकारिक स्रोत/i, label: 'आधिकारिक स्रोत', sidebarLabel: 'आधिकारिक स्रोत'},
    {key: 'conclusion', match: /^निष्कर्ष$/, label: 'निष्कर्ष', sidebarLabel: 'निष्कर्ष'},
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
