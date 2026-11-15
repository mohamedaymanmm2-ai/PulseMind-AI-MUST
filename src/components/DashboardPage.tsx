import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CalendarCheck,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  GraduationCap,
  Layers,
  MessageSquare,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  AppView,
  AssessmentAttempt,
  Conversation,
  FlashcardDeck,
  GpaState,
  StudySessionLog,
  StudyTask,
  UpcomingExam,
  UserProfile,
} from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { translateStandingLabel } from '../i18n/translations';
import { calculateGpaMetrics, formatShortDate, getTodayIso } from '../utils/academicMath';
import { WorkspaceHeader } from './WorkspaceHeader';

interface DashboardPageProps {
  profile: UserProfile;
  gpaState: GpaState;
  tasks: StudyTask[];
  decks: FlashcardDeck[];
  attempts: AssessmentAttempt[];
  sessionLogs: StudySessionLog[];
  conversations: Conversation[];
  upcomingExams: UpcomingExam[];
  onNavigate: (view: AppView) => void;
  onToggleTask: (taskId: string) => void;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  isSidebarOpenDesktop: boolean;
  onOpenSidebarDesktop: () => void;
  onOpenSidebarMobile: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  profile,
  gpaState,
  tasks,
  decks,
  attempts,
  sessionLogs,
  conversations,
  upcomingExams,
  onNavigate,
  onToggleTask,
  onSelectConversation,
  onNewChat,
  isSidebarOpenDesktop,
  onOpenSidebarDesktop,
  onOpenSidebarMobile,
}) => {
  const { t, language } = useTranslation();

  const firstName = profile.fullName.trim().split(' ')[0] || 'Student';
  const gpaMetrics = calculateGpaMetrics(gpaState);

  const todayIso = getTodayIso();
  const completedTasksCount = tasks.filter((tItem) => tItem.completed).length;
  const pendingTasks = tasks
    .filter((tItem) => !tItem.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const totalCards = decks.reduce((sum, d) => sum + d.cards.length, 0);
  const masteredCards = decks.reduce(
    (sum, d) => sum + d.cards.filter((c) => c.mastered).length,
    0
  );
  const flashcardMasteryPct = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  const totalQuestionsAnswered = attempts.reduce((sum, a) => sum + a.total, 0);
  const totalQuestionsCorrect = attempts.reduce((sum, a) => sum + a.score, 0);
  const overallAccuracy =
    totalQuestionsAnswered > 0
      ? Math.round((totalQuestionsCorrect / totalQuestionsAnswered) * 100)
      : null;

  const totalLoggedMinutes = sessionLogs.reduce((sum, s) => sum + s.minutes, 0);
  const loggedHoursFormatted = (totalLoggedMinutes / 60).toFixed(1);

  const nextExam = [...upcomingExams].sort(
    (a, b) => new Date(a.examDateIso).getTime() - new Date(b.examDateIso).getTime()
  )[0];
  const hoursUntilNextExam = nextExam
    ? Math.max(0, Math.round((new Date(nextExam.examDateIso).getTime() - Date.now()) / 3600000))
    : null;

  const quickTools: {
    id: AppView;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'exam',
      title: t.dashboard.tools.exam.title,
      subtitle: t.dashboard.tools.exam.subtitle,
      icon: GraduationCap,
    },
    {
      id: 'flashcards',
      title: t.dashboard.tools.flashcards.title,
      subtitle: t.dashboard.tools.flashcards.subtitle,
      icon: Layers,
    },
    {
      id: 'mcq',
      title: t.dashboard.tools.mcq.title,
      subtitle: t.dashboard.tools.mcq.subtitle,
      icon: ClipboardCheck,
    },
    {
      id: 'truefalse',
      title: t.dashboard.tools.truefalse.title,
      subtitle: t.dashboard.tools.truefalse.subtitle,
      icon: CheckCircle2,
    },
    {
      id: 'gpa',
      title: t.dashboard.tools.gpa.title,
      subtitle: t.dashboard.tools.gpa.subtitle,
      icon: Calculator,
    },
    {
      id: 'planner',
      title: t.dashboard.tools.planner.title,
      subtitle: t.dashboard.tools.planner.subtitle,
      icon: CalendarCheck,
    },
    {
      id: 'progress',
      title: t.dashboard.tools.progress.title,
      subtitle: t.dashboard.tools.progress.subtitle,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      <WorkspaceHeader
        title={t.dashboard.title}
        subtitle={profile.clinicalRotation}
        isSidebarOpenDesktop={isSidebarOpenDesktop}
        onOpenSidebarDesktop={onOpenSidebarDesktop}
        onOpenSidebarMobile={onOpenSidebarMobile}
        rightAction={
          <button
            type="button"
            onClick={onNewChat}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.dashboard.newChatBtn}</span>
          </button>
        }
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Welcome Banner */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1.5">
              {t.dashboard.universityLine} · {profile.academicYear}
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
              style={{ textWrap: 'balance' }}
            >
              {t.dashboard.welcomeBack}, {firstName}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {profile.campus} · {t.dashboard.focusPrefix}: {profile.focusAreas.slice(0, 3).join(', ')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('exam')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>
                {nextExam && hoursUntilNextExam !== null && hoursUntilNextExam <= 48
                  ? `${t.dashboard.examTomorrowBtn} (${hoursUntilNextExam}${t.exam.hourShort})`
                  : t.dashboard.openExamModeBtn}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('planner')}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.dashboard.addStudyTaskBtn}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.dashboard.viewProgressBtn}
            </button>
          </div>
        </section>

        {/* 4-Column KPI Strip */}
        <section aria-label={t.dashboard.title} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('gpa')}
            className="text-start p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 transition-colors cursor-pointer"
          >
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {t.dashboard.kpiGpaTitle}
            </p>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                {gpaMetrics.cumulativeGpa.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                {translateStandingLabel(gpaMetrics.standingLabel, t)}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 tabular-nums">
              {t.dashboard.kpiGpaSemester} {gpaMetrics.semesterGpa.toFixed(2)} · {gpaMetrics.semesterCredits}{' '}
              {t.dashboard.creditsAbbr}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('planner')}
            className="text-start p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 transition-colors cursor-pointer"
          >
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {t.dashboard.kpiTasksTitle}
            </p>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                {completedTasksCount}/{tasks.length}
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 tabular-nums">
                {pendingTasks.length} {t.dashboard.kpiTasksPending}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 tabular-nums">
              {loggedHoursFormatted} {t.dashboard.kpiTasksLogged}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('flashcards')}
            className="text-start p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 transition-colors cursor-pointer"
          >
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {t.dashboard.kpiCardsTitle}
            </p>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                {flashcardMasteryPct}%
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 tabular-nums">
                {decks.length}{' '}
                {decks.length === 1
                  ? t.dashboard.kpiCardsDeckSingular
                  : t.dashboard.kpiCardsDeckPlural}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 tabular-nums">
              {masteredCards} / {totalCards} {t.dashboard.kpiCardsMasteredOf}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('mcq')}
            className="text-start p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 transition-colors cursor-pointer"
          >
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {t.dashboard.kpiQuizTitle}
            </p>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                {overallAccuracy !== null ? `${overallAccuracy}%` : '—'}
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 tabular-nums">
                {attempts.length}{' '}
                {attempts.length === 1
                  ? t.dashboard.kpiQuizSingular
                  : t.dashboard.kpiQuizPlural}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 tabular-nums">
              {totalQuestionsAnswered > 0
                ? `${totalQuestionsCorrect}/${totalQuestionsAnswered} ${t.dashboard.kpiQuizCorrect}`
                : t.dashboard.kpiQuizEmpty}
            </p>
          </button>
        </section>

        {/* Workspace Modules Grid */}
        <section>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                {t.dashboard.suiteKicker}
              </p>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
                {t.dashboard.suiteTitle}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onNavigate(tool.id)}
                  className="group text-start p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 transition-colors flex flex-col justify-between gap-4 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors rtl:rotate-180" />
                    </div>
                    <h4 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      {tool.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {tool.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Two-Column Activity Split: Upcoming Tasks & Recent Studies */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Upcoming Study Planner Tasks */}
          <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                  {t.dashboard.scheduleKicker}
                </p>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                  {t.dashboard.scheduleTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('planner')}
                className="text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.dashboard.openPlanner}
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  {t.dashboard.allTasksDone}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  {t.dashboard.allTasksDoneSub}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('planner')}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  {t.dashboard.scheduleTaskBtn}
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {pendingTasks.slice(0, 4).map((task) => {
                  const isDueToday = task.dueDate === todayIso;
                  const isOverdue = task.dueDate < todayIso;
                  return (
                    <div
                      key={task.id}
                      className="py-3.5 flex items-start justify-between gap-3 first:pt-0 last:pb-0"
                    >
                      <button
                        type="button"
                        onClick={() => onToggleTask(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors shrink-0 cursor-pointer"
                        aria-label={task.title}
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {task.title}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{task.subject}</span>
                          <span aria-hidden="true">·</span>
                          <span>{t.planner.categories[task.category] ?? task.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {task.durationMinutes} {t.common.min}
                          </span>
                        </div>
                      </div>
                      <div className="text-end shrink-0">
                        <p
                          className={`text-xs font-medium tabular-nums ${
                            isOverdue
                              ? 'text-red-600 dark:text-red-400'
                              : isDueToday
                                ? 'text-blue-700 dark:text-blue-400'
                                : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {isOverdue
                            ? t.common.overdue
                            : isDueToday
                              ? t.common.today
                              : formatShortDate(task.dueDate, language)}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {t.planner.priorities[task.priority] ?? task.priority} {t.common.prioritySuffix}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Clinical Chats & Assessments */}
          <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                    {t.dashboard.activityKicker}
                  </p>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                    {t.dashboard.activityTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('chat')}
                  className="text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.dashboard.openAiChat}
                </button>
              </div>

              {conversations.length === 0 && attempts.length === 0 ? (
                <div className="py-8 text-center">
                  <BookOpen className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    {t.dashboard.noRecentActivity}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    {t.dashboard.noRecentActivitySub}
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('mcq')}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    {t.dashboard.generateFirstQuiz}
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {conversations.slice(0, 3).map((conv) => (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => {
                        onSelectConversation(conv.id);
                        onNavigate('chat');
                      }}
                      className="w-full py-3 flex items-center justify-between gap-3 text-start hover:text-blue-700 dark:hover:text-blue-400 transition-colors first:pt-0 cursor-pointer"
                    >
                      <div className="min-w-0">
                        <p dir="auto" className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {conv.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {t.dashboard.clinicalChatLabel} · {formatShortDate(conv.updatedAt, language)}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 rtl:rotate-180" />
                    </button>
                  ))}

                  {attempts.slice(0, 2).map((att) => (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => onNavigate('progress')}
                      className="w-full py-3 flex items-center justify-between gap-3 text-start hover:text-blue-700 dark:hover:text-blue-400 transition-colors last:pb-0 cursor-pointer"
                    >
                      <div className="min-w-0">
                        <p dir="auto" className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {att.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {att.mode === 'mcq' ? t.dashboard.mcqQuizLabel : t.dashboard.tfDrillLabel} ·{' '}
                          {att.subject}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 tabular-nums shrink-0">
                        {att.score}/{att.total}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
