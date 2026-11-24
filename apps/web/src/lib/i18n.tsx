'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import enMessages from '../messages/en.json';
import bnMessages from '../messages/bn.json';

export type Locale = 'en' | 'bn';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, defaultVal?: string) => string;
  formatNumber: (val: number | string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key, defaultVal) => defaultVal || key,
  formatNumber: (val) => String(val),
});

const messages: Record<Locale, any> = {
  en: enMessages,
  bn: bnMessages,
};

// Convert English digits to Bengali numerals
const toBengaliNumeral = (numStr: string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return numStr.replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('erp_lang') as Locale;
      if (saved && (saved === 'en' || saved === 'bn')) {
        setLocaleState(saved);
      }

      const handleLangChange = () => {
        const current = (localStorage.getItem('erp_lang') as Locale) || 'en';
        setLocaleState(current);
      };

      window.addEventListener('language-change', handleLangChange);
      return () => window.removeEventListener('language-change', handleLangChange);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('erp_lang', newLocale);
      window.dispatchEvent(new Event('language-change'));
    }
  };

  const t = (path: string, defaultVal?: string): string => {
    const keys = path.split('.');
    let current = messages[locale];
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Fallback to English
        let fallback = messages['en'];
        for (const fb of keys) {
          if (fallback && typeof fallback === 'object' && fb in fallback) {
            fallback = fallback[fb];
          } else {
            return defaultVal || path;
          }
        }
        return typeof fallback === 'string' ? fallback : defaultVal || path;
      }
    }
    return typeof current === 'string' ? current : defaultVal || path;
  };

  const formatNumber = (val: number | string): string => {
    const str = String(val);
    if (locale === 'bn') {
      return toBengaliNumeral(str);
    }
    return str;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, formatNumber }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
