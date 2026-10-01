import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

const schemes = [
  {
    slug: 'haryana-vivah-shagun-yojana',
    title: 'हरियाणा मुख्यमंत्री विवाह शगुन योजना',
    english: 'Haryana Mukhyamantri Vivah Shagun Yojana',
    category: 'mahila',
    state: 'haryana',
    summary: 'हरियाणा सरकार द्वारा गरीब, बीपीएल और अनुसूचित जाति के परिवारों की बेटियों की शादी पर 71,000 रुपये तक की आर्थिक सहायता दी जाती है।',
    summaryEn: 'Financial assistance up to Rs 71,000 provided by Haryana Govt for the marriage of daughters from poor, BPL, and SC/ST families.',
    benefit: 'बेटी की शादी पर ₹31,000 से ₹71,000 तक की शगुन राशि',
    department: 'अनुसूचित जाति एवं पिछड़े वर्ग कल्याण विभाग, हरियाणा',
    documents: ['लड़की और लड़के का आधार कार्ड/जन्म प्रमाण पत्र', 'परिवार पहचान पत्र (PPP)', 'आय प्रमाण पत्र (सालाना आय 1.80 लाख से कम)', 'शादी का कार्ड', 'बैंक खाता'],
    steps: ['Antyodaya SARAL (saralharyana.gov.in) पोर्टल पर जाएं', 'नया अकाउंट बनाएं या लॉगिन करें', 'विवाह शगुन योजना (Mukhya Mantri Vivah Shagun Yojana) सर्च करें', 'आवेदन फॉर्म भरें, सभी जरूरी दस्तावेज़ अपलोड करें और सबमिट करें'],
    rules: [
      { field: 'state', op: 'eq', value: 'haryana', label: 'हरियाणा के निवासी' },
      { field: 'gender', op: 'eq', value: 'female', label: 'वधु की आयु 18 वर्ष या उससे अधिक' },
      { field: 'income', op: 'lte', value: 180000, label: 'पारिवारिक आय 1.80 लाख रुपये से कम' }
    ],
    sourceUrl: 'https://saralharyana.gov.in/',
    applicationUrl: 'https://saralharyana.gov.in/',
    sourceNotes: 'योजना का लाभ लेने के लिए शादी से पहले या शादी के 6 महीने के भीतर आवेदन करना आवश्यक है।',
    status: 'ACTIVE',
    priority: true,
    isSample: false,
    verifiedAt: new Date().toISOString(),
    nextReviewAt: new Date(Date.now() + 180 * 86400000).toISOString(),
    detailedDescription: [
      'मुख्यमंत्री विवाह शगुन योजना का उद्देश्य गरीब परिवारों की आर्थिक मदद करना है ताकि बेटियों की शादी में उन्हें कर्ज न लेना पड़े।',
      'योजना में अलग-अलग वर्गों के लिए अलग राशि तय है: SC/ST परिवारों को ₹71,000, BPL (सामान्य/पिछड़ा वर्ग) को ₹31,000, और दिव्यांगों की शादी में ₹51,000 तक दिए जाते हैं।'
    ],
    faqs: [
      { question: 'शादी के कितने दिन बाद तक फॉर्म भर सकते हैं?', answer: 'योजना के तहत शादी की तारीख से 6 महीने के भीतर आवेदन कर देना चाहिए।' }
    ],
    seoDescription: 'हरियाणा मुख्यमंत्री विवाह शगुन योजना के तहत गरीब परिवारों की बेटियों की शादी पर पाएं ₹71,000 की शगुन राशि। पात्रता और ऑनलाइन आवेदन प्रक्रिया।',
    imageUrl: '/placeholder-scheme.webp'
  },
  {
    slug: 'gujarat-vahli-dikri-yojana',
    title: 'વહાલી દીકરી યોજના (गुजरात)',
    english: 'Gujarat Vahli Dikri Yojana',
    category: 'mahila',
    state: 'gujarat',
    summary: 'गुजरात सरकार द्वारा बालिका के जन्म, स्कूल में प्रवेश और उच्च शिक्षा/शादी के समय पर कुल 1 लाख 10 हजार रुपये की सहायता दी जाती है।',
    summaryEn: 'Financial assistance of Rs 1,10,000 provided in phases by Gujarat Govt for a girl child’s birth, education, and marriage.',
    benefit: 'बेटी के नाम पर कुल ₹1,10,000 की वित्तीय सहायता',
    department: 'महिला एवं बाल विकास विभाग, गुजरात',
    documents: ['माता-पिता का आधार कार्ड', 'बेटी का जन्म प्रमाण पत्र', 'आय प्रमाण पत्र (सालाना आय 2 लाख से कम)', 'बैंक खाता विवरण', 'राशन कार्ड'],
    steps: ['ई-ग्राम केंद्र या आंगनबाड़ी कार्यकर्ता से संपर्क करें', 'वहाली दिकरी योजना का फॉर्म लें और सही जानकारी भरें', 'सभी दस्तावेज़ संलग्न करें', 'फॉर्म को ग्राम पंचायत, WCD कार्यालय या आंगनबाड़ी में जमा करें'],
    rules: [
      { field: 'state', op: 'eq', value: 'gujarat', label: 'गुजरात राज्य के निवासी' },
      { field: 'gender', op: 'eq', value: 'female', label: 'केवल बालिकाओं के लिए' },
      { field: 'income', op: 'lte', value: 200000, label: 'पारिवारिक आय 2 लाख रुपये से कम' }
    ],
    sourceUrl: 'https://wcd.gujarat.gov.in/schemes',
    applicationUrl: 'https://wcd.gujarat.gov.in/schemes',
    sourceNotes: 'योजना 2 अगस्त 2019 के बाद जन्मी बेटियों के लिए लागू है। परिवार की पहली 2 बेटियां ही इसके लिए पात्र हैं।',
    status: 'ACTIVE',
    priority: true,
    isSample: false,
    verifiedAt: new Date().toISOString(),
    nextReviewAt: new Date(Date.now() + 180 * 86400000).toISOString(),
    detailedDescription: [
      'वहाली दिकरी (Vahli Dikri) योजना बालिकाओं के अनुपात को सुधारने और उनके भविष्य को सुरक्षित करने के लिए गुजरात सरकार की महत्वपूर्ण पहल है।',
      'इसमें 1ली कक्षा में दाखिले पर ₹4000, 9वीं कक्षा में ₹6000 और 18 वर्ष की आयु (उच्च शिक्षा/शादी) पर ₹1,00,000 मिलते हैं।'
    ],
    faqs: [
      { question: 'योजना का लाभ कितनी बेटियों को मिलेगा?', answer: 'योजना का लाभ एक परिवार की केवल पहली दो बेटियों को ही दिया जाता है।' }
    ],
    seoDescription: 'Gujarat Vahli Dikri Yojana: गुजरात सरकार द्वारा बेटियों के जन्म से लेकर 18 वर्ष की आयु तक ₹1,10,000 की नकद सहायता। पात्रता और फॉर्म डाउनलोड करें।',
    imageUrl: '/placeholder-scheme.webp'
  },
  {
    slug: 'chhattisgarh-koushalya-matritva-yojana',
    title: 'छत्तीसगढ़ कौशल्या मातृत्व योजना',
    english: 'CG Kaushalya Matritva Yojana',
    category: 'mahila',
    state: 'chhattisgarh',
    summary: 'छत्तीसगढ़ में दूसरी बेटी के जन्म पर माता के बेहतर स्वास्थ्य और पोषण के लिए राज्य सरकार 5000 रुपये की एकमुश्त सहायता राशि देती है।',
    summaryEn: 'One-time financial aid of Rs 5000 given by Chhattisgarh Govt to mothers on the birth of a second girl child for better nutrition.',
    benefit: 'दूसरी बेटी के जन्म पर ₹5000 की नकद सहायता',
    department: 'महिला एवं बाल विकास विभाग, छत्तीसगढ़',
    documents: ['माता का आधार कार्ड', 'बैंक पासबुक की कॉपी', 'दूसरी बच्ची का जन्म प्रमाण पत्र', 'आंगनबाड़ी/अस्पताल का डिलीवरी रिकॉर्ड'],
    steps: ['अपने नजदीकी आंगनबाड़ी केंद्र में जाएं', 'आंगनबाड़ी कार्यकर्ता/सहायिका को दूसरी बेटी के जन्म की जानकारी दें', 'मांग के अनुसार आवेदन फॉर्म भरें', 'फॉर्म और दस्तावेज जमा करने के बाद पैसा सीधे खाते में आ जाएगा'],
    rules: [
      { field: 'state', op: 'eq', value: 'chhattisgarh', label: 'छत्तीसगढ़ के निवासी' },
      { field: 'gender', op: 'eq', value: 'female', label: 'माता/बालिका' }
    ],
    sourceUrl: 'https://cgwcd.gov.in/',
    applicationUrl: 'https://cgwcd.gov.in/',
    sourceNotes: 'यह योजना केंद्र की मातृत्व वंदना योजना (PMMVY) से अलग और अतिरिक्त है, जो विशेष रूप से दूसरी बच्ची के लिए है।',
    status: 'ACTIVE',
    priority: true,
    isSample: false,
    verifiedAt: new Date().toISOString(),
    nextReviewAt: new Date(Date.now() + 180 * 86400000).toISOString(),
    detailedDescription: [
      'कौशल्या मातृत्व योजना का शुभारंभ 2022 में सुरक्षित मातृत्व को बढ़ावा देने और बच्चियों के गिरते लिंगानुपात को रोकने के लिए किया गया।',
      'इसके माध्यम से यह सुनिश्चित किया जाता है कि दूसरी बच्ची के जन्म के बाद भी माँ को उचित आहार और आराम मिले।'
    ],
    seoDescription: 'छत्तीसगढ़ कौशल्या मातृत्व योजना: दूसरी बेटी के जन्म पर राज्य सरकार दे रही है ₹5000. आंगनबाड़ी के माध्यम से आवेदन, पात्रता और नियम जानें।',
    imageUrl: '/placeholder-scheme.webp'
  },
  {
    slug: 'punjab-ashirwad-yojana',
    title: 'पंजाब आशीर्वाद योजना (शगुन योजना)',
    english: 'Punjab Ashirwad Yojana',
    category: 'mahila',
    state: 'punjab',
    summary: 'पंजाब में SC/ST, BC, और आर्थिक रूप से कमजोर परिवारों (EWS) की बेटियों की शादी के अवसर पर सरकार द्वारा 51,000 रुपये का "शगुन" दिया जाता है।',
    summaryEn: 'Punjab Ashirwad scheme provides Rs 51,000 financial aid for the marriage of girls belonging to SC/ST, BC, and EWS categories.',
    benefit: 'बेटी की शादी के लिए ₹51,000 की आर्थिक मदद',
    department: 'सामाजिक न्याय, अधिकारिता और अल्पसंख्यक विभाग, पंजाब',
    documents: ['लड़की का जन्म प्रमाण/आधार कार्ड (उम्र 18+)', 'आय प्रमाण पत्र (32,790 रु. सालाना से कम)', 'जाति प्रमाण पत्र (SC/BC)', 'शादी का निमंत्रण पत्र'],
    steps: ['पंजाब के ई-सेवा पोर्टल या आशिरवाद पोर्टल पर विजिट करें', 'अपनी जानकारी के साथ रजिस्टर करें', 'ऑनलाइन फॉर्म भरकर सभी दस्तावेज़ स्कैन करके अपलोड करें', 'शादी की तारीख से पहले या 30 दिन के अंदर आवेदन जमा करें'],
    rules: [
      { field: 'state', op: 'eq', value: 'punjab', label: 'पंजाब के निवासी' },
      { field: 'gender', op: 'eq', value: 'female', label: 'वधु की उम्र 18 से अधिक' }
    ],
    sourceUrl: 'https://punjab.gov.in/schemes/',
    applicationUrl: 'https://punjab.gov.in/schemes/',
    sourceNotes: 'इस योजना को पहले "शगुन योजना" के नाम से जाना जाता था। एक परिवार से अधिकतम 2 लड़कियों को लाभ मिलता है।',
    status: 'ACTIVE',
    priority: true,
    isSample: false,
    verifiedAt: new Date().toISOString(),
    nextReviewAt: new Date(Date.now() + 180 * 86400000).toISOString(),
    detailedDescription: [
      'आशीर्वाद योजना के माध्यम से पंजाब सरकार यह सुनिश्चित करती है कि गरीब माता-पिता को अपनी बेटियों के विवाह में भारी कर्ज का सामना न करना पड़े।',
      'जुलाई 2021 से इस राशि को 21,000 रुपये से बढ़ाकर 51,000 रुपये कर दिया गया है। मुस्लिम और ईसाई लड़कियों के अलावा विधवाओं/तलाकशुदा महिलाओं की दोबारा शादी पर भी यह मदद मिलती है।'
    ],
    faqs: [
      { question: 'योजना के लिए आवेदन कब करना होता है?', answer: 'शादी की तय तारीख से पहले या शादी के 30 दिन के भीतर आपको ऑनलाइन आवेदन करना होता है।' }
    ],
    seoDescription: 'पंजाब आशीर्वाद (शगुन) योजना 2026: गरीब परिवारों को बेटी की शादी पर ₹51000 की आर्थिक सहायता। पात्रता, जरूरी दस्तावेज़ और ऑनलाइन अप्लाई कैसे करें?',
    imageUrl: '/placeholder-scheme.webp'
  }
];

async function run() {
  console.log('Connecting to Neon DB:', process.env.DATABASE_URL?.slice(0, 30) + '...');
  const sql = neon(process.env.DATABASE_URL!);
  let count = 0;
  for (const s of schemes) {
    const now = new Date().toISOString();
    try {
      await sql`
        INSERT INTO schemes(slug, data, status, next_review_at, updated_at) 
        VALUES (${s.slug}, ${JSON.stringify(s)}, ${s.status}, ${s.nextReviewAt}, ${now})
        ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
      `;
      count++;
      console.log(`Inserted ${count}/${schemes.length}: ${s.slug}`);
    } catch (err) {
      console.error(`Failed to insert ${s.slug}:`, err);
    }
  }
  console.log('Successfully inserted batch 2 top schemes!');
}

run();
