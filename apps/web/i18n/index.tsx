'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { en, type Translations } from './en';
import { si } from './si';
import { ta } from './ta';

export type LangCode = 'en' | 'si' | 'ta';

const translations: Record<LangCode, Translations> = { en, si, ta };

interface I18nContextType {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en');

  const setLang = useCallback((newLang: LangCode) => {
    setLangState(newLang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
    }
  }, []);

  const t = translations[lang];

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
