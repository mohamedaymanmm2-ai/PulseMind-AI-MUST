import { useEffect } from 'react';
import { AppLanguage } from '../types';

export function useLanguageSync(language: AppLanguage) {
  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
}
