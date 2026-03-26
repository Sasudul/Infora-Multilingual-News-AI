import { translations } from './translations';

// 🌍 Language type
export type Lang = 'en' | 'si' | 'ta';

// 🌍 Current language
let currentLang: Lang = 'en';

// 🌍 Set language
export const setLanguage = (lang: Lang) => {
  currentLang = lang;
};

// 🌍 Get translation
export const t = (key: keyof typeof translations['en']) => {
  return translations[currentLang][key] || key;
};
