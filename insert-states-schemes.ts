import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

const schemes = [
  {
    slug: 'up-kanya-sumangala-yojana',
    title: 'UP Mukhyamantri Kanya Sumangala Yojana',
    english: 'UP Kanya Sumangala Yojana',
    category: 'mahila',
    state: 'uttar-pradesh',
    summary: 'उत्तर प्रदेश सरकार द्वारा बालिकाओं के जन्म से लेकर स्नातक तक की शिक्षा के लिए कुल 25,000 रुपये की आर्थिक सहायता 6 चरणों में दी जाती है।',
    summaryEn: 'Financial assistance of up to Rs. 25,000 provided by the UP Government for the birth and education of a girl child across 6 phases.',
    benefit: 'बेटियों की शिक्षा और स्वास्थ्य के लिए 25,000 रुपये की आर्थिक सहायता',
    department: 'महिला एवं बाल विकास विभाग, उत्तर प्रदेश',
    documents: ['आधार कार्ड (माता/पिता और बच्ची का)', 'आय प्रमाण पत्र (सालाना आय 3 लाख से कम)', 'बैंक खाता पासबुक', 'जन्म प्रमाण पत्र', 'टीकाकरण कार्ड (दूसरे चरण के लिए)', 'स्कूल का प्रमाण पत्र', 'परिवार की फोटो', 'शपथ पत्र'],
    steps: ['आधिकारिक वेबसाइट mksy.up.gov.in पर जाएं', 'नागरिक सेवा पोर्टल (Citizen Services Portal) पर रजिस्टर करें', 'लॉगिन करके Add Beneficiary पर क्लिक करें', 'चरण चुनें, आवेदन पत्र भरें और जरूरी दस्तावेज अपलोड करें', 'फॉर्म सबमिट करें और एप्लीकेशन नंबर नोट करें'],
    rules: [
      { field: 'state', op: 'eq', value: 'uttar-pradesh', label: 'उत्तर प्रदेश के निवासी' },
      { field: 'gender', op: 'eq', value: 'female', label: 'महिला/बालिका' },
      { field: 'income', op: 'lte', value: 300000, label: 'पारिवारिक आय 3 लाख रुपये से कम' }
    ],
    sourceUrl: 'https://mksy.up.gov.in/',
    applicationUrl: 'https://mksy.up.gov.in/women_welfare/index.php',
    sourceNotes: 'आधिकारिक वेबसाइट पर नवीनतम दिशा-निर्देश उपलब्ध हैं। अप्रैल 2024 से राशि को ₹15000 से बढ़ाकर ₹25000 कर दिया गया है।',
    status: 'ACTIVE',
    priority: true,
    isSample: false,
    verifiedAt: new Date().toISOString(),
    nextReviewAt: new Date(Date.now() + 180 * 86400000).toISOString(),
    detailedDescription: [
      'मुख्यमंत्री कन्या सुमंगला योजना (MKSY) उत्तर प्रदेश सरकार की एक बहुत ही महत्वपूर्ण योजना है। इस योजना का मुख्य उद्देश्य राज्य में कन्या भ्रूण हत्या को रोकना और बालिकाओं के स्वास्थ्य व शिक्षा को बढ़ावा देना है।',
      'अक्सर लोग सर्च करते हैं कि kanya sumangala yojana me kitna paisa milta hai? बता दें कि अप्रैल 2024 से इस योजना की कुल राशि को बढ़ाकर ₹25,000 कर दिया गया है। यह पैसा बेटी के जन्म से लेकर उच्च शिक्षा तक 6 अलग-अलग चरणों में सीधे बैंक खाते (DBT) में आता है।',
      'प्रथम चरण (जन्म पर): ₹5,000, द्वितीय चरण (टीकाकरण): ₹2,000, तृतीय चरण (कक्षा 1): ₹3,000, चतुर्थ चरण (कक्षा 6): ₹3,000, पंचम चरण (कक्षा 9): ₹5,000, छठा चरण (उच्च शिक्षा): ₹7,000 (डिग्री/डिप्लोमा में प्रवेश लेने पर)।',
      'यदि आप up kanya sumangala yojana 2026 online apply करना चाहते हैं, तो आप mksy.up.gov.in पोर्टल पर जाकर अपना रजिस्ट्रेशन पूरा कर सकते हैं।'
    ],
    faqs: [
      { question: 'kanya sumangala yojana me kitna paisa milta hai?', answer: 'अप्रैल 2024 से इस योजना के तहत बेटी के जन्म से लेकर उच्च शिक्षा तक कुल ₹25,000 की राशि 6 अलग-अलग चरणों में दी जाती है।' },
      { question: 'up kanya sumangala yojana 2026 online apply कैसे करें?', answer: 'आप उत्तर प्रदेश महिला कल्याण विभाग की आधिकारिक वेबसाइट mksy.up.gov.in पर जाकर Citizen Services Portal के माध्यम से ऑनलाइन रजिस्ट्रेशन और अप्लाई कर सकते हैं।' },
      { question: 'kanya sumangala yojana document list in hindi क्या है?', answer: 'आवेदन के लिए आधार कार्ड, ₹3 लाख से कम का आय प्रमाण पत्र, निवास प्रमाण, बच्ची का जन्म/टीकाकरण/स्कूल प्रमाण पत्र, बैंक पासबुक, परिवार की जॉइंट फोटो और एक एफिडेविट की आवश्यकता होती है।' },
      { question: 'kanya sumangala yojana check status by aadhar card संभव है?', answer: 'सीधे आधार कार्ड नंबर से स्टेटस चेक नहीं होता। आपको mksy.up.gov.in पर अपनी लॉगिन आईडी और पासवर्ड से लॉगिन करना होगा, जिसके बाद डैशबोर्ड पर स्टेटस दिखाई देता है।' }
    ],
    seoDescription: 'उत्तर प्रदेश कन्या सुमंगला योजना (MKSY) में बेटियों को ₹25,000 कैसे मिलेंगे? जानें up kanya sumangala yojana online apply, document list in hindi, और status check करने का तरीका।',
    imageUrl: '/placeholder-scheme.webp',
    applicationProcess: [
      {
        mode: 'ऑनलाइन',
        steps: [
          'योजना की आधिकारिक वेबसाइट mksy.up.gov.in पर जाएं।',
          'होमपेज पर "Citizen Services Portal" (नागरिक सेवा पोर्टल) पर क्लिक करें।',
          'नियम और शर्तें पढ़ें, "I Agree" (मैं सहमत हूँ) पर क्लिक करके आगे बढ़ें।',
          'रजिस्ट्रेशन फॉर्म में अपनी व्यक्तिगत जानकारी भरें और मोबाइल नंबर पर आया OTP दर्ज़ करें।',
          'रजिस्ट्रेशन के बाद, अपनी यूजर आईडी (User ID) और पासवर्ड (Password) से पोर्टल पर लॉग इन करें।',
          'कन्या सुमंगला योजना का आवेदन फॉर्म पूरी तरह से भरें (सही चरण/stage का चयन करें)।',
          'सभी ज़रूरी दस्तावेज़ (बच्ची का जन्म प्रमाण पत्र, आधार, आय प्रमाण पत्र, संयुक्त फोटो आदि) स्कैन करके अपलोड करें।',
          'फॉर्म को सबमिट करें और भविष्य के लिए रिफरेन्स नंबर (Reference Number) सुरक्षित रख लें।'
        ]
      }
    ]
  },
  {
    slug: 'bihar-kanya-utthan-yojana',
    title: 'बिहार मुख्यमंत्री कन्या उत्थान योजना',
    english: 'Bihar Mukhyamantri Kanya Utthan Yojana',
    category: 'mahila',
    state: 'bihar',
    summary: 'बिहार में बालिकाओं को जन्म से लेकर स्नातक की पढ़ाई पूरी करने तक कुल 54,100 रुपये की आर्थिक सहायता अलग-अलग किस्तों में दी जाती है। 12वीं पास पर ₹25,000 और स्नातक पर ₹50,000 मिलते हैं।',
    summaryEn: 'Financial assistance of Rs. 54,100 from birth till graduation for a girl child in Bihar to promote female education and reduce female feticide.',
    benefit: '12वीं पास: 25,000 रुपये, स्नातक: 50,000 रुपये की नकद सहायता',
    department: 'समाज कल्याण / शिक्षा विभाग, बिहार',
    documents: ['आधार कार्ड', 'बैंक खाता विवरण', 'निवास प्रमाण पत्र', 'मार्कशीट/शिक्षण प्रमाण पत्र', 'रजिस्ट्रेशन नंबर'],
    steps: ['मेधासॉफ्ट (medhasoft.bih.nic.in) या ई-कल्याण पोर्टल पर जाएं', 'कन्या उत्थान योजना (स्नातक या 12वीं) के लिए लिंक पर क्लिक करें', 'रजिस्ट्रेशन करें और लॉगिन क्रेडेंशियल्स प्राप्त करें', 'फॉर्म पूरा भरें, दस्तावेज़ अपलोड करें और सबमिट करें'],
    rules: [
      { field: 'state', op: 'eq', value: 'bihar', label: 'बिहार के स्थायी निवासी' },
      { field: 'gender', op: 'eq', value: 'female', label: 'केवल बालिकाओं के लिए' }
    ],
    sourceUrl: 'https://medhasoft.bih.nic.in/',
    applicationUrl: 'https://medhasoft.bih.nic.in/',
    sourceNotes: 'विभिन्न स्तरों (इंटर, स्नातक) के लिए अलग-अलग पोर्टल लिंक होते हैं, जिन्हें ई-कल्याण या मेधासॉफ्ट से एक्सेस किया जा सकता है।',
    status: 'ACTIVE',
    priority: true,
    isSample: false,
    verifiedAt: new Date().toISOString(),
    nextReviewAt: new Date(Date.now() + 180 * 86400000).toISOString(),
    detailedDescription: [
      'मुख्यमंत्री कन्या उत्थान योजना (Bihar Kanya Utthan Yojana) बिहार सरकार की एक अत्यंत महत्वाकांक्षी योजना है। राज्य में लड़कियों की शिक्षा को बढ़ावा देने और बाल विवाह को रोकने के लिए सरकार जन्म से लेकर ग्रेजुएशन तक लड़कियों को आर्थिक मदद (Direct Benefit Transfer - DBT) देती है।',
      'इस योजना की सबसे ज़्यादा चर्चा इसके दो मुख्य पड़ावों के लिए होती है—12वीं पास करने पर और स्नातक (Graduation) पूरा करने पर। लोग लगातार खोज रहे हैं कि bihar kanya utthan yojana 12th pass paisa कैसे मिलेगा, और kanya utthan yojana graduation online apply 2026 की प्रक्रिया क्या है।',
      'बिहार बोर्ड से 12वीं पास करने वाली अविवाहित लड़कियों को ₹25,000 की नकद प्रोत्साहन राशि मिलती है। वहीं, मान्यता प्राप्त कॉलेज/यूनिवर्सिटी से ग्रेजुएशन पास करने वाली लड़कियों को ₹50,000 दिए जाते हैं (इसके लिए लड़की का अविवाहित होना ज़रूरी नहीं है)।',
      'आप medhasoft bih nic in kanya utthan yojana पोर्टल से फॉर्म भर सकती हैं और kanya utthan yojana status check by aadhar number कर सकती हैं।'
    ],
    faqs: [
      { question: 'bihar kanya utthan yojana 12th pass paisa कितना मिलता है?', answer: '12वीं पास करने वाली अविवाहित छात्राओं को ₹25,000 की प्रोत्साहन राशि मिलती है।' },
      { question: 'kanya utthan yojana graduation online apply 2026 कैसे करें?', answer: 'आप बिहार सरकार के मेधासॉफ्ट पोर्टल (medhasoft.bih.nic.in) या ई-कल्याण पोर्टल पर जाकर स्नातक (ग्रेजुएशन) वाले लिंक से ऑनलाइन रजिस्ट्रेशन कर सकती हैं, जिसके तहत ₹50,000 मिलते हैं।' },
      { question: 'kanya utthan yojana status check by aadhar number कैसे करें?', answer: 'मेधासॉफ्ट पोर्टल पर \'Student\' मेनू में जाकर \'Check Application Status\' चुनें और अपना आधार नंबर या रजिस्ट्रेशन नंबर डालकर स्टेटस चेक करें।' },
      { question: 'kanya utthan yojana bihar list me naam kaise dekhe?', answer: 'पोर्टल के \'Reports\' सेक्शन में जाकर \'Verify Name and Account Detail\' पर क्लिक करें। अपना जिला और कॉलेज चुनने पर आपको पूरी लिस्ट दिख जाएगी।' }
    ],
    seoDescription: 'Bihar Kanya Utthan Yojana में 12वीं पास को ₹25,000 और ग्रेजुएट को ₹50,000 मिलते हैं। Medhasoft/ekalyan से Online Apply, Status Check और List देखने की पूरी जानकारी।',
    imageUrl: '/placeholder-scheme.webp',
    applicationProcess: [
      {
        mode: 'ऑनलाइन',
        steps: [
          'ई-कल्याण / मेधासॉफ्ट पोर्टल (medhasoft.bih.nic.in) पर जाएं।',
          'अपने आवेदन के अनुसार (स्नातक या 12वीं पास) संबंधित योजना के लिंक पर क्लिक करें।',
          '"Student Registration" पर क्लिक करके अपनी यूनिवर्सिटी रजिस्ट्रेशन नंबर, मार्कशीट और आधार की जानकारी भरें।',
          'रजिस्ट्रेशन के बाद आपको लॉगिन आईडी और पासवर्ड (Login ID & Password) मिलेगा।',
          'इन क्रेडेंशियल्स की मदद से लॉगिन करें और "Finalize Application" (आवेदन पूरा करें) सेक्शन में जाएं।',
          'अपने सभी दस्तावेज़ (मार्कशीट, आधार, बैंक पासबुक, निवास प्रमाण पत्र) स्कैन करके अपलोड करें। ध्यान दें कि आपका बैंक खाता आधार से लिंक (DBT Enabled) होना अनिवार्य है।',
          'आवेदन सबमिट करें और प्रिंट आउट सुरक्षित रख लें।'
        ]
      }
    ]
  },
  {
    slug: 'maharashtra-ladki-bahin-yojana',
    title: 'माझी लाडकी बहीण योजना (महाराष्ट्र)',
    english: 'Majhi Ladki Bahin Yojana',
    category: 'mahila',
    state: 'maharashtra',
    summary: 'महाराष्ट्र सरकार द्वारा महिलाओं को आर्थिक रूप से स्वतंत्र बनाने के लिए हर महीने 1500 रुपये (सालाना ₹18,000) की प्रत्यक्ष नकद सहायता दी जाती है।',
    summaryEn: 'Maharashtra Govt scheme providing Rs 1500 per month direct cash transfer to women for financial independence.',
    benefit: 'प्रति माह 1500 रुपये नकद सीधे बैंक खाते में',
    department: 'महिला एवं बाल विकास विभाग, महाराष्ट्र',
    documents: ['आधार कार्ड', 'बैंक खाता (आधार से लिंक)', 'राशन कार्ड (पीला/केसरी)', 'निवास प्रमाण पत्र / डोमिसाइल', 'आय प्रमाण पत्र (₹2.5 लाख से कम)', 'हस्ताक्षर/स्व-घोषणा'],
    steps: ['नारी शक्ति दूत (Nari Shakti Doot) मोबाइल ऐप डाउनलोड करें', 'अपना मोबाइल नंबर डालकर रजिस्टर करें', 'योजनाओं की सूची में "लाडकी बहीण योजना" चुनें', 'सभी विवरण भरें और दस्तावेज़ अपलोड करके सबमिट करें'],
    rules: [
      { field: 'state', op: 'eq', value: 'maharashtra', label: 'महाराष्ट्र की निवासी' },
      { field: 'gender', op: 'eq', value: 'female', label: 'महिलाएं' },
      { field: 'age', op: 'gte', value: 21, label: 'आयु 21 वर्ष या उससे अधिक' },
      { field: 'age', op: 'lte', value: 65, label: 'आयु 65 वर्ष तक' },
      { field: 'income', op: 'lte', value: 250000, label: 'पारिवारिक आय 2.5 लाख से कम' }
    ],
    sourceUrl: 'https://ladkibahin.maharashtra.gov.in/',
    applicationUrl: 'https://ladkibahin.maharashtra.gov.in/',
    sourceNotes: 'योजना के आवेदन Nari Shakti Doot App और ऑनलाइन वेबसाइट दोनों तरीकों से लिए जा रहे हैं।',
    status: 'ACTIVE',
    priority: true,
    isSample: false,
    verifiedAt: new Date().toISOString(),
    nextReviewAt: new Date(Date.now() + 180 * 86400000).toISOString(),
    detailedDescription: [
      'माझी लाडकी बहीण योजना (Majhi Ladki Bahin Yojana) महाराष्ट्र सरकार द्वारा महिलाओं के लिए शुरू की गई एक प्रमुख कल्याणकारी योजना है। मध्य प्रदेश की लाडली बहना योजना की तर्ज़ पर शुरू की गई इस योजना में पात्र महिलाओं को आर्थिक रूप से स्वतंत्र बनाने के लिए हर महीने ₹1,500 की नकद सहायता (Direct Benefit Transfer - DBT) उनके बैंक खाते में दी जाती है।',
      'अक्सर लोग गूगल पर खोजते हैं कि maharashtra ladki bahin yojana online apply kaise kare 2026 या ladki bahin yojana status check online mobile se कैसे करें? इस योजना के लिए Nari Shakti Doot App से घर बैठे फॉर्म भरा जा सकता है।',
      'यदि आप सोच रहे हैं कि ladki bahin yojana paise kab aayenge, तो फॉर्म Approved होने और आधार-लिंक्ड बैंक खाता (DBT enable) सही पाए जाने पर सरकार द्वारा निर्धारित मासिक किस्तों में पैसे सीधे खाते में भेजे जाते हैं।'
    ],
    faqs: [
      { question: 'maharashtra ladki bahin yojana online apply kaise kare?', answer: 'आप सरकार के "Nari Shakti Doot App" या आधिकारिक पोर्टल (ladkibahin.maharashtra.gov.in) के माध्यम से मोबाइल नंबर रजिस्टर करके ऑनलाइन फॉर्म भर सकती हैं।' },
      { question: 'ladki bahin yojana form kaise bhare mobile se?', answer: 'मोबाइल से फॉर्म भरने के लिए Google Play Store से Nari Shakti Doot ऐप डाउनलोड करें, OTP से लॉगिन करें, अपनी जानकारी भरें और मोबाइल कैमरे से दस्तावेज़ों की फोटो खींचकर अपलोड कर दें।' },
      { question: 'ladki bahin yojana status check online mobile se कैसे करें?', answer: 'Nari Shakti Doot ऐप में लॉगिन करें और "Application Status" या "Applied Schemes" विकल्प पर क्लिक करके अपने आवेदन की स्थिति (Approved/Pending/Rejected) देखें।' },
      { question: 'ladki bahin yojana eligibility criteria क्या है?', answer: '21 से 65 वर्ष आयु वर्ग की महाराष्ट्र निवासी महिलाएं, जिनकी पारिवारिक आय ₹2.5 लाख सालाना से कम है, वे इस योजना के लिए पात्र हैं।' }
    ],
    seoDescription: 'महाराष्ट्र माझी लाडकी बहीण योजना (Majhi Ladki Bahin Yojana) में हर महीने ₹1500 पाएं। जानें Nari Shakti Doot App से ladki bahin yojana form kaise bhare और status check करने का तरीका।',
    imageUrl: '/placeholder-scheme.webp',
    applicationProcess: [
      {
        mode: 'ऑनलाइन',
        steps: [
          'महाराष्ट्र सरकार के आधिकारिक पोर्टल (ladakibahin.maharashtra.gov.in) पर जाएं या "नारी शक्ति दूत" (Nari Shakti Doot) ऐप डाउनलोड करें।',
          'होमपेज पर "Applicant Login" या "Create Account" (नया खाता बनाएं) पर क्लिक करें।',
          'अपना पूरा नाम (आधार के अनुसार), मोबाइल नंबर, जिला, तालुका, और गांव/वार्ड दर्ज करके पासवर्ड सेट करें।',
          'कैप्चा कोड डालें, "Sign-up" पर क्लिक करें और OTP डालकर अकाउंट बनाएं।',
          'अकाउंट बनने के बाद अपने मोबाइल नंबर और पासवर्ड से लॉगिन करें।',
          'आवेदन फॉर्म में सही-सही जानकारी भरें (आधार कार्ड से नाम और जन्म तिथि का मिलान होना चाहिए)।',
          'बैंक खाता विवरण (आधार से लिंक होना चाहिए) और सभी आवश्यक दस्तावेज़ अपलोड करके सबमिट करें।'
        ]
      },
      {
        mode: 'ऑफलाइन',
        steps: [
          'यदि आप ऑनलाइन आवेदन नहीं कर पा रही हैं, तो अपने नजदीकी आंगनवाड़ी सेविका, ग्राम पंचायत कार्यालय या वार्ड समिति कार्यालय में जाएं।',
          'वहां से "माझी लाडकी बहीण योजना" का ऑफलाइन फॉर्म प्राप्त करें।',
          'फॉर्म को सही-सही भरें और सभी ज़रूरी दस्तावेज़ (आधार, राशन कार्ड, आय प्रमाण पत्र) की फोटोकॉपी संलग्न करें।',
          'फॉर्म को उसी कार्यालय में जमा करें और पावती (Acknowledgement) प्राप्त करें।'
        ]
      }
    ]
  },
  {
    slug: 'rajasthan-palanhar-yojana',
    title: 'राजस्थान पालनहार योजना',
    english: 'Rajasthan Palanhar Yojana',
    category: 'shiksha',
    state: 'rajasthan',
    summary: 'अनाथ बच्चों और अन्य विशेष श्रेणियों के बच्चों के पालन-पोषण और शिक्षा के लिए राज्य सरकार द्वारा हर महीने 1500 से 2500 रुपये की आर्थिक मदद दी जाती है।',
    summaryEn: 'Financial aid up to Rs 2500 per month provided by Rajasthan Govt for the care and education of orphan children and special categories.',
    benefit: 'प्रति माह 1500-2500 रुपये प्रति बच्चा + 2000 रुपये वार्षिक (कपड़े/जूते)',
    department: 'सामाजिक न्याय एवं अधिकारिता विभाग, राजस्थान',
    documents: ['पालनहार का जन आधार कार्ड', 'बच्चे का आधार कार्ड', 'अनाथ/श्रेणी का प्रमाण (जैसे मृत्यु प्रमाण पत्र)', 'स्कूल में अध्ययनरत होने का प्रमाण पत्र', 'आय प्रमाण पत्र'],
    steps: ['ई-मित्र कियोस्क (e-Mitra) पर जाएं या SSO पोर्टल पर लॉगिन करें', 'सामाजिक न्याय एवं अधिकारिता विभाग की योजनाओं में पालनहार चुनें', 'सभी विवरण भरें और ई-मित्र के माध्यम से फॉर्म सबमिट करें', 'प्रतिवर्ष बच्चे का स्कूल/आंगनबाड़ी में रजिस्ट्रेशन रिन्यू कराएं'],
    rules: [
      { field: 'state', op: 'eq', value: 'rajasthan', label: 'राजस्थान के मूल निवासी' }
    ],
    sourceUrl: 'https://sje.rajasthan.gov.in/Default.aspx?PageID=346',
    applicationUrl: 'https://sso.rajasthan.gov.in/signin',
    sourceNotes: 'योजना के तहत बच्चों को स्कूल भेजना अनिवार्य है। 0-6 वर्ष के लिए ₹1500 और 6-18 वर्ष के लिए ₹2500 मिलते हैं।',
    status: 'ACTIVE',
    priority: true,
    isSample: false,
    verifiedAt: new Date().toISOString(),
    nextReviewAt: new Date(Date.now() + 180 * 86400000).toISOString(),
    detailedDescription: [
      'राजस्थान पालनहार योजना (Palanhar Yojana) राजस्थान सरकार के सामाजिक न्याय एवं अधिकारिता विभाग (SJE) की एक अनूठी योजना है। इसका मुख्य उद्देश्य अनाथ बच्चों और विशेष श्रेणी के बच्चों का पालन-पोषण करने वाले व्यक्ति (पालनहार) को आर्थिक सहायता देना है।',
      'अक्सर लोग गूगल पर सर्च करते हैं कि palanhar yojana me kitne paise milte hai। सरकार द्वारा 0 से 6 वर्ष के बच्चों को ₹1500 प्रति माह और 6 से 18 वर्ष के स्कूल जाने वाले बच्चों को ₹2500 प्रति माह दिए जाते हैं।',
      'यदि आप rajasthan palanhar yojana online apply 2026 करना चाहते हैं, तो यह कार्य ई-मित्र (e-Mitra) या SSO Portal (sso.rajasthan.gov.in) के माध्यम से जन आधार कार्ड (Jan Aadhaar) द्वारा किया जा सकता है।',
      'यह भी जानना ज़रूरी है कि palanhar yojana renewal kaise kare, क्योंकि हर साल जुलाई में बच्चे का नया स्कूल प्रमाण पत्र पोर्टल पर अपलोड करना अनिवार्य होता है, वरना पैसे रुक जाते हैं।'
    ],
    faqs: [
      { question: 'palanhar yojana me kitne paise milte hai?', answer: '0 से 6 वर्ष के बच्चों को ₹1500 प्रति माह और 6 से 18 वर्ष के स्कूल जाने वाले बच्चों को ₹2500 प्रति माह मिलते हैं। साथ ही ₹2000 सालाना अतिरिक्त सहायता दी जाती है।' },
      { question: 'rajasthan palanhar yojana online apply 2026 कैसे करें?', answer: 'आप राजस्थान के SSO पोर्टल (sso.rajasthan.gov.in) पर लॉगिन करके या अपने नज़दीकी ई-मित्र कियोस्क के माध्यम से जन आधार कार्ड लगाकर आवेदन कर सकते हैं।' },
      { question: 'palanhar yojana renewal kaise kare?', answer: 'हर साल नया सत्र शुरू होने पर बच्चे के स्कूल का नया अध्ययन प्रमाण पत्र ई-मित्र या SSO पोर्टल के माध्यम से अपलोड करना होता है। इसे ही रिन्यूअल कहते हैं।' },
      { question: 'palanhar yojana status check by aadhar number कर सकते हैं?', answer: 'स्टेटस चेक करने के लिए मुख्य रूप से जन आधार नंबर (Jan Aadhar) या एप्लीकेशन नंबर की आवश्यकता होती है। इसे आप जन सूचना पोर्टल पर चेक कर सकते हैं।' }
    ],
    seoDescription: 'Rajasthan Palanhar Yojana में अनाथ बच्चों के पालन-पोषण के लिए हर महीने ₹1500-₹2500 मिलते हैं। जानें online apply, palanhar yojana status check और renewal kaise kare।',
    imageUrl: '/placeholder-scheme.webp',
    applicationProcess: [
      {
        mode: 'ऑनलाइन',
        steps: [
          'राजस्थान के Single Sign-On (SSO) पोर्टल sso.rajasthan.gov.in पर जाएं।',
          'यदि आपका SSO ID पहले से बना है तो लॉगिन करें, अन्यथा जन-आधार (Jan Aadhaar) की मदद से नया रजिस्ट्रेशन करें।',
          'SSO डैशबोर्ड में लॉगिन करने के बाद "Palanhar Yojana" (पालनहार योजना) ऐप/आइकन को खोजकर उस पर क्लिक करें।',
          'आवेदन पेज पर "Verify Aadhaar" (आधार सत्यापित करें) बटन पर क्लिक करके आधार OTP से सत्यापन पूरा करें।',
          'सत्यापन के बाद पालनहार रजिस्ट्रेशन फॉर्म खुलेगा। इसमें आवेदक (अभिभावक) और बच्चे का विवरण भरें।',
          'योजना की श्रेणी के अनुसार ज़रूरी दस्तावेज़ (आय प्रमाण पत्र, मृत्यु प्रमाण पत्र, पेंशन पीपीओ आदि) अपलोड करें।',
          'सभी जानकारी चेक करने के बाद आवेदन सबमिट (Submit) कर दें।'
        ]
      },
      {
        mode: 'ई-मित्र (E-Mitra) द्वारा',
        steps: [
          'आप अपने सभी मूल दस्तावेज़ और जन-आधार कार्ड लेकर नज़दीकी ई-मित्र (E-Mitra) कियोस्क पर जा सकते हैं।',
          'ई-मित्र संचालक आपका फॉर्म ऑनलाइन पोर्टल पर भरकर दस्तावेज़ अपलोड कर देगा और आपको आवेदन की रसीद दे देगा।'
        ]
      }
    ]
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
  console.log('Successfully inserted top schemes from all major states!');
}

run();
