import React, { useState } from 'react';
import {
  Check,
  Download,
  Menu,
  Monitor,
  Moon,
  PanelLeftOpen,
  Sun,
  Trash2,
} from 'lucide-react';
import {
  AppLanguage,
  AppSettings,
  ClinicalResponseFormat,
  Conversation,
  FontSizeScale,
  ResponseDensity,
  ThemeMode,
} from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { interpolate } from '../i18n/translations';
import { LanguageSwitcher } from './LanguageSwitcher';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  conversations: Conversation[];
  onClearAllConversations: () => void;
  isSidebarOpenDesktop: boolean;
  onOpenSidebarDesktop: () => void;
  onOpenSidebarMobile: () => void;
}

const FORMAT_IDS: ClinicalResponseFormat[] = ['adpie', 'nanda', 'dosage', 'exam'];

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  conversations,
  onClearAllConversations,
  isSidebarOpenDesktop,
  onOpenSidebarDesktop,
  onOpenSidebarMobile,
}) => {
  const { t } = useTranslation();
  const [confirmClear, setConfirmClear] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    const payload = JSON.stringify(conversations, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `pulsemind-must-nursing-history-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2200);
  };

  const handleConfirmClear = () => {
    onClearAllConversations();
    setConfirmClear(false);
  };

  const themeOptions: {
    id: ThemeMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'light', label: t.settings.themes.light, icon: Sun },
    { id: 'dark', label: t.settings.themes.dark, icon: Moon },
    { id: 'system', label: t.settings.themes.system, icon: Monitor },
  ];

  const languageOptions: { id: AppLanguage; flag: string; label: string }[] = [
    { id: 'en', flag: '🇺🇸', label: 'English' },
    { id: 'ar', flag: '🇪🇬', label: 'العربية' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      {/* Top Bar */}
      <header className="h-14 px-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-4 bg-slate-50/90 dark:bg-[#0B1120]/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenSidebarMobile}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={t.common.openNav}
          >
            <Menu className="w-5 h-5" />
          </button>

          {!isSidebarOpenDesktop && (
            <button
              type="button"
              onClick={onOpenSidebarDesktop}
              className="hidden lg:inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={t.common.expandSidebar}
              title={t.common.expandSidebar}
            >
              <PanelLeftOpen className="w-4 h-4 rtl:rotate-180" />
            </button>
          )}

          <h1 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t.settings.title}
          </h1>
        </div>

        <LanguageSwitcher compact />
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 divide-y divide-slate-200 dark:divide-slate-800">
        {/* Section 1: Appearance, Language & Dark Mode */}
        <section className="pb-9">
          <div className="mb-6">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
              {t.settings.appearanceKicker}
            </p>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
              {t.settings.appearanceTitle}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {t.settings.languageTitle}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.settings.languageDesc}
                </p>
              </div>

              <div
                dir="ltr"
                className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 shrink-0 self-start sm:self-center"
              >
                {languageOptions.map((opt) => {
                  const active = settings.language === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onUpdateSettings({ language: opt.id })}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      <span aria-hidden="true">{opt.flag}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {t.settings.colorModeTitle}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.settings.colorModeDesc}
                </p>
              </div>

              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 shrink-0 self-start sm:self-center">
                {themeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const active = settings.theme === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onUpdateSettings({ theme: opt.id })}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {t.settings.densityTitle}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.settings.densityDesc}
                </p>
              </div>

              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 shrink-0 self-start sm:self-center">
                {(['comfortable', 'compact'] as ResponseDensity[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onUpdateSettings({ density: mode })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      settings.density === mode
                        ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {t.settings.densityOptions[mode]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {t.settings.textSizeTitle}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.settings.textSizeDesc}
                </p>
              </div>

              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 shrink-0 self-start sm:self-center">
                {(['standard', 'large'] as FontSizeScale[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onUpdateSettings({ fontSize: size })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      settings.fontSize === size
                        ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {t.settings.fontSizeOptions[size]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Clinical AI Behavior */}
        <section className="py-9">
          <div className="mb-6">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
              {t.settings.clinicalKicker}
            </p>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
              {t.settings.clinicalTitle}
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                {t.settings.defaultFormatTitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FORMAT_IDS.map((fmtId) => {
                  const selected = settings.responseFormat === fmtId;
                  const opt = t.settings.formats[fmtId];
                  return (
                    <button
                      key={fmtId}
                      type="button"
                      onClick={() => onUpdateSettings({ responseFormat: fmtId })}
                      className={`text-start p-4 rounded-xl border transition-colors cursor-pointer ${
                        selected
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500'
                          : 'bg-white dark:bg-[#131C31] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <p className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        {opt.label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {opt.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {t.settings.safetyTitle}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.settings.safetyDesc}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.clinicalSafetyNotes}
                onClick={() =>
                  onUpdateSettings({ clinicalSafetyNotes: !settings.clinicalSafetyNotes })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                  settings.clinicalSafetyNotes
                    ? 'bg-blue-700 dark:bg-blue-600'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-xs transform transition-transform ${
                    settings.clinicalSafetyNotes
                      ? 'ltr:translate-x-5 rtl:-translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {t.settings.enterSendTitle}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.settings.enterSendDesc}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.enterToSend}
                onClick={() => onUpdateSettings({ enterToSend: !settings.enterToSend })}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
                  settings.enterToSend
                    ? 'bg-blue-700 dark:bg-blue-600'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-xs transform transition-transform ${
                    settings.enterToSend
                      ? 'ltr:translate-x-5 rtl:-translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Data & Study History */}
        <section className="pt-9">
          <div className="mb-6">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
              {t.settings.dataKicker}
            </p>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
              {t.settings.dataTitle}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {t.settings.exportTitle}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {interpolate(t.settings.exportDesc, { count: conversations.length })}
                </p>
              </div>

              <button
                type="button"
                onClick={handleExport}
                disabled={conversations.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-800 dark:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                {exported ? (
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>{exported ? t.settings.downloaded : t.settings.downloadJson}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {t.settings.clearTitle}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.settings.clearDesc}
                </p>
              </div>

              {confirmClear ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmClear}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {t.settings.confirmDelete}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  disabled={conversations.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.settings.clearHistory}</span>
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
