export function MPSuccessStories() {
  return (
    <section className="bg-white border-y border-gray-200 py-12 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">सफलता की कहानियाँ (Success Stories)</h2>
          <p className="mt-4 text-lg text-gray-600">मध्य प्रदेश की सरकारी योजनाओं से लाभान्वित नागरिकों की वास्तविक कहानियाँ।</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-pink-50 rounded-xl p-6 shadow-sm border border-pink-100">
            <h3 className="text-xl font-bold text-pink-800 mb-2">लाडली बहना योजना ने दी आर्थिक आज़ादी</h3>
            <p className="text-gray-700 mb-4">"हर महीने मिलने वाले ₹1250 से मैंने अपनी छोटी सी सिलाई की दुकान शुरू की। अब मैं अपने बच्चों की पढ़ाई का खर्च खुद उठा सकती हूँ।"</p>
            <p className="text-sm font-semibold text-gray-900">- सुनीता देवी, सीहोर</p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-2">सीखो कमाओ योजना से मिला रोज़गार</h3>
            <p className="text-gray-700 mb-4">"आईटीआई करने के बाद नौकरी नहीं मिल रही थी। मुख्यमंत्री सीखो कमाओ योजना में रजिस्ट्रेशन कराया। ट्रेनिंग के साथ स्टाइपेंड मिला और अब उसी कंपनी में पक्की नौकरी है।"</p>
            <p className="text-sm font-semibold text-gray-900">- राहुल अहिरवार, भोपाल</p>
          </div>

          <div className="bg-green-50 rounded-xl p-6 shadow-sm border border-green-100">
            <h3 className="text-xl font-bold text-green-800 mb-2">किसान कल्याण योजना से मिली राहत</h3>
            <p className="text-gray-700 mb-4">"पीएम किसान और सीएम किसान कल्याण की राशि मिलाकर मुझे समय पर पैसे मिलते हैं, जिससे समय पर खाद-बीज का इंतजाम आसानी से हो जाता है।"</p>
            <p className="text-sm font-semibold text-gray-900">- रामेश्वर पटेल, उज्जैन</p>
          </div>
        </div>
      </div>
    </section>
  );
}
