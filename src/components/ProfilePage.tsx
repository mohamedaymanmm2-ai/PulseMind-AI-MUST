import React, { useState } from 'react';
import { Check, Menu, PanelLeftOpen, Plus, X } from 'lucide-react';
import { Conversation, DEFAULT_PROFILE, UserProfile } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { StudentAvatar } from './StudentAvatar';

interface ProfilePageProps {
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  conversations: Conversation[];
  isSidebarOpenDesktop: boolean;
  onOpenSidebarDesktop: () => void;
  onOpenSidebarMobile: () => void;
}

const ACADEMIC_YEARS = [
  '1st Year BSN · Faculty of Nursing',
  '2nd Year BSN · Faculty of Nursing',
  '3rd Year BSN · Faculty of Nursing',
  '4th Year BSN · Faculty of Nursing',
  'BSN Clinical Internship Year',
];

const ROTATION_OPTIONS = [
  'Foundations & Fundamentals Lab',
  'Medical-Surgical & Critical Care Rotation',
  'Pediatric & Neonatal Nursing',
  'Maternal & Obstetric Health',
  'Psychiatric & Mental Health Nursing',
  'Community & Public Health Nursing',
  'Emergency & Trauma Triage',
];

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onSaveProfile,
  conversations,
  isSidebarOpenDesktop,
  onOpenSidebarDesktop,
  onOpenSidebarMobile,
}) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [newFocus, setNewFocus] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const totalMessages = conversations.reduce(
    (sum, conv) => sum + conv.messages.filter((m) => m.role === 'user').length,
    0
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(draft);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2400);
  };

  const handleAddFocus = () => {
    const trimmed = newFocus.trim();
    if (!trimmed || draft.focusAreas.includes(trimmed)) return;
    setDraft((prev) => ({
      ...prev,
      focusAreas: [...prev.focusAreas, trimmed],
    }));
    setNewFocus('');
  };

  const handleRemoveFocus = (area: string) => {
    setDraft((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.filter((item) => item !== area),
    }));
  };

  const handleReset = () => {
    setDraft(DEFAULT_PROFILE);
    onSaveProfile(DEFAULT_PROFILE);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2400);
  };

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
            {t.profile.title}
          </h1>
        </div>

        <LanguageSwitcher compact />
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Student Identity Summary */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <StudentAvatar name={draft.fullName} sizeClass="w-16 h-16 sm:w-20 sm:h-20" />
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
                {draft.fullName}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                {draft.academicYear}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono tabular-nums">
                  {t.profile.studentIdPrefix} {draft.studentId}
                </span>
                <span aria-hidden="true">·</span>
                <span>{draft.campus}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 sm:text-end">
            <div>
              <p className="font-mono text-lg font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
                {conversations.length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.profile.studyThreads}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
            <div>
              <p className="font-mono text-lg font-semibold text-slate-900 dark:text-slate-50 tabular-nums">
                {totalMessages}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.profile.clinicalPrompts}
              </p>
            </div>
          </div>
        </section>

        {/* Editable Profile Form */}
        <form onSubmit={handleSave} className="pt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="profile-name"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.profile.fullName}
              </label>
              <input
                id="profile-name"
                type="text"
                required
                value={draft.fullName}
                onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="profile-id"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.profile.studentId}
              </label>
              <input
                id="profile-id"
                type="text"
                value={draft.studentId}
                onChange={(e) => setDraft({ ...draft, studentId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.profile.email}
              </label>
              <input
                id="profile-email"
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="profile-year"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.profile.academicYear}
              </label>
              <select
                id="profile-year"
                value={draft.academicYear}
                onChange={(e) => setDraft({ ...draft, academicYear: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
              >
                {ACADEMIC_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="profile-rotation"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.profile.clinicalRotation}
              </label>
              <select
                id="profile-rotation"
                value={draft.clinicalRotation}
                onChange={(e) => setDraft({ ...draft, clinicalRotation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
              >
                {ROTATION_OPTIONS.map((rot) => (
                  <option key={rot} value={rot}>
                    {rot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="profile-campus"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.profile.campus}
              </label>
              <input
                id="profile-campus"
                type="text"
                value={draft.campus}
                onChange={(e) => setDraft({ ...draft, campus: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-bio"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {t.profile.bio}
            </label>
            <textarea
              id="profile-bio"
              rows={3}
              value={draft.bio}
              onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 resize-none"
            />
          </div>

          {/* Interactive Study Focus Areas */}
          <div>
            <label
              htmlFor="focus-input"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              {t.profile.focusAreas}
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {draft.focusAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleRemoveFocus(area)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-red-400 dark:hover:border-red-500 transition-colors cursor-pointer"
                  title={area}
                >
                  <span>{area}</span>
                  <X className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-md">
              <input
                id="focus-input"
                type="text"
                value={newFocus}
                onChange={(e) => setNewFocus(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFocus();
                  }
                }}
                placeholder={t.profile.focusPlaceholder}
                className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddFocus}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300/80 dark:hover:bg-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.profile.addBtn}</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.profile.resetDefault}
            </button>

            <div className="flex items-center gap-3">
              {savedNotice && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                  <Check className="w-4 h-4" />
                  <span>{t.profile.profileSaved}</span>
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.profile.saveProfile}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
