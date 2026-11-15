import React from 'react';
import { CheckCircle2, Circle, Trash2, TrendingUp } from 'lucide-react';
import {
  AppView,
  AssessmentAttempt,
  Conversation,
  FlashcardDeck,
  GpaState,
  StudySessionLog,
  StudyTask,
} from '../types';
import { calculateGpaMetrics, formatShortDate } from '../utils/academicMath';
import { useTranslation } from '../i18n/LanguageContext';
import { interpolate } from '../i18n/translations';
import { WorkspaceHeader } from './WorkspaceHeader';

interface ProgressPageProps {
  gpaState: GpaState;
  tasks: StudyTask[];
  decks: FlashcardDeck[];
  attempts: AssessmentAttempt[];
  sessionLogs: StudySessionLog[];
  conversations: Conversation[];
  onNavigate: (view: AppView) => void;
  onClearAttempts: () => void;
  isSidebarOpenDesktop: boolean;
  onOpenSidebarDesktop: () => void;
  onOpenSidebarMobile: () => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  gpaState,
  tasks,
  decks,
  attempts,
  sessionLogs,
  conversations,
  onNavigate,
  onClearAttempts,
  isSidebarOpenDesktop,
  onOpenSidebarDesktop,
  onOpenSidebarMobile,
}) => {
  const { t, language } = useTranslation();
  const gpaMetrics = calculateGpaMetrics(gpaState);

  const totalQuestions = attempts.reduce((sum, a) => sum + a.total, 0);
  const totalCorrect = attempts.reduce((sum, a) => sum + a.score, 0);
  const overallAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : null;

  const totalCards = decks.reduce((sum, d) => sum + d.cards.length, 0);
  const masteredCards = decks.reduce(
    (sum, d) => sum + d.cards.filter((c) => c.mastered).length,
    0
  );
  const flashcardPct = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  const completedTasks = tasks.filter((task) => task.completed).length;
  const taskPct = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const totalMinutes = sessionLogs.reduce((sum, s) => sum + s.minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Build last 7 days activity chart from real StudySessionLog entries
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      weekday: 'short',
    });
    const mins = sessionLogs
      .filter((log) => log.date === iso)
      .reduce((sum, log) => sum + log.minutes, 0);
    return { iso, label, mins };
  });
  const maxDayMins = Math.max(30, ...last7Days.map((d) => d.mins));

  // Subject breakdown across assessments & flashcards
  const subjectStatsMap = new Map<
    string,
    {
      subject: string;
      quizCorrect: number;
      quizTotal: number;
      cardsMastered: number;
      cardsTotal: number;
      minutes: number;
    }
  >();

  const ensureSubject = (subject: string) => {
    const key = subject.trim() || 'General Nursing';
    if (!subjectStatsMap.has(key)) {
      subjectStatsMap.set(key, {
        subject: key,
        quizCorrect: 0,
        quizTotal: 0,
        cardsMastered: 0,
        cardsTotal: 0,
        minutes: 0,
      });
    }
    return subjectStatsMap.get(key)!;
  };

  for (const att of attempts) {
    const entry = ensureSubject(att.subject);
    entry.quizCorrect += att.score;
    entry.quizTotal += att.total;
  }

  for (const deck of decks) {
    const entry = ensureSubject(deck.subject);
    entry.cardsTotal += deck.cards.length;
    entry.cardsMastered += deck.cards.filter((c) => c.mastered).length;
  }

  for (const log of sessionLogs) {
    const entry = ensureSubject(log.subject);
    entry.minutes += log.minutes;
  }

  const subjectRows = Array.from(subjectStatsMap.values());

  // Real readiness milestones
  const milestones = [
    {
      key: 'chat',
      label: t.progress.milestones.chat.label,
      done: conversations.length > 0,
      ctaView: 'chat' as AppView,
      ctaText: t.progress.milestones.chat.cta,
    },
    {
      key: 'gpa',
      label: t.progress.milestones.gpa.label,
      done: gpaState.courses.length >= 3,
      ctaView: 'gpa' as AppView,
      ctaText: t.progress.milestones.gpa.cta,
    },
    {
      key: 'planner',
      label: t.progress.milestones.planner.label,
      done: completedTasks >= 3,
      ctaView: 'planner' as AppView,
      ctaText: t.progress.milestones.planner.cta,
    },
    {
      key: 'cards',
      label: t.progress.milestones.cards.label,
      done: masteredCards >= 5,
      ctaView: 'flashcards' as AppView,
      ctaText: t.progress.milestones.cards.cta,
    },
    {
      key: 'quiz',
      label: t.progress.milestones.quiz.label,
      done: attempts.some((a) => a.total > 0 && a.score / a.total >= 0.8),
      ctaView: 'mcq' as AppView,
      ctaText: t.progress.milestones.quiz.cta,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      <WorkspaceHeader
        title={t.progress.title}
        subtitle={t.progress.subtitle}
        isSidebarOpenDesktop={isSidebarOpenDesktop}
        onOpenSidebarDesktop={onOpenSidebarDesktop}
        onOpenSidebarMobile={onOpenSidebarMobile}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Top 4 KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {t.progress.quizAccuracy}
            </p>
            <p className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
              {overallAccuracy !== null ? `${overallAccuracy}%` : '—'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 tabular-nums">
              {interpolate(t.progress.completedItems, {
                count: attempts.length,
                correct: totalCorrect,
                total: totalQuestions,
              })}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {t.progress.flashcardMastery}
            </p>
            <p className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
              {flashcardPct}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 tabular-nums">
              {interpolate(t.progress.cardsMasteredOf, {
                done: masteredCards,
                total: totalCards,
              })}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {t.progress.taskCompletion}
            </p>
            <p className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
              {taskPct}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 tabular-nums">
              {interpolate(t.progress.studyTasksDone, {
                done: completedTasks,
                total: tasks.length,
              })}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {t.progress.studyTimeLogged}
            </p>
            <p className="font-mono text-2xl font-bold text-blue-700 dark:text-blue-400 tabular-nums">
              {totalHours} {t.common.hrs}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 tabular-nums">
              {interpolate(t.progress.projectedCgpa, {
                gpa: gpaMetrics.cumulativeGpa.toFixed(2),
              })}
            </p>
          </div>
        </section>

        {/* Weekly Activity Chart & Milestones */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 7-Day Study Activity Bar Chart */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                  {t.progress.weeklyLogKicker}
                </p>
                <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                  {t.progress.weeklyLogTitle}
                </h2>
              </div>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>

            <div className="grid grid-cols-7 gap-3 items-end h-44 pt-4">
              {last7Days.map((day) => {
                const heightPct =
                  day.mins > 0 ? Math.max(10, Math.round((day.mins / maxDayMins) * 100)) : 4;
                return (
                  <div key={day.iso} className="flex flex-col items-center justify-end h-full gap-2">
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      {day.mins > 0 ? `${day.mins}${language === 'ar' ? ` ${t.common.min}` : 'm'}` : '0'}
                    </span>
                    <div className="w-full max-w-[36px] flex-1 flex items-end bg-slate-100 dark:bg-[#0B1120] rounded-lg overflow-hidden">
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          day.mins > 0
                            ? 'bg-blue-700 dark:bg-blue-500'
                            : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical Readiness Milestones */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <div className="mb-5">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                {t.progress.readinessKicker}
              </p>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                {t.progress.readinessTitle}
              </h2>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {milestones.map((m) => (
                <div
                  key={m.key}
                  className="py-3 flex items-start justify-between gap-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    {m.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-xs leading-relaxed ${
                        m.done
                          ? 'text-slate-900 dark:text-slate-100 font-medium'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {m.label}
                    </span>
                  </div>
                  {!m.done && (
                    <button
                      type="button"
                      onClick={() => onNavigate(m.ctaView)}
                      className="text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {m.ctaText}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subject Competency Breakdown */}
        <section className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
          <div className="mb-5">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
              {t.progress.coverageKicker}
            </p>
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
              {t.progress.coverageTitle}
            </h2>
          </div>

          {subjectRows.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.progress.coverageEmpty}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {subjectRows.map((row) => {
                const quizPct =
                  row.quizTotal > 0 ? Math.round((row.quizCorrect / row.quizTotal) * 100) : null;
                const cardPct =
                  row.cardsTotal > 0 ? Math.round((row.cardsMastered / row.cardsTotal) * 100) : null;
                const compositePct =
                  quizPct !== null && cardPct !== null
                    ? Math.round((quizPct + cardPct) / 2)
                    : quizPct ?? cardPct ?? 100;

                return (
                  <div
                    key={row.subject}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {row.subject}
                      </span>
                      <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                        {quizPct !== null
                          ? interpolate(t.progress.quizTag, { pct: quizPct })
                          : cardPct !== null
                            ? interpolate(t.progress.cardsTag, { pct: cardPct })
                            : interpolate(t.progress.minLoggedTag, { mins: row.minutes })}
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-700 dark:bg-blue-500 transition-all"
                        style={{ width: `${compositePct}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      <span>
                        {t.progress.cardsLabel}: {row.cardsMastered}/{row.cardsTotal}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {t.progress.quizItemsLabel}: {row.quizCorrect}/{row.quizTotal}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{interpolate(t.progress.minLoggedTag, { mins: row.minutes })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Assessment History Table */}
        <section className="rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                {t.progress.historyKicker}
              </p>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                {t.progress.historyTitle}
              </h2>
            </div>

            {attempts.length > 0 && (
              <button
                type="button"
                onClick={onClearAttempts}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.progress.clearHistory}</span>
              </button>
            )}
          </div>

          {attempts.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                {t.progress.noAttemptsTitle}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                {t.progress.noAttemptsSub}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('mcq')}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  {t.progress.openMcq}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('truefalse')}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-600 transition-colors cursor-pointer"
                >
                  {t.progress.tryTf}
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-[#0F172A]/60">
                    <th className="py-3 px-6">{t.progress.colTitle}</th>
                    <th className="py-3 px-4">{t.progress.colMode}</th>
                    <th className="py-3 px-4">{t.progress.colSubject}</th>
                    <th className="py-3 px-4">{t.progress.colDate}</th>
                    <th className="py-3 px-6 text-end">{t.progress.colScore}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                  {attempts.map((att) => {
                    const pct = att.total > 0 ? Math.round((att.score / att.total) * 100) : 0;
                    return (
                      <tr
                        key={att.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-3.5 px-6 font-medium text-slate-900 dark:text-slate-100">
                          {att.title}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300">
                          {att.mode === 'mcq' ? t.progress.modeMcq : t.progress.modeTf}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300">
                          {att.subject}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                          {formatShortDate(att.createdAt, language)}
                        </td>
                        <td className="py-3.5 px-6 text-end font-mono text-xs font-semibold tabular-nums">
                          <span
                            className={
                              pct >= 80
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : pct >= 60
                                  ? 'text-blue-700 dark:text-blue-400'
                                  : 'text-amber-700 dark:text-amber-400'
                            }
                          >
                            {att.score}/{att.total} ({pct}%)
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
