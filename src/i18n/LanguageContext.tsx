import React, { createContext, useContext } from 'react';
import { AppLanguage } from '../types';
import { TRANSLATIONS, TranslationDictionary } from './translations';

interface LanguageContextValue {
  language: AppLanguage;
  isRtl: boolean;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  isRtl: false,
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: TRANSLATIONS.en,
});

interface LanguageProviderProps {
  language: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  language,
  onChangeLanguage,
  children,
}) => {
  const value: LanguageContextValue = {
    language,
    isRtl: language === 'ar',
    setLanguage: onChangeLanguage,
    toggleLanguage: () => onChangeLanguage(language === 'en' ? 'ar' : 'en'),
    t: TRANSLATIONS[language],
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export function useTranslation() {
  return useContext(LanguageContext);
}
