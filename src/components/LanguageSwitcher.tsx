import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact = false }) => {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t.common.languageLabel}
      dir="ltr"
      className="inline-flex items-center gap-0.5 p-0.5 rounded-xl bg-slate-200/75 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shrink-0"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        aria-label={t.common.switchToEnglish}
        title="English (LTR)"
        className={`inline-flex items-center gap-1.5 ${
          compact ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1 text-xs'
        } font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
          language === 'en'
            ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
        }`}
      >
        <span aria-hidden="true" className="text-sm leading-none">
          🇺🇸
        </span>
        <span>EN</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('ar')}
        aria-pressed={language === 'ar'}
        aria-label={t.common.switchToArabic}
        title="العربية (RTL)"
        className={`inline-flex items-center gap-1.5 ${
          compact ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1 text-xs'
        } font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
          language === 'ar'
            ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
        }`}
      >
        <span aria-hidden="true" className="text-sm leading-none">
          🇪🇬
        </span>
        <span>عربي</span>
      </button>
    </div>
  );
};
