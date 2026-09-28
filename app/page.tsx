import { summarizeScheme } from '@/lib/scheme-summary';
import { allSchemes } from '@/lib/server';
import { getAllSamachar } from '@/lib/samachar';
import { Directory } from '@/components/directory';
import { DEFAULT_OG_IMAGE, SITE_NAME_EN, SITE_ALTERNATE_NAMES, SITE_URL } from '@/lib/config';
import { isIndexableScheme } from '@/lib/seo';

const title = 'Sarkari Yojana — सरकारी योजनाओं के लाभ, पात्रता और आवेदन';
const description = 'Sarkari Yojana पर केंद्र और मध्य प्रदेश की योजनाएं खोजें। लाभ, पात्रता, दस्तावेज़ और आवेदन प्रक्रिया सरल हिन्दी में समझें और आधिकारिक स्रोत देखें। स्वतंत्र सूचना मंच।';
export const metadata = {
  title: {absolute: title}, description,
  alternates: {canonical: '/'},
  openGraph: {title, description, url: SITE_URL, siteName: SITE_NAME_EN, type: 'website', locale: 'hi_IN', images: [{url: DEFAULT_OG_IMAGE, alt: 'Sarkari Yojana लोगो'}]},
  twitter: {card: 'summary', title, description, images: [DEFAULT_OG_IMAGE]},
};

export const revalidate = 3600;

export default async function Home() {
  const schemes = await allSchemes();
  const news = await getAllSamachar();
  const latestNews = news.slice(0, 3).map(({ body, ...rest }) => rest);
  const reviewedSchemes = schemes.filter(isIndexableScheme);
  const websiteSchema={
    '@context':'https://schema.org',
    '@type':'WebSite',
    '@id':`${SITE_URL}/#website`,
    inLanguage:'hi-IN',
    publisher:{'@id':`${SITE_URL}/#organization`},
    name:SITE_NAME_EN,
    alternateName:SITE_ALTERNATE_NAMES,
    url:`${SITE_URL}/`,
  };

  const organizationSchema={
    '@context':'https://schema.org',
    '@type':'Organization',
    '@id':`${SITE_URL}/#organization`,
    description:'Sarkari Yojana is an independent citizen-information platform for discovering and understanding Indian Central and State Government schemes.',
    name:SITE_NAME_EN,
    alternateName:SITE_ALTERNATE_NAMES,
    url:`${SITE_URL}/`,
    logo:`${SITE_URL}/icon-192.png`
  };

  const collectionSchema={
    '@context':'https://schema.org',
    '@type':'CollectionPage',
    '@id':`${SITE_URL}/#schemes`,
    name:title,
    description,
    inLanguage:'hi-IN',
    isPartOf:{'@id':`${SITE_URL}/#website`},
    mainEntity:{
      '@type':'ItemList',
      numberOfItems:reviewedSchemes.length,
      itemListElement:reviewedSchemes.map((scheme,index)=>({
        '@type':'ListItem',
        position:index+1,
        name:scheme.title,
        url:`${SITE_URL}/yojna/${scheme.slug}`,
      })),
    },
  };


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

  return (
    <>
      <Directory schemes={schemes.map(summarizeScheme)} latestNews={latestNews} initialState="central" isHomePage={true} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteSchema).replace(/</g,'\\u003c')}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organizationSchema).replace(/</g,'\\u003c')}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(collectionSchema).replace(/</g,'\\u003c')}}/>
    </>
  );
}
