import { getLocalDb } from '../lib/local-db';
import { seeds } from '../lib/seed';

const db = getLocalDb();

console.log('🌱 Seeding database...');

const insert = db.prepare(
  'INSERT OR IGNORE INTO schemes (slug, data, status, next_review_at, updated_at) VALUES (?, ?, ?, ?, ?)'
);

const now = new Date().toISOString();

for (const s of seeds) {
  insert.run(s.slug, JSON.stringify(s), s.status, s.nextReviewAt, now);
  console.log(`  ✓ ${s.slug}`);
}

// Create default admin user (password: admin123)
// bcrypt hash of "admin123"
const adminId = 'admin-default-001';
const passwordHash = '$2a$10$rOYaLxBmHqHkZXQkjDN0pOp.qRBcbKQU5gYFiLvnJqVflFR5S4edy';
db.prepare('INSERT OR IGNORE INTO admin_users (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)')
  .run(adminId, 'admin', passwordHash, now);
console.log('  ✓ Admin user created (username: admin, password: admin123)');

// Seed guide articles
const guides = [
  {
    slug: 'ration-card-kaise-banvaye',
    title: 'राशन कार्ड कैसे बनवाएं — पूरी जानकारी',
    summary: 'राशन कार्ड बनवाने की पूरी प्रक्रिया, ज़रूरी दस्तावेज़ और ऑनलाइन/ऑफ़लाइन तरीके।',
    content: `## राशन कार्ड क्या है?

राशन कार्ड एक सरकारी दस्तावेज़ है जो गरीब परिवारों को सस्ते दर पर अनाज और ज़रूरी सामान दिलाने में मदद करता है। यह पहचान प्रमाण के रूप में भी काम आता है।

## राशन कार्ड के प्रकार

- **अंत्योदय (AAY)** — सबसे गरीब परिवारों के लिए
- **प्राथमिकता (PHH)** — गरीबी रेखा से नीचे के परिवारों के लिए
- **APL** — गरीबी रेखा से ऊपर के परिवारों के लिए

## ज़रूरी दस्तावेज़

- आधार कार्ड (परिवार के सभी सदस्यों का)
- आय प्रमाण पत्र
- निवास प्रमाण पत्र
- पासपोर्ट साइज़ फ़ोटो
- बैंक पासबुक की कॉपी

## आवेदन कैसे करें

1. अपने नज़दीकी CSC केंद्र या तहसील कार्यालय जाएं
2. राशन कार्ड आवेदन फ़ॉर्म भरें
3. सभी ज़रूरी दस्तावेज़ जमा करें
4. फ़ॉर्म जमा करने पर रसीद लें
5. अधिकारी द्वारा सत्यापन के बाद कार्ड जारी होगा

## ऑनलाइन आवेदन

कई राज्यों में ऑनलाइन आवेदन की सुविधा उपलब्ध है। अपने राज्य की खाद्य विभाग की वेबसाइट पर जाएं।

> **ध्यान दें:** यह सामान्य जानकारी है। हर राज्य में प्रक्रिया थोड़ी अलग हो सकती है। कृपया अपने राज्य के खाद्य विभाग की official website पर पूरी शर्तें जाँचें।`,
    category: 'khadya',
  },
  {
    slug: 'aay-praman-patra',
    title: 'आय प्रमाण पत्र क्या है और कैसे बनेगा',
    summary: 'आय प्रमाण पत्र की ज़रूरत, बनवाने का तरीका और ज़रूरी दस्तावेज़ों की पूरी सूची।',
    content: `## आय प्रमाण पत्र क्यों ज़रूरी है?

आय प्रमाण पत्र एक सरकारी दस्तावेज़ है जो आपके परिवार की सालाना आय को प्रमाणित करता है। यह कई सरकारी योजनाओं, छात्रवृत्तियों और सब्सिडी के लिए ज़रूरी होता है।

## कहाँ काम आता है

- सरकारी योजनाओं के आवेदन में
- छात्रवृत्ति के लिए
- स्कूल/कॉलेज में फ़ीस छूट के लिए
- राशन कार्ड बनवाने के लिए
- EWS प्रमाण पत्र के लिए

## ज़रूरी दस्तावेज़

- आवेदन पत्र
- आधार कार्ड
- स्वयं घोषणा पत्र (Self Declaration)
- राशन कार्ड की कॉपी
- पासपोर्ट साइज़ फ़ोटो

## कैसे बनवाएं

1. **ऑनलाइन:** अपने राज्य के ई-सेवा पोर्टल पर आवेदन करें
2. **ऑफ़लाइन:** तहसील कार्यालय या CSC केंद्र पर जाएं
3. सभी दस्तावेज़ जमा करें
4. सत्यापन के बाद प्रमाण पत्र जारी होगा

## कितने दिन में बनता है

आमतौर पर 7-15 कार्यदिवस में बन जाता है। ऑनलाइन आवेदन में कम समय लगता है।

> **याद रखें:** आय प्रमाण पत्र की वैधता आमतौर पर 6 महीने से 1 साल तक होती है। नवीनीकरण की प्रक्रिया अपने राज्य की वेबसाइट पर जाँचें।`,
    category: 'shiksha',
  },
  {
    slug: 'nivas-praman-patra',
    title: 'निवास प्रमाण पत्र (Domicile Certificate) कैसे बनवाएं',
    summary: 'निवास प्रमाण पत्र बनवाने की पूरी प्रक्रिया और सरकारी योजनाओं में इसका महत्व।',
    content: `## निवास प्रमाण पत्र क्या है?

निवास प्रमाण पत्र (Domicile Certificate) यह साबित करता है कि आप किसी विशेष राज्य या जिले के स्थायी निवासी हैं। कई राज्य-स्तरीय योजनाओं के लिए यह ज़रूरी है।

## कहाँ ज़रूरी होता है

- राज्य सरकार की योजनाओं में
- सरकारी नौकरी में राज्य कोटा के लिए
- शैक्षणिक संस्थानों में प्रवेश के लिए
- संपत्ति खरीदने में (कुछ राज्यों में)

## ज़रूरी दस्तावेज़

- आधार कार्ड
- वोटर आईडी या राशन कार्ड
- बिजली/पानी का बिल
- स्कूल का प्रमाण पत्र
- पासपोर्ट साइज़ फ़ोटो
- स्वघोषणा पत्र

## आवेदन प्रक्रिया

1. तहसील कार्यालय या ऑनलाइन पोर्टल पर आवेदन करें
2. सभी ज़रूरी दस्तावेज़ संलग्न करें
3. शुल्क जमा करें
4. अधिकारी सत्यापन करेंगे
5. प्रमाण पत्र जारी होगा

> **महत्वपूर्ण:** हर राज्य की अपनी प्रक्रिया है। मध्य प्रदेश में आप mpedistrict.gov.in से ऑनलाइन आवेदन कर सकते हैं।`,
    category: 'rojgar',
  },
];

const insertGuide = db.prepare(
  'INSERT OR IGNORE INTO guides (slug, title, summary, content, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
);

for (const g of guides) {
  insertGuide.run(g.slug, g.title, g.summary, g.content, g.category, now, now);
  console.log(`  ✓ Guide: ${g.slug}`);
}

console.log('\n✅ Database seeded successfully!');
console.log('   Admin login: username=admin, password=admin123');
