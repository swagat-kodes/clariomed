export type Language = 'en' | 'hi' | 'mr';

export interface Translations {
  // Sidebar & Nav
  menuHome: string;
  menuAiAssistant: string;
  menuSettings: string;
  menuReports: string;
  appTitle: string;
  appSubtitle: string;
  welcomeUser: string;
  signOut: string;
  signIn: string;

  // Language Modal
  langModalTitle: string;
  langModalSubtitle: string;
  langModalConfirm: string;
  selectLanguage: string;

  // Home Page
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  uploadTitle: string;
  uploadSubtitle: string;
  dragDropText: string;
  browseText: string;
  supportedFormats: string;
  simplifyBtn: string;
  simplifyingBtn: string;

  // Trust Badges
  secureTitle: string;
  secureDesc: string;
  aiEngineTitle: string;
  aiEngineDesc: string;
  doctorFriendlyTitle: string;
  doctorFriendlyDesc: string;

  // Report Summary
  summaryTitle: string;
  documentLabel: string;
  patientFriendlySummary: string;
  keyObservations: string;
  labResultsBreakdown: string;
  testNameCol: string;
  observedValueCol: string;
  referenceRangeCol: string;
  statusCol: string;
  explanationCol: string;
  doctorQuestionsTitle: string;

  // Status Labels
  statusHigh: string;
  statusLow: string;
  statusNormal: string;

  // AI Assistant Dashboard
  aiChatTitle: string;
  aiChatSubtitle: string;
  aiChatNotice: string;
  aiInputPlaceholder: string;
  aiSendBtn: string;
  aiClearBtn: string;
  suggestedPromptsTitle: string;
  prompt1: string;
  prompt2: string;
  prompt3: string;
  prompt4: string;

  // Settings Dashboard
  settingsTitle: string;
  settingsSubtitle: string;
  appearanceTitle: string;
  appearanceDesc: string;
  themeLight: string;
  themeDark: string;
  languageTitle: string;
  languageDesc: string;
  profileTitle: string;
  profileDesc: string;
  emailLabel: string;
  accountStatusLabel: string;
  activeStatus: string;
  privacyTitle: string;
  privacyDesc: string;
  hipaaNotice: string;

  // Reports Dashboard
  reportsTitle: string;
  reportsSubtitle: string;
  searchPlaceholder: string;
  filterAll: string;
  filterAttention: string;
  filterNormal: string;
  noReportsFound: string;
  uploadFirstReport: string;
  viewDetails: string;
  deleteReport: string;
  labItemsCount: string;
  processedOn: string;
  downloadSummary: string;

  // Footer & Common
  disclaimer: string;
  copyright: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    menuHome: 'Home',
    menuAiAssistant: 'AI Assistant',
    menuSettings: 'Settings',
    menuReports: 'Reports',
    appTitle: 'ClarioMed',
    appSubtitle: 'AI Medical Report Simplifier & Lab Explainer',
    welcomeUser: 'Signed in as',
    signOut: 'Sign Out',
    signIn: 'Sign In',

    langModalTitle: 'Select Your Preferred Language',
    langModalSubtitle: 'Choose the language you want to use across ClarioMed. You can change this anytime in Settings.',
    langModalConfirm: 'Continue to ClarioMed',
    selectLanguage: 'Language',

    heroBadge: 'Instant Patient-Friendly AI Explanations',
    heroTitle: 'Understand your medical reports with complete clarity.',
    heroSubtitle: 'Upload lab reports, blood work, or physician summaries. ClarioMed transforms complex medical jargon into clear, reassuring insights.',
    uploadTitle: 'Upload Medical Report',
    uploadSubtitle: 'Upload your lab report or clinical document (PDF, PNG, JPEG, WebP) for instant AI simplification.',
    dragDropText: 'Drag & drop your medical document here, or',
    browseText: 'browse',
    supportedFormats: 'Supports PDF, PNG, JPG, WEBP (Up to 25MB)',
    simplifyBtn: 'Simplify Report Now',
    simplifyingBtn: 'Analyzing & Simplifying Report...',

    secureTitle: 'Secure & Confidential',
    secureDesc: 'Your documents are processed with HIPAA compliance in mind.',
    aiEngineTitle: 'PyMuPDF + Gemini 2.5',
    aiEngineDesc: 'Page-by-page visual document parsing & medical intelligence.',
    doctorFriendlyTitle: 'Doctor Visit Preparedness',
    doctorFriendlyDesc: 'Generates smart questions for your next doctor consultation.',

    summaryTitle: 'Simplified Analysis',
    documentLabel: 'Document',
    patientFriendlySummary: 'Patient-Friendly Summary',
    keyObservations: 'Key Observations',
    labResultsBreakdown: 'Laboratory Test Results Breakdown',
    testNameCol: 'Test Name',
    observedValueCol: 'Observed Value',
    referenceRangeCol: 'Reference Range',
    statusCol: 'Status',
    explanationCol: 'Plain Language Explanation',
    doctorQuestionsTitle: 'Recommended Questions for Your Doctor Visit',

    statusHigh: 'High',
    statusLow: 'Low',
    statusNormal: 'Normal',

    aiChatTitle: 'Medical AI Assistant',
    aiChatSubtitle: 'Ask any question about your medical reports, lab terminology, or general health queries.',
    aiChatNotice: 'Strictly Specialized: I only answer medical and health-related questions.',
    aiInputPlaceholder: 'Ask a medical question (e.g., What does high TSH mean?)...',
    aiSendBtn: 'Send Query',
    aiClearBtn: 'Clear Chat',
    suggestedPromptsTitle: 'Suggested Medical Questions',
    prompt1: 'What does a high Hemoglobin level indicate?',
    prompt2: 'How should I prepare for a Fasting Blood Glucose test?',
    prompt3: 'What questions should I ask my doctor about elevated Liver Enzymes?',
    prompt4: 'Explain the difference between LDL and HDL cholesterol.',

    settingsTitle: 'Settings & Preferences',
    settingsSubtitle: 'Manage your application theme, preferred language, and account configuration.',
    appearanceTitle: 'Appearance Theme',
    appearanceDesc: 'Switch between light and dark visual themes for maximum comfort.',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',
    languageTitle: 'Preferred Language',
    languageDesc: 'Choose your default language for app interface, reports, and AI answers.',
    profileTitle: 'Account Details',
    profileDesc: 'View your logged-in profile and authentication status.',
    emailLabel: 'Email Address',
    accountStatusLabel: 'Account Status',
    activeStatus: 'Active & Protected',
    privacyTitle: 'Privacy & Security',
    privacyDesc: 'Medical data is processed with encryption in transit and at rest.',
    hipaaNotice: 'Strict Data Privacy Enforced',

    reportsTitle: 'Uploaded Medical Reports',
    reportsSubtitle: 'Access and review your previously analyzed medical reports and lab results.',
    searchPlaceholder: 'Search reports by name, test result, or date...',
    filterAll: 'All Reports',
    filterAttention: 'Attention Required',
    filterNormal: 'All Normal',
    noReportsFound: 'No medical reports found.',
    uploadFirstReport: 'Upload your first report on the Home tab to get started.',
    viewDetails: 'View Report Details',
    deleteReport: 'Remove Report',
    labItemsCount: 'Lab Parameters Analyzed',
    processedOn: 'Analyzed on',
    downloadSummary: 'Download Summary',

    disclaimer: 'Disclaimer: ClarioMed provides simplified educational summaries and is not a substitute for professional medical advice, diagnosis, or treatment.',
    copyright: 'All rights reserved.',
  },
  hi: {
    menuHome: 'होम',
    menuAiAssistant: 'एआई सहायक',
    menuSettings: 'सेटिंग्स',
    menuReports: 'रिपोर्ट्स',
    appTitle: 'क्लेरियोमेड',
    appSubtitle: 'एआई मेडिकल रिपोर्ट सरलीकरण और लैब व्याख्याकार',
    welcomeUser: 'साइन इन उपयोगकर्ता',
    signOut: 'साइन आउट',
    signIn: 'साइन इन करें',

    langModalTitle: 'अपनी पसंदीदा भाषा चुनें',
    langModalSubtitle: 'क्लेरियोमेड में उपयोग करने के लिए अपनी पसंदीदा भाषा चुनें। आप इसे सेटिंग्स में कभी भी बदल सकते हैं।',
    langModalConfirm: 'क्लेरियोमेड पर जारी रखें',
    selectLanguage: 'भाषा',

    heroBadge: 'त्वरित मरीज-अनुकूल एआई स्पष्टीकरण',
    heroTitle: 'अपनी मेडिकल रिपोर्ट को पूरी स्पष्टता के साथ समझें।',
    heroSubtitle: 'लैब रिपोर्ट, ब्लड टेस्ट या डॉक्टर की पर्ची अपलोड करें। क्लेरियोमेड जटिल मेडिकल शब्दों को स्पष्ट और आसान भाषा में बदलता है।',
    uploadTitle: 'मेडिकल रिपोर्ट अपलोड करें',
    uploadSubtitle: 'त्वरित एआई सरलीकरण के लिए अपनी लैब रिपोर्ट (PDF, PNG, JPEG, WebP) अपलोड करें।',
    dragDropText: 'अपनी मेडिकल रिपोर्ट यहाँ खींचें और छोड़ें, या',
    browseText: 'ब्राउज़ करें',
    supportedFormats: 'PDF, PNG, JPG, WEBP समर्थित (25MB तक)',
    simplifyBtn: 'रिपोर्ट को आसान बनाएं',
    simplifyingBtn: 'विश्लेषण और आसान बनाया जा रहा है...',

    secureTitle: 'सुरक्षित और गोपनीय',
    secureDesc: 'आपके दस्तावेज़ पूर्ण सुरक्षा के साथ प्रोसेस किए जाते हैं।',
    aiEngineTitle: 'PyMuPDF + जेमिनी 2.5',
    aiEngineDesc: 'पेज-दर-पेज विजुअल दस्तावेज़ विश्लेषण।',
    doctorFriendlyTitle: 'डॉक्टर मुलाकात की तैयारी',
    doctorFriendlyDesc: 'डॉक्टर से परामर्श के लिए महत्वपूर्ण प्रश्न तैयार करता है।',

    summaryTitle: 'सरलीकृत विश्लेषण',
    documentLabel: 'दस्तावेज़',
    patientFriendlySummary: 'मरीज-अनुकूल सारांश',
    keyObservations: 'मुख्य निष्कर्ष',
    labResultsBreakdown: 'प्रयोगशाला परीक्षण परिणाम (लैब टेस्ट)',
    testNameCol: 'जांच का नाम',
    observedValueCol: 'प्राप्त मान (Value)',
    referenceRangeCol: 'सामान्य सीमा (Range)',
    statusCol: 'स्थिति',
    explanationCol: 'सरल भाषा में व्याख्या',
    doctorQuestionsTitle: 'डॉक्टर से पूछने योग्य अनुशंसित प्रश्न',

    statusHigh: 'उच्च (High)',
    statusLow: 'कम (Low)',
    statusNormal: 'सामान्य (Normal)',

    aiChatTitle: 'मेडिकल एआई सहायक',
    aiChatSubtitle: 'अपनी मेडिकल रिपोर्ट, लैब शब्दावली या स्वास्थ्य संबंधी कोई भी प्रश्न पूछें।',
    aiChatNotice: 'विशेष निर्देश: मैं केवल मेडिकल और स्वास्थ्य से जुड़े प्रश्नों के उत्तर देता हूँ।',
    aiInputPlaceholder: 'मेडिकल प्रश्न पूछें (जैसे: उच्च TSH का क्या अर्थ है?)...',
    aiSendBtn: 'प्रश्न भेजें',
    aiClearBtn: 'चैट साफ करें',
    suggestedPromptsTitle: 'सुझाए गए मेडिकल प्रश्न',
    prompt1: 'उच्च हीमोग्लोबिन स्तर का क्या अर्थ है?',
    prompt2: 'फास्टिंग ब्लड शुगर टेस्ट की तैयारी कैसे करें?',
    prompt3: 'लिवर एंजाइम बढ़ने पर डॉक्टर से क्या पूछना चाहिए?',
    prompt4: 'LDL और HDL कोलेस्ट्रॉल में क्या अंतर है?',

    settingsTitle: 'सेटिंग्स और प्राथमिकताएं',
    settingsSubtitle: 'एप्लिकेशन थीम, पसंदीदा भाषा और खाता कॉन्फ़िगरेशन प्रबंधित करें।',
    appearanceTitle: 'दिखावट थीम',
    appearanceDesc: 'लाइट और डार्क मोड के बीच स्विच करें।',
    themeLight: 'लाइट मोड',
    themeDark: 'डार्क मोड',
    languageTitle: 'पसंदीदा भाषा',
    languageDesc: 'ऐप इंटरफेस, रिपोर्ट और एआई उत्तरों के लिए अपनी डिफ़ॉल्ट भाषा चुनें।',
    profileTitle: 'खाता विवरण',
    profileDesc: 'अपना प्रोफ़ाइल और प्रमाणीकरण स्थिति देखें।',
    emailLabel: 'ईमेल पता',
    accountStatusLabel: 'खाता स्थिति',
    activeStatus: 'सक्रिय और सुरक्षित',
    privacyTitle: 'गोपनीयता और सुरक्षा',
    privacyDesc: 'मेडिकल डेटा एन्क्रिप्शन के साथ सुरक्षित रूप से प्रोसेस किया जाता है।',
    hipaaNotice: 'सख्त डेटा गोपनीयता लागू',

    reportsTitle: 'अपलोड की गई मेडिकल रिपोर्ट्स',
    reportsSubtitle: 'अपनी पिछली विश्लेषित मेडिकल रिपोर्ट और लैब परिणाम देखें।',
    searchPlaceholder: 'नाम, टेस्ट परिणाम या तारीख से खोजें...',
    filterAll: 'सभी रिपोर्ट्स',
    filterAttention: 'ध्यान देने योग्य',
    filterNormal: 'सभी सामान्य',
    noReportsFound: 'कोई मेडिकल रिपोर्ट नहीं मिली।',
    uploadFirstReport: 'शुरू करने के लिए होम टैब पर अपनी पहली रिपोर्ट अपलोड करें।',
    viewDetails: 'रिपोर्ट विवरण देखें',
    deleteReport: 'रिपोर्ट हटाएं',
    labItemsCount: 'विश्लेषित लैब पैरामीटर',
    processedOn: 'विश्लेषण की तारीख',
    downloadSummary: 'सारांश डाउनलोड करें',

    disclaimer: 'अस्वीकरण: क्लेरियोमेड सरलीकृत शैक्षणिक सारांश प्रदान करता है और यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है।',
    copyright: 'सर्वाधिकार सुरक्षित।',
  },
  mr: {
    menuHome: 'मुख्यपृष्ठ',
    menuAiAssistant: 'एआई सहाय्यक',
    menuSettings: 'सेटिंग्ज',
    menuReports: 'अहवाल (Reports)',
    appTitle: 'क्लेरिओमेड',
    appSubtitle: 'एआय वैद्यकीय अहवाल सुलभीकरण आणि प्रयोगशाळा स्पष्टीकरण',
    welcomeUser: 'साइन इन वापरकर्ता',
    signOut: 'साइन आउट',
    signIn: 'साइन इन करा',

    langModalTitle: 'आपली पसंतीची भाषा निवडा',
    langModalSubtitle: 'क्लेरिओमेडमध्ये वापरण्यासाठी आपली आवडती भाषा निवडा. आपण सेटिंग्समध्ये हे कधीही बदलू शकता.',
    langModalConfirm: 'क्लेरिओमेड वर पुढे जा',
    selectLanguage: 'भाषा',

    heroBadge: 'त्वरित रुग्ण-अनुकूल एआय स्पष्टीकरण',
    heroTitle: 'आपले वैद्यकीय अहवाल संपूर्ण स्पष्टतेसह समजून घ्या.',
    heroSubtitle: 'लॅब रिपोर्ट्स, रक्त चाचण्या किंवा डॉक्टरांची चिठ्ठी अपलोड करा. क्लेरिओमेड कठीण वैद्यकीय शब्दांना सोप्या भाषेत बदलते.',
    uploadTitle: 'वैद्यकीय अहवाल अपलोड करा',
    uploadSubtitle: 'झटपट एआय सुलभीकरणासाठी आपला लॅब अहवाल (PDF, PNG, JPEG, WebP) अपलोड करा.',
    dragDropText: 'आपला वैद्यकीय अहवाल येथे ड्रॅग आणि ड्रॉप करा, किंवा',
    browseText: 'ब्राउझ करा',
    supportedFormats: 'PDF, PNG, JPG, WEBP समर्थित (२५ MB पर्यंत)',
    simplifyBtn: 'अहवाल सोपा करा',
    simplifyingBtn: 'विश्लेषण व सुलभीकरण सुरू आहे...',

    secureTitle: 'सुरक्षित आणि गोपनीय',
    secureDesc: 'आपले दस्तऐवज संपूर्ण सुरक्षेसह सुरक्षित केले जातात.',
    aiEngineTitle: 'PyMuPDF + जेमिनी २.५',
    aiEngineDesc: 'पानोपानी दस्तऐवज विश्लेषण आणि वैद्यकीय बुद्धिमत्ता.',
    doctorFriendlyTitle: 'डॉक्टर भेटीची तयारी',
    doctorFriendlyDesc: 'डॉक्टरांच्या पुढील भेटीसाठी उपयुक्त प्रश्न तयार करतो.',

    summaryTitle: 'सरलीकृत विश्लेषण',
    documentLabel: 'दस्तऐवज',
    patientFriendlySummary: 'रुग्ण-अनुकूल सारांश',
    keyObservations: 'महत्त्वाचे निरीक्षणे',
    labResultsBreakdown: 'प्रयोगशाळा चाचणी निकाल (लॅब टेस्ट)',
    testNameCol: 'चाचणीचे नाव',
    observedValueCol: 'निदर्शनास आलेले मूल्य (Value)',
    referenceRangeCol: 'सामान्य मर्यादा (Range)',
    statusCol: 'स्थिती',
    explanationCol: 'सोप्या मराठीतील स्पष्टीकरण',
    doctorQuestionsTitle: 'डॉक्टरांना विचारण्यासाठी सुचवलेले प्रश्न',

    statusHigh: 'जास्त (High)',
    statusLow: 'कमी (Low)',
    statusNormal: 'सामान्य (Normal)',

    aiChatTitle: 'वैद्यकीय एआय सहाय्यक',
    aiChatSubtitle: 'आपल्या वैद्यकीय अहवालांबद्दल, लॅब शब्दावलीबद्दल किंवा आरोग्याविषयी प्रश्न विचारा.',
    aiChatNotice: 'विशेष सूचना: मी फक्त वैद्यकीय आणि आरोग्यविषयक प्रश्नांची उत्तरे देतो.',
    aiInputPlaceholder: 'वैद्यकीय प्रश्न विचारा (उदा. जास्त TSH चा अर्थ काय?)...',
    aiSendBtn: 'प्रश्न पाठवा',
    aiClearBtn: 'चॅट साफ करा',
    suggestedPromptsTitle: 'सुचवलेले वैद्यकीय प्रश्न',
    prompt1: 'जास्त हिमोग्लोबिन पातळीचा काय अर्थ होतो?',
    prompt2: 'फास्टिंग ब्लड शुगर चाचणीची तयारी कशी करावी?',
    prompt3: 'लिव्हर एन्झाईम्स वाढल्यास डॉक्टरांना काय विचारावे?',
    prompt4: 'LDL आणि HDL कोलेस्टेरॉलमध्ये काय फरक आहे?',

    settingsTitle: 'सेटिंग्ज आणि प्राधान्ये',
    settingsSubtitle: 'ॲप्लिकेशन थीम, पसंतीची भाषा आणि खाते कॉन्फिगरेशन व्यवस्थापित करा.',
    appearanceTitle: 'दिसण्याची थीम (Appearance)',
    appearanceDesc: 'लाईट आणि डार्क मोडमध्ये स्विच करा.',
    themeLight: 'लाईट मोड',
    themeDark: 'डार्क मोड',
    languageTitle: 'पसंतीची भाषा',
    languageDesc: 'ॲप इंटरफेस, रिपोर्ट्स आणि एआय उत्तरांसाठी तुमची डीफॉल्ट भाषा निवडा.',
    profileTitle: 'खाते तपशील',
    profileDesc: 'आपली प्रोफाईल आणि प्रमाणीकरण स्थिती पहा.',
    emailLabel: 'ईमेल पत्ता',
    accountStatusLabel: 'खाते स्थिती',
    activeStatus: 'सक्रिय आणि सुरक्षित',
    privacyTitle: 'गोपनीयता आणि सुरक्षा',
    privacyDesc: 'वैद्यकीय डेटा एन्क्रिप्शनद्वारे सुरक्षित ठेवला जातो.',
    hipaaNotice: 'कडक डेटा गोपनीयता लागू',

    reportsTitle: 'अपलोड केलेले वैद्यकीय अहवाल',
    reportsSubtitle: 'आपले पूर्वीचे विश्लेषित वैद्यकीय अहवाल आणि लॅब निकाल पहा.',
    searchPlaceholder: 'नाव, चाचणी निकाल किंवा तारखेनुसार शोधा...',
    filterAll: 'सर्व अहवाल',
    filterAttention: 'लक्ष देणे आवश्यक',
    filterNormal: 'सर्व सामान्य',
    noReportsFound: 'कोणताही वैद्यकीय अहवाल आढळला नाही.',
    uploadFirstReport: 'सुरू करण्यासाठी मुख्यपृष्ठ (Home) वर पहिला अहवाल अपलोड करा.',
    viewDetails: 'अहवाल तपशील पहा',
    deleteReport: 'अहवाल हटवा',
    labItemsCount: 'विश्लेषित लॅब घटक',
    processedOn: 'विश्लेषणाची तारीख',
    downloadSummary: 'सारांश डाउनलोड करा',

    disclaimer: 'अस्वीकरण: क्लेरिओमेड शैक्षणिक सारांश प्रदान करते आणि हे व्यावसायिक वैद्यकीय सल्ल्याचा पर्याय नाही.',
    copyright: 'सर्व हक्क राखीव.',
  },
};
