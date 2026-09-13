import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'हमारे बारे में',
  description: 'Sarkari Yojna एक स्वतंत्र नागरिक सहायता मंच है। जानें हम क्या करते हैं और क्यों।',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <main id="main" className="page-wrap">
      <div className="page-heading">
        <p className="eyebrow green-text">हमारे बारे में</p>
        <h1>सरकारी योजना — एक स्वतंत्र पहल</h1>
        <p>हर योजना की सही जानकारी, आसान भाषा में।</p>
      </div>

      <div className="prose">
        <section className="panel">
          <h2>हम क्या हैं?</h2>
          <p>
            Sarkari Yojna एक <strong>स्वतंत्र information platform</strong> है जो भारत के नागरिकों को
            सरकारी योजनाओं और सेवाओं की जानकारी <strong>सरल हिन्दी</strong> में देता है।
          </p>
          <p>
            हमारा मकसद है कि हर नागरिक — चाहे वो किसान हो, विद्यार्थी हो, महिला हो, वरिष्ठ नागरिक हो
            या दिव्यांग — अपने लिए उपलब्ध योजनाओं को आसानी से खोज सके, समझ सके और सही सरकारी पोर्टल
            तक पहुँच सके।
          </p>
        </section>

        <section className="panel">
          <h2>हम क्या नहीं हैं</h2>
          <p>
            <strong>यह Government of India या किसी State Government की official website नहीं है।</strong>
          </p>
          <p>
            हम सरकारी योजनाओं का आवेदन स्वीकार नहीं करते। हम किसी भी प्रकार का शुल्क नहीं लेते।
            आवेदन केवल संबंधित सरकारी विभाग के official portal पर ही करें।
          </p>
        </section>

        <section className="panel">
          <h2>हमारा दृष्टिकोण</h2>
          <p><strong>"A Government Benefits Navigator for every Indian family."</strong></p>
          <ul>
            <li>🏛️ <strong>राज्य-स्तरीय गहराई</strong> — मध्य प्रदेश की हर योजना, केंद्रीय योजनाओं के साथ</li>
            <li>👨‍👩‍👧‍👦 <strong>परिवार-स्तरीय खोज</strong> — एक जगह पूरे परिवार के लिए सुझाव</li>
            <li>🔍 <strong>पारदर्शी मिलान</strong> — क्यों दिखाई, कौन-सी शर्त मिली, कौन-सी बाकी</li>
            <li>⏰ <strong>रिमाइंडर</strong> — डेडलाइन और नवीनीकरण की याद दिलाएं</li>
            <li>📱 <strong>सरल और हल्का</strong> — कम बैंडविड्थ और बेसिक फ़ोन पर भी चले</li>
          </ul>
        </section>

        <section className="panel">
          <h2>विश्वसनीयता</h2>
          <p>
            हम सरकारी स्रोतों (.gov.in / .nic.in) से जानकारी जुटाते हैं। हर योजना की जानकारी के साथ
            उसका official source और verification status दिखाया जाता है।
          </p>
          <p>
            अगर कोई जानकारी अधूरी या पुरानी लगे, तो कृपया योजना पेज पर
            <strong> "क्या इस जानकारी में गलती है?"</strong> का उपयोग करें।
          </p>
        </section>

        <section className="panel">
          <h2>सुरक्षा</h2>
          <p>
            हम आपसे कभी भी <strong>आधार नंबर, बैंक खाता, OTP, ATM PIN, UPI PIN या password</strong> नहीं माँगते।
          </p>
          <p>
            अगर कोई व्यक्ति इस मंच के नाम से ऐसी जानकारी माँगे, तो वह <strong>धोखाधड़ी</strong> है।
            तुरंत साइबर हेल्पलाइन <strong>1930</strong> पर कॉल करें।
          </p>
        </section>
      </div>

      <div style={{ marginTop: 30 }}>
        <Link className="btn" href="/">योजनाएं खोजें →</Link>
      </div>
    </main>
  );
}
