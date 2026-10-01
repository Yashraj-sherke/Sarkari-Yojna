import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const scheme = {
  slug: "mukhyamantri-majhi-ladki-bahin-yojana",
  title: "मुख्यमंत्री माझी लाडकी बहीण योजना",
  english: "Mukhyamantri Majhi Ladki Bahin Yojana",
  category: "mahila",
  state: "maharashtra",
  summary: "महाराष्ट्र सरकार की इस योजना के तहत राज्य की पात्र महिलाओं को हर महीने ₹1,500 की आर्थिक सहायता दी जाती है।",
  benefit: "₹1,500 प्रति माह",
  department: "महिला एवं बाल विकास विभाग, महाराष्ट्र",
  documents: [
    "आधार कार्ड (बैंक खाते से लिंक)",
    "निवास प्रमाण पत्र (Domicile Certificate)",
    "आय प्रमाण पत्र (2.5 लाख से कम)",
    "बैंक पासबुक",
    "राशन कार्ड",
    "पासपोर्ट साइज फोटो",
    "हमपत्र (Undertaking)"
  ],
  steps: [
    "आधिकारिक वेबसाइट ladakibahin.maharashtra.gov.in पर जाएं।",
    "पोर्टल पर 'अर्जदार लॉगिन' (Applicant Login) पर क्लिक करें।",
    "नया अकाउंट बनाएं (Sign Up) और आवश्यक जानकारी भरें।",
    "लॉगिन करने के बाद आवेदन फॉर्म में अपनी व्यक्तिगत जानकारी, बैंक डिटेल्स आदि दर्ज करें।",
    "आवश्यक दस्तावेज स्कैन करके अपलोड करें।",
    "फॉर्म की समीक्षा करें और सबमिट करें।",
    "आवेदन के बाद अपनी स्थिति ऑनलाइन चेक करते रहें।"
  ],
  rules: [
    { field: "state", op: "eq", value: "maharashtra", label: "महाराष्ट्र के निवासी" },
    { field: "gender", op: "eq", value: "female", label: "केवल महिलाओं के लिए" },
    { field: "age", op: "gte", value: 21, label: "21 वर्ष या उससे अधिक उम्र" },
    { field: "age", op: "lte", value: 65, label: "अधिकतम 65 वर्ष की आयु" },
    { field: "income", op: "lte", value: 250000, label: "वार्षिक पारिवारिक आय 2.50 लाख से कम" }
  ],
  sourceUrl: "https://ladakibahin.maharashtra.gov.in/",
  applicationUrl: "https://ladakibahin.maharashtra.gov.in/",
  sourceNotes: "मुख्यमंत्री माझी लाडकी बहीण योजना - महिला एवं बाल विकास विभाग, महाराष्ट्र सरकार",
  status: "ACTIVE",
  priority: true,
  isSample: false,
  verifiedAt: new Date().toISOString(),
  nextReviewAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  detailedDescription: [
    "मुख्यमंत्री माझी लाडकी बहीण योजना महाराष्ट्र सरकार द्वारा शुरू की गई एक प्रमुख कल्याणकारी योजना है। इस योजना का मुख्य उद्देश्य राज्य की महिलाओं को आर्थिक रूप से सशक्त बनाना और उन्हें आत्मनिर्भर बनाना है।",
    "योजना के अंतर्गत पात्र महिलाओं के बैंक खाते में सीधे (DBT के माध्यम से) हर महीने ₹1,500 ट्रांसफर किए जाते हैं, जिससे उन्हें अपनी बुनियादी जरूरतें पूरी करने में मदद मिलती है।",
    "यह योजना मुख्य रूप से उन गरीब और आर्थिक रूप से कमजोर परिवारों की महिलाओं के लिए है जिनकी पारिवारिक आय ₹2.5 लाख प्रति वर्ष से कम है।"
  ],
  benefitsList: [
    { heading: "आर्थिक सहायता", points: ["हर महीने ₹1,500 की नकद सहायता सीधे बैंक खाते में (DBT)।", "आर्थिक स्वतंत्रता और परिवार की पोषण सुरक्षा में मदद।"] }
  ],
  eligibilityDescription: [
    "आवेदक महिला महाराष्ट्र राज्य की स्थायी निवासी होनी चाहिए।",
    "महिला की आयु 21 वर्ष से 65 वर्ष के बीच होनी चाहिए।",
    "आवेदक के परिवार की कुल वार्षिक आय ₹2.50 लाख से अधिक नहीं होनी चाहिए।",
    "महिला का बैंक खाता उसके आधार कार्ड से लिंक (e-KYC) होना अनिवार्य है।"
  ],
  exclusions: [
    "जिनके परिवार का कोई सदस्य आयकर दाता (Income Tax Payer) है।",
    "सरकारी नौकरी या नियमित पेंशन प्राप्त करने वाली महिलाएं।",
    "जिनके परिवार के पास 5 एकड़ से अधिक सिंचित कृषि भूमि है।",
    "जिनके परिवार के पास चार पहिया वाहन (ट्रैक्टर छोड़कर) है।"
  ],
  applicationProcess: [
    { mode: "ऑनलाइन", steps: [
      "आधिकारिक पोर्टल (ladakibahin.maharashtra.gov.in) खोलें।",
      "पोर्टल पर 'अर्जदार लॉगिन' (Applicant Login) पर क्लिक करें।",
      "मोबाइल नंबर और OTP के माध्यम से नया अकाउंट बनाएं।",
      "लॉगिन करने के बाद आवेदन फॉर्म में अपनी व्यक्तिगत जानकारी, बैंक डिटेल्स आदि दर्ज करें।",
      "आधार कार्ड, आय प्रमाण पत्र, निवास प्रमाण पत्र और अन्य आवश्यक दस्तावेज अपलोड करें।",
      "फॉर्म की समीक्षा करें और 'Submit' पर क्लिक करें।",
      "Acknowledgement number सेव करें।"
    ]}
  ],
  faqs: [
    { question: "मुख्यमंत्री माझी लाडकी बहीण योजना क्या है?", answer: "यह महाराष्ट्र सरकार की एक योजना है जिसमें पात्र महिलाओं को हर महीने ₹1,500 की आर्थिक मदद दी जाती है।" },
    { question: "इस योजना के लिए उम्र सीमा क्या है?", answer: "इस योजना का लाभ लेने के लिए महिला की उम्र 21 वर्ष से 65 वर्ष के बीच होनी चाहिए।" },
    { question: "क्या आवेदन के लिए आय प्रमाण पत्र जरूरी है?", answer: "हां, परिवार की वार्षिक आय ₹2.50 लाख से कम होने का आय प्रमाण पत्र आवश्यक है (हालांकि राशन कार्ड धारकों को कुछ छूट मिल सकती है)।" },
    { question: "पैसे कैसे मिलेंगे?", answer: "योजना की राशि हर महीने सीधे महिला के आधार-लिंक किए गए बैंक खाते में (DBT द्वारा) भेजी जाएगी।" },
    { question: "क्या ई-केवाईसी (e-KYC) अनिवार्य है?", answer: "हां, बैंक खाते में पैसे प्राप्त करने के लिए खाते का आधार कार्ड से लिंक और ई-केवाईसी होना अनिवार्य है।" }
  ],
  lastUpdated: new Date().toISOString(),
  editorial: { verificationStatus: 'VERIFIED_CORE', publicationStatus: 'REVIEWED', note: 'Verified from official guidelines and news sources.', reviewedAt: new Date().toISOString() },
  references: [{title: 'Official Portal', organization: 'Govt of Maharashtra', url: 'https://ladakibahin.maharashtra.gov.in/', sections: ['guidelines'], accessedAt: new Date().toISOString()}],
  practicalGuidance: [
    "आवेदन करने से पहले सुनिश्चित करें कि आपका बैंक खाता आधार से लिंक (Aadhaar Seeded) है।",
    "अगर OTP नहीं आ रहा है, तो आधार में अपना मोबाइल नंबर अपडेट कराएं।"
  ],
  trackingGuidance: "आप आधिकारिक वेबसाइट पर 'Applicant Login' के माध्यम से अपनी आवेदन स्थिति की जांच कर सकते हैं।",
  seoDescription: "महाराष्ट्र सरकार की 'मुख्यमंत्री माझी लाडकी बहीण योजना' के अंतर्गत महिलाओं को हर महीने ₹1500 की आर्थिक सहायता। जानिए पात्रता, दस्तावेज, और ऑनलाइन आवेदन की प्रक्रिया।"
};

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const dataJson = JSON.stringify(scheme);
    const status = scheme.status;
    const nextReviewAt = scheme.nextReviewAt;
    const now = new Date().toISOString();
    
    await pool.query(`
      INSERT INTO schemes (slug, type, data, status, next_review_at, updated_at)
      VALUES ($1, 'scheme', $2, $3, $4, $5)
      ON CONFLICT (slug) DO UPDATE 
      SET data = EXCLUDED.data, status = EXCLUDED.status, next_review_at = EXCLUDED.next_review_at, updated_at = EXCLUDED.updated_at
    `, [scheme.slug, dataJson, status, nextReviewAt, now]);
    
    console.log(`Upserted scheme: ${scheme.slug}`);
  } catch (err) {
    console.error('Error seeding DB:', err);
  } finally {
    await pool.end();
  }
}

run();
