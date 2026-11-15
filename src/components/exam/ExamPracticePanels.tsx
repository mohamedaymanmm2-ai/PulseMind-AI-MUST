import React, { useState } from 'react';
import {
  AlertTriangle,
  BookMarked,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  KeyRound,
  Plus,
  RotateCcw,
  RotateCw,
  Search,
  ShieldCheck,
  Shuffle,
  XCircle,
} from 'lucide-react';
import {
  AssessmentAttempt,
  ExamKeyword,
  ExamTomorrowPack,
  McqQuestion,
  RapidRevisionCard,
  SmartRevisionNote,
  TrueFalseStatement,
} from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';
import { interpolate } from '../../i18n/translations';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

/* -------------------------------------------------------------------------- */
/* 1. High-Yield Summaries                                                    */
/* -------------------------------------------------------------------------- */

export const HighYieldSummarySection: React.FC<{
  pack: ExamTomorrowPack;
  compact?: boolean;
}> = ({ pack, compact = false }) => {
  const { t } = useTranslation();
  const { quickSummary } = pack;

  return (
    <section className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
            {t.exam.summaryKicker} · {pack.subject}
          </p>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
            {pack.title}
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          {interpolate(t.exam.summaryCounts, {
            actions: quickSummary.priorityActions.length,
            labs: quickSummary.labThresholds.length,
          })}
        </span>
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
        {quickSummary.overview}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Nursing Actions */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
            {t.exam.priorityActionsTitle}
          </h4>
          <ol className="space-y-2.5">
            {quickSummary.priorityActions.map((action, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400 mt-0.5 tabular-nums shrink-0">
                  0{idx + 1}.
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Critical Safety Alerts */}
        <div className="p-5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <h4 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
              {t.exam.criticalAlertsTitle}
            </h4>
          </div>
          <ul className="space-y-2.5">
            {quickSummary.criticalAlerts.map((alert, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed flex items-start gap-2"
              >
                <span className="text-amber-700 dark:text-amber-400 font-bold shrink-0">•</span>
                <span>{alert}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lab Thresholds Table */}
      {!compact && quickSummary.labThresholds.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800">
            <h4 className="font-display text-xs font-bold text-slate-900 dark:text-slate-100">
              {t.exam.labThresholdsTitle}
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-[#0B1120]/50">
                  <th className="py-2.5 px-4">{t.exam.labColParam}</th>
                  <th className="py-2.5 px-4">{t.exam.labColRange}</th>
                  <th className="py-2.5 px-4">{t.exam.labColAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {quickSummary.labThresholds.map((lab, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {lab.parameter}
                    </td>
                    <td className="py-3 px-4 font-mono text-blue-700 dark:text-blue-400 tabular-nums whitespace-nowrap">
                      {lab.normalRange}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lab.criticalAction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Smart Revision Notes                                                    */
/* -------------------------------------------------------------------------- */

export const SmartRevisionNotesSection: React.FC<{
  notes: SmartRevisionNote[];
  onToggleReviewed: (noteId: string) => void;
  onAddCustomNote: (note: Omit<SmartRevisionNote, 'id'>) => void;
}> = ({ notes, onToggleReviewed, onAddCustomNote }) => {
  const { t } = useTranslation();
  const [showAdd, setShowAdd] = useState(false);
  const [heading, setHeading] = useState('');
  const [bulletsRaw, setBulletsRaw] = useState('');
  const [mnemonic, setMnemonic] = useState('');

  const reviewedCount = notes.filter((n) => n.reviewed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heading.trim() || !bulletsRaw.trim()) return;
    const bulletPoints = bulletsRaw
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    onAddCustomNote({
      heading: heading.trim(),
      bulletPoints: bulletPoints.length > 0 ? bulletPoints : [bulletsRaw.trim()],
      mnemonicOrAnchor: mnemonic.trim() || 'Personal high-yield clinical anchor',
      reviewed: false,
    });
    setHeading('');
    setBulletsRaw('');
    setMnemonic('');
    setShowAdd(false);
  };

  return (
    <section className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
            {t.exam.smartNotesKicker}
          </p>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
            {interpolate(t.exam.smartNotesTitle, { done: reviewedCount, total: notes.length })}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setShowAdd((p) => !p)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1120] hover:border-blue-600 text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAdd ? t.common.cancel : t.exam.addRevisionNote}</span>
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                {t.exam.noteHeadingLabel}
              </label>
              <input
                type="text"
                required
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder={t.exam.noteHeadingPlaceholder}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                {t.exam.noteMnemonicLabel}
              </label>
              <input
                type="text"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                placeholder={t.exam.noteMnemonicPlaceholder}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              {t.exam.notePointsLabel}
            </label>
            <textarea
              rows={3}
              required
              value={bulletsRaw}
              onChange={(e) => setBulletsRaw(e.target.value)}
              placeholder={t.exam.notePointsPlaceholder}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer"
            >
              {t.exam.saveSmartNote}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note, idx) => (
          <article
            key={note.id}
            className={`p-5 rounded-xl border transition-colors flex flex-col justify-between gap-4 ${
              note.reviewed
                ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/50'
                : 'bg-slate-50 dark:bg-[#0B1120] border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <BookMarked className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                  <h4 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                    0{idx + 1}. {note.heading}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleReviewed(note.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    note.reviewed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-600'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>{note.reviewed ? t.exam.reviewed : t.exam.markReviewed}</span>
                </button>
              </div>

              <ul className="space-y-1.5">
                {note.bulletPoints.map((bp, bIdx) => (
                  <li
                    key={bIdx}
                    className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-blue-700 dark:text-blue-400 shrink-0">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                {t.exam.memoryAnchor}{' '}
                <span className="text-slate-800 dark:text-slate-200">{note.mnemonicOrAnchor}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. Important Keywords Section                                              */
/* -------------------------------------------------------------------------- */

const KEYWORD_CATEGORIES: Array<'All' | ExamKeyword['category']> = [
  'All',
  'Pharmacology',
  'Lab Thresholds',
  'Priority Signs',
  'Procedures',
];

export const ImportantKeywordsSection: React.FC<{
  keywords: ExamKeyword[];
  onToggleKeywordMastered: (id: string) => void;
}> = ({ keywords, onToggleKeywordMastered }) => {
  const { t } = useTranslation();
  const [categoryFilter, setCategoryFilter] = useState<'All' | ExamKeyword['category']>('All');
  const [search, setSearch] = useState('');

  const filtered = keywords.filter((kw) => {
    const matchesCat = categoryFilter === 'All' || kw.category === categoryFilter;
    const q = search.trim().toLowerCase();
    const matchesQuery =
      !q ||
      kw.term.toLowerCase().includes(q) ||
      kw.highYieldDefinition.toLowerCase().includes(q) ||
      kw.examTip.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const masteredCount = keywords.filter((k) => k.mastered).length;

  return (
    <section className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
            {t.exam.keywordsKicker}
          </p>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
            {interpolate(t.exam.keywordsTitle, { done: masteredCount, total: keywords.length })}
          </h3>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.exam.keywordsSearchPlaceholder}
            className="w-full ps-8 pe-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {KEYWORD_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              categoryFilter === cat
                ? 'bg-blue-700 text-white dark:bg-blue-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t.exam.keywordCategories[cat]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
          {t.exam.keywordsEmpty}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((kw) => (
            <div
              key={kw.id}
              className={`p-4 rounded-xl border transition-colors flex flex-col justify-between gap-2.5 ${
                kw.mastered
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/50'
                  : 'bg-slate-50 dark:bg-[#0B1120] border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400">
                      {t.exam.keywordCategories[kw.category] ?? kw.category}
                    </span>
                    <h4 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{kw.term}</span>
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleKeywordMastered(kw.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      kw.mastered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-600'
                    }`}
                  >
                    {kw.mastered ? t.exam.keywordMastered : t.exam.keywordGotIt}
                  </button>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {kw.highYieldDefinition}
                </p>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {t.exam.examTipLabel}{' '}
                </span>
                {kw.examTip}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. MCQ Practice Mode                                                       */
/* -------------------------------------------------------------------------- */

export const ExamMcqPracticeSection: React.FC<{
  title: string;
  subject: string;
  questions: McqQuestion[];
  onRecordAttempt: (attempt: AssessmentAttempt, studyMinutes: number) => void;
}> = ({ title, subject, questions, onRecordAttempt }) => {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [instantFeedback, setInstantFeedback] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;
  const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;

  const handleSelect = (qId: string, idx: number) => {
    if (submitted) return;
    if (instantFeedback && answers[qId] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const handleSubmit = () => {
    if (questions.length === 0 || submitted) return;
    setSubmitted(true);
    onRecordAttempt(
      {
        id: `att-exam-mcq-${Date.now()}`,
        mode: 'mcq',
        title: `${title} (${t.exam.title})`,
        subject,
        score: correctCount,
        total: questions.length,
        createdAt: new Date().toISOString(),
      },
      Math.max(5, questions.length * 2)
    );
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <section className="space-y-4">
      <div className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
            {t.exam.mcqPracticeKicker} · {subject}
          </p>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
            {interpolate(t.exam.mcqExpectedTitle, { count: questions.length })}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
            {interpolate(t.exam.answeredCountOf, {
              answered: answeredCount,
              total: questions.length,
            })}
            {submitted
              ? ` · ${t.exam.finalScorePrefix}: ${correctCount}/${questions.length} (${Math.round(
                  (correctCount / questions.length) * 100
                )}%)`
              : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setInstantFeedback(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                instantFeedback
                  ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {t.exam.instantRationale}
            </button>
            <button
              type="button"
              onClick={() => setInstantFeedback(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                !instantFeedback
                  ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {t.exam.examSimulation}
            </button>
          </div>

          {submitted ? (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.exam.retakeMcqs}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={answeredCount < questions.length}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>{t.exam.submitRecordScore}</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const selected = answers[q.id];
          const showRationale = submitted || (instantFeedback && selected !== undefined);
          const isCorrect = selected === q.correctIndex;

          return (
            <article
              key={q.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                  {interpolate(t.exam.questionOf, { current: qIdx + 1, total: questions.length })}
                </span>
                {showRationale && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      isCorrect
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.exam.correct}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t.exam.incorrect}</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-[15px] font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                {q.stem}
              </p>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selected === optIdx;
                  const isRight = q.correctIndex === optIdx;
                  let btnCls =
                    'bg-slate-50 dark:bg-[#0B1120] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-600 dark:hover:border-blue-500';

                  if (showRationale) {
                    if (isRight) {
                      btnCls =
                        'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-100';
                    } else if (isSelected && !isRight) {
                      btnCls =
                        'bg-red-50 dark:bg-red-950/30 border-red-500 text-red-900 dark:text-red-100';
                    } else {
                      btnCls =
                        'bg-slate-50/50 dark:bg-[#0B1120]/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400';
                    }
                  } else if (isSelected) {
                    btnCls =
                      'bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 text-blue-950 dark:text-blue-100';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full text-start px-4 py-3 rounded-xl border text-sm flex items-start gap-3 transition-colors cursor-pointer ${btnCls}`}
                    >
                      <span className="font-mono text-xs font-bold mt-0.5 shrink-0">
                        {OPTION_LETTERS[optIdx] || optIdx + 1}.
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showRationale && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {t.exam.clinicalRationale}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {q.rationale}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {t.exam.distractorNoteLabel}{' '}
                    </span>
                    {q.distractorNote}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. True/False Practice Mode                                                */
/* -------------------------------------------------------------------------- */

export const ExamTrueFalsePracticeSection: React.FC<{
  title: string;
  subject: string;
  statements: TrueFalseStatement[];
  onRecordAttempt: (attempt: AssessmentAttempt, studyMinutes: number) => void;
}> = ({ title, subject, statements, onRecordAttempt }) => {
  const { t } = useTranslation();
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [savedScore, setSavedScore] = useState(false);

  const answeredCount = statements.filter((s) => responses[s.id] !== undefined).length;
  const correctCount = statements.filter((s) => responses[s.id] === s.isTrue).length;

  const handleChoose = (id: string, val: boolean) => {
    if (responses[id] !== undefined) return;
    setResponses((prev) => ({ ...prev, [id]: val }));
  };

  const handleSave = () => {
    if (statements.length === 0 || savedScore) return;
    setSavedScore(true);
    onRecordAttempt(
      {
        id: `att-exam-tf-${Date.now()}`,
        mode: 'truefalse',
        title: `${title} (${t.exam.jumpTf})`,
        subject,
        score: correctCount,
        total: statements.length,
        createdAt: new Date().toISOString(),
      },
      Math.max(4, Math.round(statements.length * 1.5))
    );
  };

  const handleReset = () => {
    setResponses({});
    setSavedScore(false);
  };

  return (
    <section className="space-y-4">
      <div className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
            {t.exam.tfPracticeKicker} · {subject}
          </p>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
            {interpolate(t.exam.tfRapidTitle, { count: statements.length })}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
            {interpolate(t.exam.answeredCorrect, {
              answered: answeredCount,
              total: statements.length,
              correct: correctCount,
            })}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.common.reset}</span>
          </button>
          <button
            type="button"
            disabled={answeredCount < statements.length || savedScore}
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{savedScore ? t.exam.savedToAnalytics : t.exam.saveDrillScore}</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {statements.map((item, idx) => {
          const chosen = responses[item.id];
          const answered = chosen !== undefined;
          const isRight = chosen === item.isTrue;
          const trueOrFalseText = item.isTrue ? t.exam.trueLabel : t.exam.falseLabel;

          return (
            <article
              key={item.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                  {interpolate(t.exam.statementOf, { current: idx + 1, total: statements.length })}
                </span>
                {answered && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      isRight
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {isRight ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {t.exam.correct} ({trueOrFalseText})
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>
                          {t.exam.incorrect} ({t.exam.actuallyLabel} {trueOrFalseText})
                        </span>
                      </>
                    )}
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-[15px] font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                {item.statement}
              </p>

              <div className="grid grid-cols-2 gap-3 max-w-sm">
                {[true, false].map((val) => {
                  const isSelected = chosen === val;
                  const isActual = item.isTrue === val;
                  let cls =
                    'bg-slate-50 dark:bg-[#0B1120] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-600 dark:hover:border-blue-500';
                  if (answered) {
                    if (isActual) {
                      cls =
                        'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-600 dark:border-emerald-500 text-emerald-900 dark:text-emerald-100';
                    } else if (isSelected && !isActual) {
                      cls =
                        'bg-red-50 dark:bg-red-950/30 border-red-500 text-red-900 dark:text-red-100';
                    } else {
                      cls =
                        'bg-slate-50/50 dark:bg-[#0B1120]/50 border-slate-200 dark:border-slate-800 text-slate-400';
                    }
                  }
                  return (
                    <button
                      key={String(val)}
                      type="button"
                      disabled={answered}
                      onClick={() => handleChoose(item.id, val)}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-colors cursor-pointer disabled:cursor-default ${cls}`}
                    >
                      {val ? t.exam.trueLabel : t.exam.falseLabel}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.explanation}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                    {t.exam.keyRuleLabel} {item.keyTakeaway}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 6. Rapid Revision Cards                                                    */
/* -------------------------------------------------------------------------- */

export const RapidRevisionCardsSection: React.FC<{
  cards: RapidRevisionCard[];
  onToggleConfident: (cardId: string) => void;
}> = ({ cards, onToggleConfident }) => {
  const { t } = useTranslation();
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [order, setOrder] = useState<string[] | null>(null);

  const orderedCards = order
    ? order
        .map((id) => cards.find((c) => c.id === id))
        .filter((c): c is RapidRevisionCard => Boolean(c))
    : cards;

  const safeIndex = orderedCards.length > 0 ? Math.min(cardIdx, orderedCards.length - 1) : 0;
  const current = orderedCards[safeIndex] ?? null;
  const confidentCount = cards.filter((c) => c.confident).length;

  const handleShuffle = () => {
    const ids = cards.map((c) => c.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setOrder(ids);
    setCardIdx(0);
    setFlipped(false);
  };

  if (!current) return null;

  return (
    <section className="space-y-4">
      <div className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
            {t.exam.rapidCardsKicker}
          </p>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
            {interpolate(t.exam.rapidCardsTitle, { done: confidentCount, total: cards.length })}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleShuffle}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-600 transition-colors cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>{t.exam.shuffleCards}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((prev) => !prev)}
        className="w-full min-h-[260px] p-7 sm:p-9 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 transition-colors text-start flex flex-col justify-between cursor-pointer"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
            {flipped ? t.exam.rapidAnswerLabel : t.exam.examPromptLabel}
          </span>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {interpolate(t.exam.cardNumberOf, {
              current: safeIndex + 1,
              total: orderedCards.length,
            })}{' '}
            · {current.confident ? t.exam.confidentState : t.exam.reviewingState}
          </span>
        </div>

        <div className="py-6">
          {!flipped ? (
            <p className="font-display text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50 leading-snug">
              {current.front}
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-50 leading-relaxed">
                {current.back}
              </p>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
                  {t.exam.clinicalPearlLabel}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {current.clinicalPearl}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-1.5">
          <RotateCw className="w-3.5 h-3.5" />
          <span>{flipped ? t.exam.clickToFlipPrompt : t.exam.clickToFlipAnswer}</span>
        </div>
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safeIndex === 0}
            onClick={() => {
              setCardIdx((p) => Math.max(0, p - 1));
              setFlipped(false);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-200 hover:border-blue-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t.common.previous}</span>
          </button>

          <button
            type="button"
            disabled={safeIndex >= orderedCards.length - 1}
            onClick={() => {
              setCardIdx((p) => Math.min(orderedCards.length - 1, p + 1));
              setFlipped(false);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-200 hover:border-blue-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <span>{t.common.next}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onToggleConfident(current.id)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
            current.confident
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>{current.confident ? t.exam.confidentUnmark : t.exam.markConfident}</span>
        </button>
      </div>
    </section>
  );
};
