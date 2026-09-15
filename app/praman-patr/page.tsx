import type {Metadata} from 'next';
import Link from 'next/link';
import {PageTitle} from '@/components/site';

export const metadata:Metadata={
  title:'प्रमाण पत्र कैसे बनाएं — आय, जाति, निवास, जन्म प्रमाण पत्र MP',
  description:'मध्य प्रदेश में आय प्रमाण पत्र, जाति प्रमाण पत्र, निवास प्रमाण पत्र, जन्म प्रमाण पत्र और समग्र ID कैसे बनाएं — ज़रूरी दस्तावेज़, ऑनलाइन आवेदन और पूरी प्रक्रिया हिन्दी में।',
  keywords:['प्रमाण पत्र','आय प्रमाण पत्र','जाति प्रमाण पत्र','निवास प्रमाण पत्र','जन्म प्रमाण पत्र','समग्र ID','MP प्रमाण पत्र','praman patr','income certificate MP','caste certificate','domicile certificate','MP e-district'],
  alternates:{canonical:'/praman-patr'},
  openGraph:{title:'प्रमाण पत्र कैसे बनाएं — MP',description:'आय, जाति, निवास, जन्म — सभी प्रमाण पत्र की जानकारी एक जगह।',locale:'hi_IN'},
};

const pramanPatr=[
  {
    id:'aay',
    emoji:'💰',
    title:'आय प्रमाण पत्र',
    english:'Income Certificate',
    use:'छात्रवृत्ति, सरकारी योजनाएं, OBC/EWS आरक्षण के लिए ज़रूरी।',
    docs:['🪪 आधार कार्ड','📋 समग्र ID','🏠 राशन कार्ड (यदि हो)','💼 स्व-घोषणा पत्र (आय का)','🖼️ पासपोर्ट साइज फ़ोटो'],
    steps:['MP e-District Portal (mpedistrict.gov.in) पर जाएं','अपना लॉगिन बनाएं या मोबाइल नंबर से प्रवेश करें','आय प्रमाण पत्र सेवा चुनें और फ़ॉर्म भरें','दस्तावेज़ upload करें और शुल्क (₹30-40) भरें','आवेदन जमा करने पर Reference Number मिलेगा','7-15 दिन में SMS पर जानकारी आएगी'],
    portal:'https://mpedistrict.gov.in',
    portalName:'MP e-District',
    note:'तहसीलदार कार्यालय से भी बनवाया जा सकता है।',
  },
  {
    id:'jati',
    emoji:'📜',
    title:'जाति प्रमाण पत्र',
    english:'Caste Certificate (SC/ST/OBC)',
    use:'आरक्षण, सरकारी नौकरी, छात्रवृत्ति के लिए अनिवार्य।',
    docs:['🪪 आधार कार्ड','📋 समग्र ID','👨‍👩‍👧 परिवार का पुराना जाति प्रमाण पत्र (यदि हो)','🏠 राशन कार्ड','🖼️ पासपोर्ट साइज फ़ोटो','📝 स्व-घोषणा पत्र'],
    steps:['MP e-District Portal पर जाएं','जाति प्रमाण पत्र सेवा खोजें','अपनी जाति वर्ग चुनें (SC/ST/OBC)','सभी दस्तावेज़ upload करें','आवेदन जमा करें — 15-30 दिन में प्राप्त होगा'],
    portal:'https://mpedistrict.gov.in',
    portalName:'MP e-District',
    note:'पहली बार आवेदन में पंचायत या पटवारी की रिपोर्ट लग सकती है।',
  },
  {
    id:'niwas',
    emoji:'🏠',
    title:'निवास / मूल निवास प्रमाण पत्र',
    english:'Domicile / Residence Certificate',
    use:'सरकारी नौकरी, कॉलेज एडमिशन, सरकारी योजनाओं के लिए।',
    docs:['🪪 आधार कार्ड','📋 समग्र ID','🏠 राशन कार्ड','⚡ बिजली / पानी का बिल','🖼️ पासपोर्ट साइज फ़ोटो'],
    steps:['MP e-District Portal पर जाएं','निवास प्रमाण पत्र सेवा चुनें','पता और दस्तावेज़ भरें','शुल्क (₹30) ऑनलाइन जमा करें','7-15 दिन में e-certificate मिलेगा'],
    portal:'https://mpedistrict.gov.in',
    portalName:'MP e-District',
    note:'MP में कम से कम 3 साल से रह रहे हों तो आवेदन कर सकते हैं।',
  },
  {
    id:'janm',
    emoji:'👶',
    title:'जन्म प्रमाण पत्र',
    english:'Birth Certificate',
    use:'स्कूल एडमिशन, पासपोर्ट, आधार कार्ड, विवाह पंजीकरण के लिए।',
    docs:['🏥 अस्पताल का जन्म रिकॉर्ड / Discharge slip','🪪 माता-पिता का आधार कार्ड','📋 समग्र ID','📝 आवेदन पत्र'],
    steps:['नगर पंचायत / ग्राम पंचायत / नगर पालिका जाएं','या CRS Portal (crsorgi.gov.in) पर ऑनलाइन आवेदन','जन्म के 21 दिन के अंदर — Free (देरी पर शुल्क)','दस्तावेज़ जमा करें और रसीद लें','3-7 दिन में प्रमाण पत्र मिलेगा'],
    portal:'https://crsorgi.gov.in',
    portalName:'CRS Portal (जन्म-मृत्यु पंजीकरण)',
    note:'21 दिन बाद आवेदन पर Court Order लग सकता है।',
  },
  {
    id:'samagra',
    emoji:'👥',
    title:'समग्र ID',
    english:'Samagra ID (MP Family Register)',
    use:'MP की लगभग सभी सरकारी योजनाओं के लिए अनिवार्य — लाड़ली बहना, संबल, छात्रवृत्ति।',
    docs:['🪪 आधार कार्ड','📱 रजिस्टर्ड मोबाइल नंबर','🖼️ पासपोर्ट साइज फ़ोटो','🏠 पते का प्रमाण (राशन कार्ड / बिजली बिल)'],
    steps:['Samagra Portal (samagra.gov.in) पर जाएं','परिवार ID खोजें — पहले check करें कि पहले से है या नहीं','नई ID के लिए ग्राम पंचायत / वार्ड कार्यालय जाएं','आधार e-KYC करवाएं','24-48 घंटे में Samagra ID मिलेगी'],
    portal:'https://samagra.gov.in',
    portalName:'Samagra Portal MP',
    note:'बिना समग्र ID के MP की अधिकांश योजनाओं का लाभ नहीं मिलेगा।',
  },
];

// Structured data for Google
const faqSchema={
  '@context':'https://schema.org',
  '@type':'FAQPage',
  mainEntity:pramanPatr.flatMap(p=>[
    {'@type':'Question',name:`${p.title} के लिए कौन-से दस्तावेज़ चाहिए?`,acceptedAnswer:{'@type':'Answer',text:p.docs.map(d=>d.replace(/^[\p{Emoji}\s]+/u,'')).join(', ')}},
    {'@type':'Question',name:`${p.title} कैसे बनवाएं?`,acceptedAnswer:{'@type':'Answer',text:p.steps.join(' → ')}},
  ]),
};

export default function PramanPatrPage(){
  return <main id="main" className="page-wrap">
    <PageTitle
      eyebrow="प्रमाण पत्र गाइड · मध्य प्रदेश"
      title="प्रमाण पत्र कैसे बनाएं?"
      description="आय, जाति, निवास, जन्म प्रमाण पत्र और समग्र ID — सब की जानकारी एक जगह। ज़रूरी दस्तावेज़, ऑनलाइन आवेदन और पूरी प्रक्रिया।"
    />

    {/* Quick nav */}
    <div className="pp-quicknav">
      {pramanPatr.map(p=><a key={p.id} href={`#${p.id}`} className="pp-chip">{p.emoji} {p.title}</a>)}
    </div>

    {pramanPatr.map(p=><section key={p.id} id={p.id} className="panel pp-card">
      <div className="pp-header">
        <span className="pp-emoji">{p.emoji}</span>
        <div>
          <h2>{p.title}</h2>
          <p className="english">{p.english}</p>
        </div>
      </div>
      <div className="pp-use"><b>📌 किस काम आता है:</b> {p.use}</div>

      <div className="pp-grid">
        <div>
          <h3>📁 ज़रूरी दस्तावेज़</h3>
          <ul className="pp-list">{p.docs.map((d,i)=><li key={i}>{d}</li>)}</ul>
        </div>
        <div>
          <h3>📝 आवेदन प्रक्रिया</h3>
          <ol className="pp-list">{p.steps.map((s,i)=><li key={i}>{s}</li>)}</ol>
        </div>
      </div>

      {p.note&&<div className="pp-note">⚠️ <b>ध्यान दें:</b> {p.note}</div>}
      <a className="btn" href={p.portal} target="_blank" rel="noopener noreferrer">
        {p.portalName} पर जाएं ↗
      </a>
    </section>)}

    <div className="panel pp-tip">
      <h2>💡 आवेदन करने से पहले याद रखें</h2>
      <ul>
        <li>किसी भी दलाल या एजेंट को अतिरिक्त पैसे न दें — सरकारी पोर्टल पर स्वयं आवेदन करें।</li>
        <li>OTP, UPI PIN या बैंक पासवर्ड किसी से साझा न करें।</li>
        <li>आवेदन की रसीद और Reference Number सुरक्षित रखें।</li>
        <li>स्थिति केवल आधिकारिक पोर्टल पर जाँचें।</li>
      </ul>
    </div>

    <div className="pp-related">
      <h2>संबंधित सरकारी योजनाएं</h2>
      <p>प्रमाण पत्र बनने के बाद इन योजनाओं के लिए आवेदन कर सकते हैं:</p>
      <div className="pp-links">
        {[
          {href:'/yojna/ladli-behna',label:'लाड़ली बहना योजना'},
          {href:'/yojna/seekho-kamao',label:'सीखो कमाओ योजना'},
          {href:'/yojna/gaon-ki-beti',label:'गांव की बेटी योजना'},
          {href:'/yojna/sambal-yojana',label:'संबल योजना'},
          {href:'/yojna/ladli-laxmi',label:'लाड़ली लक्ष्मी योजना'},
          {href:'/category/shiksha',label:'छात्रवृत्ति योजनाएं'},
        ].map(l=><Link key={l.href} href={l.href} className="btn secondary">{l.label} →</Link>)}
      </div>
    </div>

    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema).replace(/</g,'\\u003c')}}/>
  </main>;
}
