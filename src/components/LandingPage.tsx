import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ClipboardList,
  Moon,
  Stethoscope,
  Sun,
} from 'lucide-react';
import { PulseMindLogo } from './PulseMindLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AppView } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
  onStartPrompt: (prompt: string) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

const HERO_IMG = '/src/assets/images/hero_nursing_study_1794735616100.jpg';
const LAB_IMG = '/src/assets/images/clinical_simulation_lab_1794735616075.jpg';

const CAPABILITY_ICONS = [ClipboardList, Calculator, Stethoscope, BookOpen];
const CAPABILITY_SPANS = ['lg:col-span-2', 'lg:col-span-1', 'lg:col-span-1', 'lg:col-span-2'];

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onStartPrompt,
  isDark,
  onToggleDark,
}) => {
  const { t } = useTranslation();
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [labImgFailed, setLabImgFailed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B1120] dark:text-slate-100">
      {/* Top Navigation Bar with Language Switcher */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/90 dark:bg-[#0B1120]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#overview"
            className="flex items-center gap-2.5 text-lg font-display font-bold tracking-tight text-slate-900 dark:text-slate-50 whitespace-nowrap shrink-0"
          >
            <PulseMindLogo size={28} />
            <span>{t.common.brandName}</span>
          </a>

          {/* Zone 2: 4 Concise Single-Line Nav Links */}
          <nav
            aria-label="Landing navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <a
              href="#overview"
              className="hover:text-blue-700 dark:hover:text-blue-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.overview}
            </a>
            <a
              href="#capabilities"
              className="hover:text-blue-700 dark:hover:text-blue-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.capabilities}
            </a>
            <a
              href="#tracks"
              className="hover:text-blue-700 dark:hover:text-blue-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.clinicalTracks}
            </a>
            <a
              href="#faq"
              className="hover:text-blue-700 dark:hover:text-blue-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.faq}
            </a>
          </nav>

          {/* Zone 3: Language Switcher + Primary Action */}
          <div className="shrink-0 flex items-center gap-2.5">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0B1120] cursor-pointer"
            >
              <span>{t.nav.openDashboard}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="overview" className="max-w-6xl mx-auto px-6 pt-14 pb-20 lg:pt-20 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between py-2">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-4">
                  {t.landing.universityTag}
                </p>
                <h1
                  className="font-display font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.15] mb-6"
                  style={{ fontSize: 'clamp(2.1rem, 4vw, 3.35rem)', textWrap: 'balance' }}
                >
                  {t.landing.heroTitle}
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mb-8">
                  {t.landing.heroSubtitle}
                </p>

                <div className="flex flex-wrap items-center gap-5">
                  <button
                    type="button"
                    onClick={() => onNavigate('dashboard')}
                    className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0B1120] cursor-pointer"
                  >
                    <span>{t.landing.heroCtaDashboard}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('exam')}
                    className="text-sm font-medium text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {t.landing.heroCtaExam}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('chat')}
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {t.landing.heroCtaChat}
                  </button>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{t.landing.heroFeature1}</span>
                <span aria-hidden="true">·</span>
                <span>{t.landing.heroFeature2}</span>
                <span aria-hidden="true">·</span>
                <span>{t.landing.heroFeature3}</span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[280px] lg:min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                {heroImgFailed ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-blue-950/40">
                    <Stethoscope className="w-10 h-10 text-blue-700 dark:text-blue-400 mb-3" />
                    <p className="font-display font-semibold text-slate-900 dark:text-slate-100">
                      {t.landing.heroFallbackTitle}
                    </p>
                  </div>
                ) : (
                  <img
                    src={HERO_IMG}
                    alt={t.landing.heroImgAlt}
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Capabilities Bento Grid */}
        <section
          id="capabilities"
          className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0F172A]/60 py-20"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-2">
                {t.landing.capSectionKicker}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {t.landing.capSectionTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {t.landing.capabilities.map((cap, idx) => {
                const Icon = CAPABILITY_ICONS[idx] || BookOpen;
                const span = CAPABILITY_SPANS[idx] || 'lg:col-span-1';
                return (
                  <div
                    key={cap.index}
                    className={`${span} p-7 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                          {cap.index}
                        </span>
                        <Icon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2.5">
                        {cap.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        {cap.description}
                      </p>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => onStartPrompt(cap.prompt)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>{t.landing.tryExample}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Clinical Tracks & Simulation Lab */}
        <section id="tracks" className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-2">
                  {t.landing.tracksSectionKicker}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
                  {t.landing.tracksSectionTitle}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                  {t.landing.tracksSectionDesc}
                </p>
              </div>

              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                {labImgFailed ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <ClipboardList className="w-8 h-8 text-blue-700 dark:text-blue-400 mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t.landing.labFallbackTitle}
                    </p>
                  </div>
                ) : (
                  <img
                    src={LAB_IMG}
                    alt={t.landing.labImgAlt}
                    referrerPolicy="no-referrer"
                    onError={() => setLabImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="lg:col-span-7 divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
              {t.landing.tracks.map((track) => (
                <div
                  key={track.year}
                  className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-50 mb-1">
                      {track.year}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {track.focus}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onStartPrompt(track.prompt)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-center cursor-pointer"
                  >
                    <span>{t.landing.practiceInChat}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: FAQ */}
        <section
          id="faq"
          className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0F172A]/60 py-20"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-2">
                  {t.landing.faqSectionKicker}
                </p>
                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-3">
                  {t.landing.faqSectionTitle}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t.landing.faqSectionDesc}
                </p>
              </div>

              <div className="lg:col-span-8 divide-y divide-slate-200 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800">
                {t.landing.faqs.map((item) => (
                  <div key={item.q} className="py-6">
                    <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-50 mb-2">
                      {item.q}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1120] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <PulseMindLogo size={24} />
            <span className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t.common.brandName}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.landing.footerCredit}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-600 dark:text-slate-400">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.landing.footerLinks.dashboard}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('exam')}
              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.landing.footerLinks.exam}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('chat')}
              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.landing.footerLinks.chat}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('flashcards')}
              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.landing.footerLinks.flashcards}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('mcq')}
              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.landing.footerLinks.mcq}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('gpa')}
              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.landing.footerLinks.gpa}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('planner')}
              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.landing.footerLinks.planner}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.landing.footerLinks.progress}
            </button>
            <button
              type="button"
              onClick={onToggleDark}
              className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              aria-label={isDark ? t.common.lightMode : t.common.darkMode}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{isDark ? t.common.lightMode : t.common.darkMode}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
