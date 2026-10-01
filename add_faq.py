import os

path = 'components/directory.tsx'
content = open(path, 'r', encoding='utf-8').read()

faq_html = """
      {isHomePage && (
        <section className="faq-section" style={{marginTop: 40, marginBottom: 40, background: '#fff', borderRadius: 12, padding: '25px', border: '1px solid #e2e8f0'}}>
          <div className="section-heading" style={{marginBottom: 20}}>
            <h2>लोग यह भी पूछते हैं (People Also Ask)</h2>
            <p style={{color: '#718096'}}>सरकारी योजनाओं से जुड़े सबसे आम सवालों के प्रमाणित जवाब</p>
          </div>
          
          <div className="faq-accordion" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <details style={{background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer'}}>
              <summary style={{fontWeight: 600, fontSize: '1.05rem', color: '#2d3748', outline: 'none'}}>महिलाओं के लिए अभी कौन सी योजना चल रही है?</summary>
              <div style={{marginTop: '15px', color: '#4a5568', lineHeight: 1.6, fontSize: '0.95rem'}}>
                वर्तमान में महिलाओं के लिए कई प्रमुख योजनाएं चल रही हैं, जिनमें <strong>लाडली बहना योजना</strong> (मध्य प्रदेश), <strong>महतारी वंदन योजना</strong> (छत्तीसगढ़), <strong>पीएम मातृ वंदना योजना</strong> (गर्भवती महिलाओं के लिए), और <strong>लखपति दीदी योजना</strong> (स्वयं सहायता समूहों के लिए) प्रमुख हैं। इन योजनाओं के तहत महिलाओं को 1000 रुपये से लेकर 3000 रुपये तक की मासिक या एकमुश्त आर्थिक सहायता दी जाती है।
              </div>
            </details>
            
            <details style={{background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer'}}>
              <summary style={{fontWeight: 600, fontSize: '1.05rem', color: '#2d3748', outline: 'none'}}>₹ 2100 किन महिलाओं को मिलेंगे?</summary>
              <div style={{marginTop: '15px', color: '#4a5568', lineHeight: 1.6, fontSize: '0.95rem'}}>
                हाल ही में कुछ राज्य सरकारों (जैसे महाराष्ट्र में <strong>माझी लाडकी बहीण योजना</strong> के तहत वादे और झारखंड की योजनाओं में) द्वारा महिलाओं को मासिक 2100 रुपये देने की घोषणाएं की गई हैं। यह राशि आमतौर पर 21 से 60 वर्ष की उन गरीब और बेसहारा महिलाओं को दी जाती है जिनके परिवार की वार्षिक आय 2.5 लाख रुपये से कम है। सटीक जानकारी के लिए अपने राज्य की महिला एवं बाल विकास वेबसाइट देखें।
              </div>
            </details>

            <details style={{background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer'}}>
              <summary style={{fontWeight: 600, fontSize: '1.05rem', color: '#2d3748', outline: 'none'}}>गरीबों के लिए कौन-कौन सी योजना चल रही है?</summary>
              <div style={{marginTop: '15px', color: '#4a5568', lineHeight: 1.6, fontSize: '0.95rem'}}>
                गरीब परिवारों के लिए केंद्र सरकार की कई योजनाएं हैं: 
                <br/>1. <strong>पीएम गरीब कल्याण अन्न योजना (PMGKAY)</strong> - मुफ्त राशन
                <br/>2. <strong>आयुष्मान भारत योजना</strong> - 5 लाख तक का मुफ्त इलाज
                <br/>3. <strong>पीएम आवास योजना (PMAY)</strong> - पक्का घर बनाने के लिए सब्सिडी
                <br/>4. <strong>पीएम उज्ज्वला योजना</strong> - मुफ्त गैस कनेक्शन
              </div>
            </details>
            
            <details style={{background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer'}}>
              <summary style={{fontWeight: 600, fontSize: '1.05rem', color: '#2d3748', outline: 'none'}}>महिलाओं को 10,000 कैसे मिलेंगे?</summary>
              <div style={{marginTop: '15px', color: '#4a5568', lineHeight: 1.6, fontSize: '0.95rem'}}>
                महिलाओं को 10,000 रुपये या उससे अधिक की सहायता <strong>स्वनिधि योजना</strong> या <strong>मुद्रा योजना (शिशु लोन)</strong> के तहत बिना गारंटी के लोन के रूप में मिल सकती है, जिससे वे अपना छोटा व्यवसाय शुरू कर सकें। इसके अलावा <strong>लखपति दीदी योजना</strong> के तहत महिलाओं को कौशल प्रशिक्षण देकर 1 लाख रुपये सालाना कमाने के योग्य बनाया जा रहा है।
              </div>
            </details>
          </div>
        </section>
      )}
"""

# Insert before the <section id="scheme-categories">
insert_target = '<section id="scheme-categories" className="categories-section">'

if insert_target in content:
    content = content.replace(insert_target, faq_html + "\n      " + insert_target)
    open(path, 'w', encoding='utf-8').write(content)
    print("FAQ Section Added to directory.tsx")
else:
    print("Could not find insertion point")
