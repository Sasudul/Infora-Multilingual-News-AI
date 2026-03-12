export const en = {
  // ─── Common ───
  common: {
    appName: 'Infora',
    tagline: 'AI-Powered • Multilingual • Sri Lanka',
    tryFree: 'Try Infora Free',
    startChatting: 'Start Chatting',
    browseNews: 'Browse News',
    exploreServices: 'Explore Services',
    search: 'Search',
    back: 'Back',
    readMore: 'Read More',
    loading: 'Loading...',
    noResults: 'No results found.',
    source: 'Source',
    poweredBy: 'Powered by Infora AI',
    disclaimer: 'Disclaimer: This is guidance only. Processing times and fees may vary. Always verify with the relevant government office or official website for the most current information.',
    online: 'Online',
    languages: '3 Languages Supported',
    verifiedSources: 'Verified Sources Only',
    aiPowered: 'AI-Powered Responses',
    freeToUse: 'Free to Use',
    madeWith: 'Made with',
    forSriLanka: 'for Sri Lanka',
  },

  // ─── Navigation ───
  nav: {
    home: 'Home',
    chat: 'Chat',
    news: 'News',
    services: 'Services',
  },

  // ─── Hero Section ───
  hero: {
    title1: 'Your AI Assistant',
    title2: 'for Sri Lanka',
    subtitle: 'Ask questions in',
    lang1: 'Sinhala',
    lang2: 'Tamil',
    lang3: 'English',
    subtitleEnd: 'Get instant news, government service guidance, and smart answers — all in one place.',
    or: 'or',
  },

  // ─── Features ───
  features: {
    sectionLabel: 'Core Features',
    title: 'Everything You Need,',
    titleHighlight: 'One Platform',
    subtitle: 'A complete AI-powered ecosystem for Sri Lankan information access — built for everyone.',
    conversationalAI: 'Conversational AI',
    conversationalAIDesc: 'Natural multi-turn chat in Sinhala, Tamil, and English with context understanding.',
    smartNews: 'Smart News Retrieval',
    smartNewsDesc: 'Fetch, summarize, and filter news from top Sri Lankan sources in real-time.',
    govGuide: 'Government Guide',
    govGuideDesc: 'Step-by-step guidance for passports, NIC, driving license, and more.',
    multilingual: 'Multilingual Engine',
    multilingualDesc: 'Auto-detect language and translate seamlessly between Sinhala, Tamil, and English.',
    intentDetection: 'Intent Detection',
    intentDetectionDesc: 'Smart NLP models classify your queries: news, services, or general conversation.',
    knowledgeBase: 'Knowledge Base',
    knowledgeBaseDesc: 'Curated, verified data: government info, FAQs, and summarized news articles.',
  },

  // ─── How It Works ───
  howItWorks: {
    sectionLabel: 'How It Works',
    title: 'Simple as',
    titleHighlight: 'Conversation',
    subtitle: 'From question to answer in seconds — no complex navigation required.',
    step1Title: 'Ask a Question',
    step1Desc: 'Type your question in Sinhala, Tamil, or English. Ask anything about news, government services, or general queries.',
    step2Title: 'AI Understands',
    step2Desc: 'Our NLP engine detects your language, understands intent, and finds the most relevant information instantly.',
    step3Title: 'Smart Processing',
    step3Desc: 'Retrieves news from verified sources, looks up government service data, or generates an intelligent response.',
    step4Title: 'Get Your Answer',
    step4Desc: 'Receive structured, accurate responses as interactive cards — in your language, ready to act on.',
  },

  // ─── CTA ───
  cta: {
    title: 'Ready to explore',
    titleHighlight: 'Infora',
    subtitle: 'Start asking questions in your language. Get instant, accurate answers about news, government services, and more.',
    startNow: 'Start Chatting Now',
  },

  // ─── Chat ───
  chat: {
    title: 'Infora AI',
    welcomeTitle: 'Welcome to',
    welcomeSubtitle: 'Ask me anything about Sri Lankan news, government services, or general information — in Sinhala, Tamil, or English.',
    placeholder: 'Ask about news, services, or anything...',
    suggestion1: 'Latest news in Sri Lanka',
    suggestion2: 'How to apply for a passport?',
    suggestion3: 'NIC application process',
    suggestion4: 'Weather today in Colombo',
    suggestion5: 'Government services near me',
    suggestion6: 'Business registration guide',
  },

  // ─── News ───
  news: {
    sectionLabel: 'Live Feed',
    title: 'Sri Lanka',
    titleHighlight: 'News',
    subtitle: 'Stay updated with the latest news from trusted Sri Lankan sources.',
    searchPlaceholder: 'Search news...',
    allNews: 'All News',
    politics: 'Politics',
    economy: 'Economy',
    technology: 'Technology',
    sports: 'Sports',
    international: 'International',
    local: 'Local',
    noArticles: 'No articles found matching your criteria.',
    publishedBy: 'Published by',
    verifiedSource: 'Verified Source',
  },

  // ─── Services ───
  services: {
    sectionLabel: 'Step-by-Step Guidance',
    title: 'Government',
    titleHighlight: 'Services',
    subtitle: 'Navigate Sri Lankan government services with clear, step-by-step instructions.',
    viewGuide: 'View Guide',
    backToAll: 'Back to all services',
    requiredDocs: 'Required Documents',
    stepByStep: 'Step-by-Step Process',
    processingTime: 'Processing Time',
    fee: 'Fee',
    passport: 'Passport Application',
    nic: 'NIC Registration',
    drivingLicense: 'Driving License',
    birthCert: 'Birth Certificate',
    businessReg: 'Business Registration',
    vehicleReg: 'Vehicle Registration',
  },

  // ─── Footer ───
  footer: {
    product: 'Product',
    chatAssistant: 'Chat Assistant',
    govServices: 'Gov Services',
    languages: 'Languages',
    resources: 'Resources',
    documentation: 'Documentation',
    apiReference: 'API Reference',
    github: 'GitHub',
    rights: 'All rights reserved.',
    description: 'AI-powered multilingual assistant for Sri Lankan citizens. News, government services, and more — in your language.',
  },
} as const;

// Use a recursive type that preserves structure but allows different string values
type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>;
};

export type Translations = DeepStringRecord<typeof en>;
