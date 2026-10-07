import type { Scheme } from './domain';

export const upSchemes: Scheme[] = [
  {
    slug: 'mukhyamantri-kanya-sumangala-yojana',
    title: 'मुख्यमंत्री कन्या सुमंगला योजना',
    english: 'Mukhyamantri Kanya Sumangala Yojana',
    category: 'mahila',
    state: 'uttar-pradesh',
    summary: 'बालिकाओं के स्वास्थ्य और शिक्षा को बढ़ावा देने के लिए उत्तर प्रदेश सरकार द्वारा जन्म से लेकर स्नातक तक ₹15,000 की आर्थिक सहायता।',
    benefit: 'विभिन्न चरणों में कुल ₹15,000 की आर्थिक सहायता',
    department: 'महिला कल्याण विभाग, उत्तर प्रदेश',
    documents: [
      'आवेदक का आधार कार्ड',
      'राशन कार्ड',
      'आय प्रमाण पत्र',
      'बैंक खाता विवरण',
      'पासपोर्ट साइज फोटो'
    ],
    steps: [
      'महिला कल्याण विभाग की आधिकारिक वेबसाइट पर जाएं।',
      'नागरिक सेवा पोर्टल पर ऑनलाइन आवेदन भरें।',
      'आवश्यक दस्तावेज अपलोड करें और आवेदन सबमिट करें।'
    ],
    rules: [
      { field: 'gender', op: 'eq', value: 'female', label: 'केवल बालिकाओं के लिए' }
    ],
    sourceUrl: 'https://mksy.up.gov.in/',
    applicationUrl: 'https://mksy.up.gov.in/',
    sourceNotes: 'योजना के तहत एक परिवार की अधिकतम दो बच्चियों को लाभ दिया जाता है।',
    status: 'ACTIVE',
    priority: true,
    isSample: false,
    verifiedAt: '2026-10-07T00:00:00.000Z',
    nextReviewAt: '2027-04-07T00:00:00.000Z'
  },
  {
    slug: 'up-bhagyalakshmi-yojana',
    title: 'यूपी भाग्यलक्ष्मी योजना',
    english: 'UP Bhagyalakshmi Yojana',
    category: 'mahila',
    state: 'uttar-pradesh',
    summary: 'उत्तर प्रदेश सरकार द्वारा बेटियों के जन्म पर ₹50,000 का बांड और मां को ₹5,100 की वित्तीय सहायता।',
    benefit: '₹50,000 का विकास बांड और ₹5,100 की नकद सहायता',
    department: 'महिला एवं बाल विकास विभाग, उत्तर प्रदेश',
    documents: [
      'माता-पिता का आधार कार्ड',
      'बच्ची का जन्म प्रमाण पत्र',
      'आय प्रमाण पत्र',
      'बैंक पासबुक'
    ],
    steps: [
      'अपने निकटतम आंगनबाड़ी केंद्र या महिला कल्याण विभाग कार्यालय से संपर्क करें।',
      'योजना का आवेदन पत्र भरें और दस्तावेज संलग्न करें।',
      'आवेदन स्वीकृत होने पर बांड और सहायता राशि प्रदान की जाएगी।'
    ],
    rules: [
      { field: 'gender', op: 'eq', value: 'female', label: 'बालिकाओं के जन्म पर' }
    ],
    sourceUrl: 'http://mahilakalyan.up.nic.in/',
    applicationUrl: 'http://mahilakalyan.up.nic.in/',
    sourceNotes: 'गरीब परिवारों (BPL) की बालिकाओं के लिए।',
    status: 'ACTIVE',
    priority: true,
    isSample: false,
    verifiedAt: '2026-10-07T00:00:00.000Z',
    nextReviewAt: '2027-04-07T00:00:00.000Z'
  },
  {
    slug: 'mukhyamantri-abhyudaya-yojana',
    title: 'मुख्यमंत्री अभ्युदय योजना',
    english: 'Mukhyamantri Abhyudaya Yojana',
    category: 'shiksha',
    state: 'uttar-pradesh',
    summary: 'उत्तर प्रदेश के प्रतियोगी छात्रों को IAS, IPS, PCS, NEET, JEE जैसी परीक्षाओं के लिए निःशुल्क कोचिंग सुविधा।',
    benefit: 'प्रतियोगी परीक्षाओं के लिए निःशुल्क कोचिंग',
    department: 'समाज कल्याण विभाग, उत्तर प्रदेश',
    documents: [
      'आधार कार्ड',
      'शैक्षणिक प्रमाण पत्र',
      'पासपोर्ट साइज फोटो'
    ],
    steps: [
      'अभ्युदय योजना की आधिकारिक वेबसाइट पर जाएं।',
      'रजिस्ट्रेशन करें और परीक्षा के लिए आवेदन करें।',
      'प्रवेश परीक्षा पास करने के बाद निशुल्क कोचिंग का लाभ लें।'
    ],
    rules: [
      { field: 'occupation', op: 'eq', value: 'student', label: 'प्रतियोगी छात्र' }
    ],
    sourceUrl: 'http://abhyuday.up.gov.in/',
    applicationUrl: 'http://abhyuday.up.gov.in/',
    sourceNotes: 'ऑनलाइन और ऑफलाइन दोनों प्रकार की कक्षाओं की सुविधा।',
    status: 'ACTIVE',
    priority: true,
    isSample: false,
    verifiedAt: '2026-10-07T00:00:00.000Z',
    nextReviewAt: '2027-04-07T00:00:00.000Z'
  },
  {
    slug: 'vishwakarma-shram-samman-yojana-up',
    title: 'विश्वकर्मा श्रम सम्मान योजना',
    english: 'Vishwakarma Shram Samman Yojana UP',
    category: 'rojgar',
    state: 'uttar-pradesh',
    summary: 'उत्तर प्रदेश के पारंपरिक कारीगरों और दस्तकारों को 6 दिन का मुफ्त प्रशिक्षण और स्वरोजगार के लिए ₹10,000 से ₹10 लाख तक की आर्थिक सहायता।',
    benefit: 'निःशुल्क प्रशिक्षण, टूलकिट और 10 लाख तक का ऋण',
    department: 'सूक्ष्म, लघु एवं मध्यम उद्यम तथा निर्यात प्रोत्साहन विभाग, उत्तर प्रदेश',
    documents: [
      'आधार कार्ड',
      'जाति प्रमाण पत्र',
      'बैंक खाता पासबुक'
    ],
    steps: [
      'DIUP की आधिकारिक वेबसाइट पर जाएं।',
      'विश्वकर्मा श्रम सम्मान योजना के तहत অনলাইনে आवेदन करें।',
      'आवेदन जमा करने के बाद चयनित होने पर प्रशिक्षण प्राप्त करें।'
    ],
    rules: [
      { field: 'occupation', op: 'eq', value: 'worker', label: 'पारंपरिक कारीगर' },
      { field: 'age', op: 'gte', value: 18, label: 'न्यूनतम 18 वर्ष' }
    ],
    sourceUrl: 'http://diupmsme.upsdc.gov.in/',
    applicationUrl: 'http://diupmsme.upsdc.gov.in/',
    sourceNotes: 'बढ़ई, दर्जी, कुम्हार, हलवाई आदि जैसे पारंपरिक कामगारों के लिए।',
    status: 'ACTIVE',
    priority: true,
    isSample: false,
    verifiedAt: '2026-10-07T00:00:00.000Z',
    nextReviewAt: '2027-04-07T00:00:00.000Z'
  }
];
