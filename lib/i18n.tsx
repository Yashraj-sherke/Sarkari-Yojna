'use client';
import {createContext, useContext, useState, useEffect, type ReactNode} from 'react';

export type Lang = 'hi' | 'en';

const translations = {
  hi: {
    // Brand
    brandName: 'सरकारी योजना',
    brandTagline: 'SARKARI YOJNA',

    // Independent notice
    independent: 'एक स्वतंत्र पहल। सरकारी वेबसाइट नहीं है।',
    yourInfo: 'आपकी जानकारी, आपकी भाषा में',

    // Navigation
    navSearch: 'योजनाएं खोजें',
    navForMe: 'मेरे लिए योजनाएं',
    navFamily: 'मेरा परिवार',
    navGuide: 'आसान गाइड',
    navMenu: 'मेन्यू',
    navSaved: 'सहेजी योजनाएं',
    navReminders: 'मेरे रिमाइंडर',

    // Footer
    footerTagline: 'सही जानकारी। बेहतर अवसर।',
    footerDisclaimer: 'Sarkari Yojna सरकारी वेबसाइट नहीं है। आवेदन केवल संबंधित official government portal पर करें।',
    footerFree: 'बुनियादी योजना खोज हमेशा निःशुल्क।',
    footerPrivacy: 'गोपनीयता',
    footerTerms: 'शर्तें',
    footerDisclaimer2: 'अस्वीकरण',
    footerAdmin: 'व्यवस्थापक',

    // Sidebar
    sidebarForYou: 'आपके लिए',
    sidebarByCategory: 'श्रेणी के अनुसार',
    sidebarSafetyTitle: 'आपकी सुरक्षा पहले',
    sidebarSafetyDesc: 'OTP, UPI PIN या bank password किसी के साथ साझा न करें।',
    sidebarSafetyLink: 'सुरक्षित रहें',

    // Directory
    heroBadge: 'हर नागरिक के लिए, हर कदम पर',
    heroTitle: 'आपका हक़। आपकी योजना।',
    heroSubtitle: 'सही जानकारी, आसान भाषा में।',
    heroDesc: 'अपने और अपने परिवार के लिए सरकारी योजनाएं खोजें।\nलाभ समझें, पात्रता जानें और सही जगह आवेदन करें।',
    searchPlaceholder: 'योजना का नाम या ज़रूरत लिखें…',
    searchBtn: 'खोजें',
    searchSuggest: 'जैसे:',
    searchTags: ['किसान', 'छात्रवृत्ति', 'आवास', 'पेंशन'],
    matchTitle: 'कौन-सी योजना\nआपके लिए है?',
    matchDesc: 'कुछ आसान सवाल।\nआपकी ज़रूरत के मुताबिक सुझाव।',
    matchBtn: 'मेरे लिए योजनाएं',
    matchPrivacy: 'बिना अकाउंट, बिना आधार नंबर',
    matchStart: 'शुरुआत यहाँ से करें',
    trustSource: 'सरकारी स्रोतों से जुड़ें',
    trustSimple: 'सरल हिन्दी में समझें',
    trustPrivacy: 'व्यक्तिगत पहचान की ज़रूरत नहीं',
    categoryHeading: 'आप किसके लिए खोज रहे हैं?',
    categorySubtext: 'अपनी ज़रूरत के अनुसार एक श्रेणी चुनें',
    allCategories: 'सभी श्रेणियां',
    filterAll: 'सभी योजनाएं',
    filterVerified: 'केवल सत्यापित',
    filterReset: 'फ़िल्टर हटाएं',
    stateFilter: 'राज्य चुनें',
    stateAll: 'सभी क्षेत्र',
    stateMP: 'मध्य प्रदेश',
    stateOther: 'अन्य राज्य',
    stateCentral: 'केवल केंद्र',
    resultsFor: 'के लिए नतीजे',
    resultsDefault: 'योजनाएं, जो आपके काम आ सकती हैं',
    resultsSuffix: 'योजनाएं उपलब्ध · लाभ और ज़रूरी जानकारी एक जगह',
    verifiedCount: 'स्रोत से सत्यापित',
    sourceNote: 'सरकारी स्रोतों से संकलित जानकारी · लाभ और पात्रता की अंतिम पुष्टि संबंधित विभाग करता है।',
    guideBannerTitle: 'सरकारी कागज़ात अब थोड़े आसान',
    guideBannerDesc: 'आय प्रमाण पत्र, राशन कार्ड और आवेदन की तैयारी — सरल हिन्दी में।',
    guideBannerLink: 'आसान गाइड पढ़ें',
    emptyDefault: 'अभी कोई योजना नहीं मिली',
    emptyDesc: 'दूसरी श्रेणी चुनें या खोज के शब्द बदलकर देखें।',
    emptyVerifiedDesc: 'इस चयन में अभी सत्यापित योजना नहीं है। बाकी जानकारी के लिए सभी योजनाएं चुनें।',
    emptyLink: 'सभी योजनाएं देखें',
    breadcrumbHome: 'होम',
    breadcrumbSearch: 'योजनाएं खोजें',
    breadcrumbEdition: 'मध्य प्रदेश + केंद्र की योजनाएं',

    // Card
    centralGov: 'केंद्र सरकार',
    mpGov: 'मध्य प्रदेश',

    // Scheme detail
    backLink: '← योजनाएं खोजें',
    statusLabels: {ACTIVE:'स्रोत से सत्यापित',REQUIRES_OFFICIAL_VERIFICATION:'सत्यापन बाकी',NEEDS_REVIEW:'दोबारा समीक्षा जरूरी',ARCHIVED:'संग्रहित',CLOSED:'योजना बंद'},
    glanceTitle: 'एक नज़र में',
    benefitLabel: 'क्या लाभ मिल सकता है?',
    deptLabel: 'किस विभाग से जुड़ी है?',
    eligibilityTitle: 'कौन आवेदन कर सकता है?',
    eligibilityIntro: 'इस योजना का लाभ लेने के लिए कुछ ज़रूरी शर्तें पूरी करनी होंगी।',
    eligibilityNA: 'पूरी पात्रता की जानकारी अभी उपलब्ध नहीं है।',
    eligibilityNote: 'ये नियम अधूरे हो सकते हैं। अपवादों सहित अंतिम पात्रता संबंधित विभाग तय करता है।',
    eligibilityMatchBtn: 'मेरी स्थिति से मिलान करें →',
    docsTitle: 'कौन-से दस्तावेज़ चाहिए?',
    stepsTitle: 'आवेदन की तैयारी कैसे करें?',
    sourceTitle: 'स्रोत और समीक्षा',
    verifiedAt: 'पिछला सत्यापन:',
    nextReview: 'अगली समीक्षा:',
    notVerified: 'अभी सत्यापित नहीं',
    pendingVerification: 'प्रथम सत्यापन बाकी',
    noSourceLink: 'सरकारी स्रोत का लिंक अभी नहीं मिला है।',
    sampleNotice: 'डेमो जानकारी:',
    sampleNoticeText: 'इन रिकॉर्ड की पूरी सरकारी पुष्टि बाकी है। पात्रता के नतीजे संकेत हैं, लाभ की गारंटी नहीं।',
    staleNotice: 'इस योजना की स्थिति बदल चुकी है या दोबारा समीक्षा जरूरी है। आवेदन से पहले सरकारी स्रोत पर पुष्टि करें।',

    // SchemeActions
    nextStep: 'अगला कदम',
    applyBtn: 'official आवेदन खोलें',
    sourceBtn: 'सरकारी स्रोत देखें',
    saveBtn: 'बाद के लिए सहेजें',
    savedBtn: 'सहेजी गई · हटाएं',
    reminderBtn: 'मुझे याद दिलाएं',
    noApplyLink: 'सत्यापित आवेदन लिंक अभी उपलब्ध नहीं है।',
    noPayNotice: 'यहाँ कोई आवेदन या भुगतान नहीं लिया जाता।',
    usefulTitle: 'क्या जानकारी मददगार लगी?',
    usefulDesc: 'लोगों ने जानकारी सही लगने की प्रतिक्रिया दी। यह सरकारी सत्यापन नहीं है।',
    voteBtn: 'यह जानकारी सही लगी',
    reportBtn: 'क्या इस जानकारी में गलती है?',
    reportTitle: 'जानकारी में गलती बताएं',
    reminderTitle: 'एक छोटा-सा रिमाइंडर',
    reportDesc: 'हमारी समीक्षा टीम इसे जाँचेगी। व्यक्तिगत जानकारी न भेजें।',
    reminderDesc: 'रिमाइंडर इसी ब्राउज़र में 90 दिन तक रहेगा। SMS या WhatsApp नहीं भेजे जाते।',
    reportReasonLabel: 'क्या गलत है?',
    reportDetailLabel: 'थोड़ा और बताएं (वैकल्पिक)',
    reminderDateLabel: 'किस दिन याद करना है?',
    reminderCookieNote: 'रिमाइंडर सहेजने से एक आवश्यक session cookie बनेगी। यह आवेदन की अंतिम तारीख नहीं है।',
    saving: 'सहेज रहे हैं…',
    submitReport: 'रिपोर्ट भेजें',
    submitReminder: 'रिमाइंडर सहेजें',
    reportReasons: [
      {value:'wrong-benefit',label:'लाभ की जानकारी'},
      {value:'wrong-eligibility',label:'पात्रता की जानकारी'},
      {value:'broken-link',label:'लिंक नहीं खुलता'},
      {value:'closed',label:'योजना बंद है'},
      {value:'outdated',label:'पुरानी जानकारी'},
      {value:'contact',label:'गलत संपर्क'},
      {value:'other',label:'अन्य'},
    ],
    toastSaved: 'योजना इस डिवाइस पर सहेज ली गई।',
    toastRemoved: 'योजना हटा दी गई।',
    toastSaveError: 'इस डिवाइस पर सहेजना उपलब्ध नहीं है।',
    toastReported: 'आपकी रिपोर्ट मिल गई। धन्यवाद।',
    toastReminderSaved: 'रिमाइंडर सहेजा गया। मेरे रिमाइंडर में देखें।',
    toastVoted: 'आपकी प्रतिक्रिया दर्ज है।',
  },
  en: {
    // Brand
    brandName: 'Sarkari Yojna',
    brandTagline: 'GOVT. SCHEMES',

    // Independent notice
    independent: 'An independent initiative. Not a government website.',
    yourInfo: 'Your information, in your language',

    // Navigation
    navSearch: 'Find Schemes',
    navForMe: 'Schemes For Me',
    navFamily: 'My Family',
    navGuide: 'Easy Guide',
    navMenu: 'Menu',
    navSaved: 'Saved Schemes',
    navReminders: 'My Reminders',

    // Footer
    footerTagline: 'Right information. Better opportunities.',
    footerDisclaimer: 'Sarkari Yojna is not a government website. Apply only on the official government portal.',
    footerFree: 'Basic scheme search is always free.',
    footerPrivacy: 'Privacy',
    footerTerms: 'Terms',
    footerDisclaimer2: 'Disclaimer',
    footerAdmin: 'Admin',

    // Sidebar
    sidebarForYou: 'For You',
    sidebarByCategory: 'By Category',
    sidebarSafetyTitle: 'Your Safety First',
    sidebarSafetyDesc: 'Never share OTP, UPI PIN or bank password with anyone.',
    sidebarSafetyLink: 'Stay Safe',

    // Directory
    heroBadge: 'For every citizen, at every step',
    heroTitle: 'Your Right. Your Scheme.',
    heroSubtitle: 'Correct information, in simple language.',
    heroDesc: 'Find government schemes for you and your family.\nUnderstand benefits, check eligibility and apply at the right place.',
    searchPlaceholder: 'Enter scheme name or need…',
    searchBtn: 'Search',
    searchSuggest: 'Try:',
    searchTags: ['Farmer', 'Scholarship', 'Housing', 'Pension'],
    matchTitle: 'Which scheme\nis right for you?',
    matchDesc: 'A few easy questions.\nSuggestions tailored to your needs.',
    matchBtn: 'Schemes For Me',
    matchPrivacy: 'No account, no Aadhaar number needed',
    matchStart: 'Start here',
    trustSource: 'Linked to official sources',
    trustSimple: 'Explained in simple language',
    trustPrivacy: 'No personal identity required',
    categoryHeading: 'What are you looking for?',
    categorySubtext: 'Choose a category as per your need',
    allCategories: 'All Categories',
    filterAll: 'All Schemes',
    filterVerified: 'Verified Only',
    filterReset: 'Clear Filters',
    stateFilter: 'Select State',
    stateAll: 'All Regions',
    stateMP: 'Madhya Pradesh',
    stateOther: 'Other States',
    stateCentral: 'Central Only',
    resultsFor: 'results for',
    resultsDefault: 'Schemes that may be useful to you',
    resultsSuffix: 'schemes available · benefits & key info in one place',
    verifiedCount: 'source-verified',
    sourceNote: 'Information compiled from official sources · Final eligibility is determined by the respective department.',
    guideBannerTitle: 'Government documents made simpler',
    guideBannerDesc: 'Income certificate, ration card and application prep — in plain language.',
    guideBannerLink: 'Read Easy Guide',
    emptyDefault: 'No schemes found',
    emptyDesc: 'Try a different category or change your search words.',
    emptyVerifiedDesc: 'No verified scheme in this selection. Choose All Schemes for more info.',
    emptyLink: 'View All Schemes',
    breadcrumbHome: 'Home',
    breadcrumbSearch: 'Find Schemes',
    breadcrumbEdition: 'Madhya Pradesh + Central Schemes',

    // Card
    centralGov: 'Central Govt.',
    mpGov: 'Madhya Pradesh',

    // Scheme detail
    backLink: '← Find Schemes',
    statusLabels: {ACTIVE:'Verified from source',REQUIRES_OFFICIAL_VERIFICATION:'Verification pending',NEEDS_REVIEW:'Review required',ARCHIVED:'Archived',CLOSED:'Scheme closed'},
    glanceTitle: 'At a Glance',
    benefitLabel: 'What benefit can I get?',
    deptLabel: 'Which department is this under?',
    eligibilityTitle: 'Who can apply?',
    eligibilityIntro: 'Some essential conditions must be met to avail this scheme.',
    eligibilityNA: 'Full eligibility information is not yet available.',
    eligibilityNote: 'These rules may be incomplete. Final eligibility including exceptions is determined by the department.',
    eligibilityMatchBtn: 'Match with my profile →',
    docsTitle: 'Documents Required',
    stepsTitle: 'How to Prepare Your Application',
    sourceTitle: 'Source & Review',
    verifiedAt: 'Last verified:',
    nextReview: 'Next review:',
    notVerified: 'Not yet verified',
    pendingVerification: 'First verification pending',
    noSourceLink: 'Official source link not yet available.',
    sampleNotice: 'Demo info:',
    sampleNoticeText: 'Full official verification of these records is pending. Eligibility results are indicative, not guaranteed.',
    staleNotice: 'The status of this scheme has changed or needs review. Confirm on the official source before applying.',

    // SchemeActions
    nextStep: 'Next Step',
    applyBtn: 'Open official application',
    sourceBtn: 'View official source',
    saveBtn: 'Save for later',
    savedBtn: 'Saved · Remove',
    reminderBtn: 'Remind me',
    noApplyLink: 'Verified application link not yet available.',
    noPayNotice: 'No application or payment is taken here.',
    usefulTitle: 'Was this information helpful?',
    usefulDesc: 'people found this information correct. This is not official government verification.',
    voteBtn: 'This information looks correct',
    reportBtn: 'Is there an error in this information?',
    reportTitle: 'Report an error in information',
    reminderTitle: 'Set a quick reminder',
    reportDesc: 'Our review team will check this. Do not send personal information.',
    reminderDesc: 'Reminder stays in this browser for 90 days. No SMS or WhatsApp is sent.',
    reportReasonLabel: 'What is wrong?',
    reportDetailLabel: 'Tell us more (optional)',
    reminderDateLabel: 'On which day?',
    reminderCookieNote: 'Saving a reminder will create a necessary session cookie. This is not the application deadline.',
    saving: 'Saving…',
    submitReport: 'Send Report',
    submitReminder: 'Save Reminder',
    reportReasons: [
      {value:'wrong-benefit',label:'Benefit information'},
      {value:'wrong-eligibility',label:'Eligibility information'},
      {value:'broken-link',label:'Link not working'},
      {value:'closed',label:'Scheme is closed'},
      {value:'outdated',label:'Outdated information'},
      {value:'contact',label:'Wrong contact'},
      {value:'other',label:'Other'},
    ],
    toastSaved: 'Scheme saved on this device.',
    toastRemoved: 'Scheme removed.',
    toastSaveError: 'Saving is not available on this device.',
    toastReported: 'Your report has been received. Thank you.',
    toastReminderSaved: 'Reminder saved. Check My Reminders.',
    toastVoted: 'Your response has been recorded.',
  },
} as const;

export type Translations = typeof translations.hi;

interface LanguageContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'hi',
  t: translations.hi,
  toggleLang: () => {},
});

export function LanguageProvider({children}: {children: ReactNode}) {
  const [lang, setLang] = useState<Lang>('hi');

  useEffect(() => {
    const saved = localStorage.getItem('sy_lang') as Lang | null;
    if (saved === 'en' || saved === 'hi') setLang(saved);
  }, []);

  function toggleLang() {
    const next: Lang = lang === 'hi' ? 'en' : 'hi';
    setLang(next);
    localStorage.setItem('sy_lang', next);
    // Update html lang attribute for SEO & accessibility
    document.documentElement.lang = next === 'hi' ? 'hi' : 'en';
  }

  return (
    <LanguageContext.Provider value={{lang, t: translations[lang], toggleLang}}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
