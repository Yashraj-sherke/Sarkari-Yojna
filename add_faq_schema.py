import os

path = 'app/page.tsx'
content = open(path, 'r', encoding='utf-8').read()

faq_schema = """
  const faqSchema={
    '@context':'https://schema.org',
    '@type':'FAQPage',
    mainEntity:[
      {
        '@type':'Question',
        name:'महिलाओं के लिए अभी कौन सी योजना चल रही है?',
        acceptedAnswer:{
          '@type':'Answer',
          text:'वर्तमान में महिलाओं के लिए कई प्रमुख योजनाएं चल रही हैं, जिनमें लाडली बहना योजना, महतारी वंदन योजना, पीएम मातृ वंदना योजना, और लखपति दीदी योजना प्रमुख हैं।'
        }
      },
      {
        '@type':'Question',
        name:'₹ 2100 किन महिलाओं को मिलेंगे?',
        acceptedAnswer:{
          '@type':'Answer',
          text:'हाल ही में कुछ राज्य सरकारों (जैसे महाराष्ट्र में माझी लाडकी बहीण योजना) द्वारा गरीब महिलाओं को मासिक 2100 रुपये देने की घोषणाएं की गई हैं। यह 21 से 60 वर्ष की गरीब और बेसहारा महिलाओं को दी जाती है।'
        }
      },
      {
        '@type':'Question',
        name:'गरीबों के लिए कौन-कौन सी योजना चल रही है?',
        acceptedAnswer:{
          '@type':'Answer',
          text:'गरीब परिवारों के लिए केंद्र सरकार की कई योजनाएं हैं: 1. पीएम गरीब कल्याण अन्न योजना 2. आयुष्मान भारत योजना 3. पीएम आवास योजना 4. पीएम उज्ज्वला योजना।'
        }
      },
      {
        '@type':'Question',
        name:'महिलाओं को 10,000 कैसे मिलेंगे?',
        acceptedAnswer:{
          '@type':'Answer',
          text:'महिलाओं को 10,000 रुपये की सहायता स्वनिधि योजना या मुद्रा योजना (शिशु लोन) के तहत बिना गारंटी के लोन के रूप में मिल सकती है।'
        }
      }
    ]
  };
"""

insert_target = '  return ('

if insert_target in content:
    content = content.replace(insert_target, faq_schema + "\n" + insert_target)
    
    # Also need to add the script tag to the return block
    #   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema)}}/>
    
    script_target = '<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(collectionSchema)}}/>'
    script_replacement = script_target + '\n      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema)}}/>'
    
    content = content.replace(script_target, script_replacement)
    
    open(path, 'w', encoding='utf-8').write(content)
    print("FAQ Schema Added to page.tsx")
else:
    print("Could not find insertion point")
