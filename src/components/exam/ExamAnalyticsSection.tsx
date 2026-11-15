import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Compass,
  Loader2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import {
  AssessmentAttempt,
  ExamTomorrowPack,
  FlashcardDeck,
  PersonalizedRecommendation,
  PersonalizedStudyPlan,
  StudySessionLog,
  StudyTask,
  UpcomingExam,
  UserProfile,
} from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';
import { interpolate } from '../../i18n/translations';
import { postJsonWithRetry } from '../../utils/apiFetch';

interface ExamAnalyticsSectionProps {
  profile: UserProfile;
  exams: UpcomingExam[];
  pack: ExamTomorrowPack;
  attempts: AssessmentAttempt[];
  decks: FlashcardDeck[];
  tasks: StudyTask[];
  sessionLogs: StudySessionLog[];
  studyPlan: PersonalizedStudyPlan | null;
  onUpdateStudyPlan: (plan: PersonalizedStudyPlan) => void;
  onLaunchRecommendation: (rec: PersonalizedRecommendation) => void;
}

export const ExamAnalyticsSection: React.FC<ExamAnalyticsSectionProps> = ({
  profile,
  exams,
  pack,
  attempts,
  decks,
  tasks,
  sessionLogs,
  studyPlan,
  onUpdateStudyPlan,
  onLaunchRecommendation,
}) => {
  const { language, t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analytics = useMemo(() => {
    const totalQuizItems = attempts.reduce((sum, a) => sum + a.total, 0);
    const totalQuizCorrect = attempts.reduce((sum, a) => sum + a.score, 0);
    const quizAccuracy =
      totalQuizItems > 0 ? Math.round((totalQuizCorrect / totalQuizItems) * 100) : null;

    const keywordsMastered = pack.keywords.filter((k) => k.mastered).length;
    const notesReviewed = pack.smartNotes.filter((n) => n.reviewed).length;
    const cardsConfident = pack.revisionCards.filter((c) => c.confident).length;
    const packTotalItems =
      pack.keywords.length + pack.smartNotes.length + pack.revisionCards.length;
    const packDoneItems = keywordsMastered + notesReviewed + cardsConfident;
    const packCompletionPct =
      packTotalItems > 0 ? Math.round((packDoneItems / packTotalItems) * 100) : 0;

    const totalDeckCards = decks.reduce((sum, d) => sum + d.cards.length, 0);
    const masteredDeckCards = decks.reduce(
      (sum, d) => sum + d.cards.filter((c) => c.mastered).length,
      0
    );
    const deckMasteryPct =
      totalDeckCards > 0 ? Math.round((masteredDeckCards / totalDeckCards) * 100) : 0;

    const totalMinutes = sessionLogs.reduce((sum, l) => sum + l.minutes, 0);

    // Subject breakdown
    const subjectMap = new Map<
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

    const ensure = (subj: string) => {
      const key = subj.trim() || 'Clinical Nursing';
      if (!subjectMap.has(key)) {
        subjectMap.set(key, {
          subject: key,
          quizCorrect: 0,
          quizTotal: 0,
          cardsMastered: 0,
          cardsTotal: 0,
          minutes: 0,
        });
      }
      return subjectMap.get(key)!;
    };

    for (const a of attempts) {
      const row = ensure(a.subject);
      row.quizCorrect += a.score;
      row.quizTotal += a.total;
    }
    for (const d of decks) {
      const row = ensure(d.subject);
      row.cardsTotal += d.cards.length;
      row.cardsMastered += d.cards.filter((c) => c.mastered).length;
    }
    for (const log of sessionLogs) {
      const row = ensure(log.subject);
      row.minutes += log.minutes;
    }
    for (const ex of exams) {
      ensure(ex.subject);
    }

    const subjectRows = Array.from(subjectMap.values()).map((r) => {
      const quizAccuracyPct =
        r.quizTotal > 0 ? Math.round((r.quizCorrect / r.quizTotal) * 100) : null;
      const cardMasteryPct =
        r.cardsTotal > 0 ? Math.round((r.cardsMastered / r.cardsTotal) * 100) : null;
      return {
        ...r,
        quizAccuracyPct,
        cardMasteryPct,
      };
    });

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const iso = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
        weekday: 'short',
      });
      const mins = sessionLogs
        .filter((l) => l.date === iso)
        .reduce((sum, l) => sum + l.minutes, 0);
      return { iso, label, mins };
    });
    const maxDayMins = Math.max(30, ...last7Days.map((d) => d.mins));

    return {
      totalQuizItems,
      totalQuizCorrect,
      quizAccuracy,
      packCompletionPct,
      packDoneItems,
      packTotalItems,
      deckMasteryPct,
      masteredDeckCards,
      totalDeckCards,
      totalMinutes,
      subjectRows,
      last7Days,
      maxDayMins,
    };
  }, [attempts, decks, exams, language, pack, sessionLogs]);

  // Deterministic, real-state fallback recommendations when AI plan hasn't been fetched yet
  const heuristicPlan: PersonalizedStudyPlan = useMemo(() => {
    const recs: PersonalizedRecommendation[] = [];
    const now = Date.now();

    const sortedExams = [...exams].sort(
      (a, b) => new Date(a.examDateIso).getTime() - new Date(b.examDateIso).getTime()
    );
    const nearest = sortedExams[0];
    if (nearest) {
      const hoursLeft = Math.max(
        1,
        Math.round((new Date(nearest.examDateIso).getTime() - now) / 3600000)
      );
      recs.push({
        id: 'heuristic-nearest-exam',
        priority: hoursLeft <= 36 ? 'Urgent' : 'High',
        subject: nearest.subject,
        title:
          language === 'ar'
            ? hoursLeft <= 36
              ? `تشغيل سباق امتحان الغد لمقرر ${nearest.courseCode}`
              : `مراجعة الملخص عالي التركيز لمقرر ${nearest.courseCode}`
            : hoursLeft <= 36
              ? `Run Exam Tomorrow Sprint for ${nearest.courseCode}`
              : `Review High-Yield Summary for ${nearest.courseCode}`,
        reason:
          language === 'ar'
            ? `${nearest.title} بعد ${hoursLeft} ساعة. ركّز على إجراءات الأولوية والترياقات وأسئلة الامتحان المتوقعة.`
            : `${nearest.title} is in ${hoursLeft} hours. Focus on priority actions, antidotes, and expected exam questions.`,
        actionType: hoursLeft <= 36 ? 'exam_tomorrow' : 'summary',
        suggestedTopic: nearest.topics,
        estimatedMinutes: 30,
      });
    }

    const weakSubjects = analytics.subjectRows
      .filter((r) => r.quizAccuracyPct !== null && r.quizAccuracyPct < 80)
      .sort((a, b) => (a.quizAccuracyPct ?? 100) - (b.quizAccuracyPct ?? 100));

    if (weakSubjects.length > 0) {
      const weakest = weakSubjects[0];
      recs.push({
        id: 'heuristic-weak-subject',
        priority: 'High',
        subject: weakest.subject,
        title:
          language === 'ar'
            ? `ارفع دقة الاختيار من متعدد في ${weakest.subject} (${weakest.quizAccuracyPct}%)`
            : `Boost ${weakest.subject} MCQ Accuracy (${weakest.quizAccuracyPct}%)`,
        reason:
          language === 'ar'
            ? `دقتك المسجلة في ${weakest.subject} هي ${weakest.quizAccuracyPct}%. تدرب على حالات سريرية مع التعليلات لسد الفجوات.`
            : `Your recorded quiz accuracy in ${weakest.subject} is ${weakest.quizAccuracyPct}%. Practice clinical vignettes with rationales to close gaps.`,
        actionType: 'mcq',
        suggestedTopic: `${weakest.subject} priority nursing interventions and clinical safety`,
        estimatedMinutes: 20,
      });
    } else {
      recs.push({
        id: 'heuristic-mcq-baseline',
        priority: 'High',
        subject: pack.subject,
        title:
          language === 'ar'
            ? `حل أسئلة الاختيار من متعدد المتوقعة في ${pack.subject}`
            : `Complete Expected Exam MCQs on ${pack.subject}`,
        reason:
          language === 'ar'
            ? attempts.length === 0
              ? 'لم تُسجَّل تدريبات بدرجات بعد. أكمل مجموعة اختيار من متعدد لتحديد مستواك المبدئي.'
              : 'حافظ على جاهزية التفكير الامتحاني عبر أسئلة حالات سريرية جديدة.'
            : attempts.length === 0
              ? 'No scored exam drills recorded yet. Complete an MCQ set to establish your baseline readiness.'
              : 'Keep exam reasoning sharp with fresh clinical vignette questions.',
        actionType: 'mcq',
        suggestedTopic: pack.topic,
        estimatedMinutes: 20,
      });
    }

    const unmasteredKeywords = pack.keywords.filter((k) => !k.mastered).length;
    if (unmasteredKeywords > 0) {
      recs.push({
        id: 'heuristic-keywords',
        priority: 'High',
        subject: pack.subject,
        title:
          language === 'ar'
            ? `تدرّب على ${unmasteredKeywords} مصطلحاً وقواعد صح وخطأ متبقية`
            : `Drill ${unmasteredKeywords} Remaining High-Yield Keywords & True/False Rules`,
        reason:
          language === 'ar'
            ? `لديك ${unmasteredKeywords} مصطلحاً غير متقن في الحزمة الحالية. اختبارات صح وخطأ تثبّت حدود التحاليل والترياقات.`
            : `You have ${unmasteredKeywords} unmastered keywords in your current pack. Rapid True/False checks solidify lab cutoffs and antidotes.`,
        actionType: 'truefalse',
        suggestedTopic: `${pack.topic} lab thresholds, antidotes, and nursing safety rules`,
        estimatedMinutes: 15,
      });
    }

    const pendingHighTasks = tasks.filter((t) => !t.completed && t.priority === 'High');
    if (pendingHighTasks.length > 0) {
      const topTask = pendingHighTasks[0];
      recs.push({
        id: 'heuristic-task',
        priority: 'Maintain',
        subject: topTask.subject,
        title:
          language === 'ar'
            ? `بطاقات استرجاع نشط: ${topTask.title}`
            : `Active Recall Cards: ${topTask.title}`,
        reason:
          language === 'ar'
            ? `تطابق مهمة عالية الأولوية في مخطط المذاكرة (${topTask.durationMinutes} دقيقة مجدولة).`
            : `Matches your high-priority pending task in Study Planner (${topTask.durationMinutes} min scheduled).`,
        actionType: 'flashcards',
        suggestedTopic: topTask.title,
        estimatedMinutes: topTask.durationMinutes,
      });
    }

    return {
      generatedAt: new Date().toISOString(),
      focusSummary: nearest
        ? interpolate(t.exam.heuristicFocusWithExam, {
            code: nearest.courseCode,
            subject: nearest.subject,
          })
        : t.exam.heuristicFocusDefault,
      recommendations: recs.slice(0, 4),
    };
  }, [analytics.subjectRows, attempts.length, exams, language, pack, t.exam.heuristicFocusDefault, t.exam.heuristicFocusWithExam, tasks]);

  const activePlan = studyPlan ?? heuristicPlan;

  const handleRefreshAiPlan = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setError(null);

    const now = Date.now();
    const snapshot = {
      upcomingExams: exams.map((e) => ({
        title: e.title,
        subject: e.subject,
        hoursUntil: Math.round((new Date(e.examDateIso).getTime() - now) / 3600000),
        topics: e.topics,
      })),
      subjectPerformance: analytics.subjectRows.map((r) => ({
        subject: r.subject,
        quizAccuracyPct: r.quizAccuracyPct,
        cardMasteryPct: r.cardMasteryPct,
      })),
      pendingTaskCount: tasks.filter((t) => !t.completed).length,
      totalLoggedMinutes: analytics.totalMinutes,
    };

    try {
      const data = await postJsonWithRetry<PersonalizedStudyPlan>(
        '/api/exam/recommendations',
        { profile, snapshot, language }
      );
      onUpdateStudyPlan(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to generate AI recommendations.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Learning Progress Analytics */}
      <section className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
              {t.exam.analyticsKicker}
            </p>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
              {t.exam.analyticsTitle}
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {interpolate(t.exam.totalLoggedHrs, { hrs: (analytics.totalMinutes / 60).toFixed(1) })}
          </span>
        </div>

        {/* 4 KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              {t.exam.activePackReadiness}
            </p>
            <p className="font-mono text-2xl font-bold text-blue-700 dark:text-blue-400 tabular-nums">
              {analytics.packCompletionPct}%
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
              {interpolate(t.exam.notesKeywordsCards, {
                done: analytics.packDoneItems,
                total: analytics.packTotalItems,
              })}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              {t.exam.quizAccuracyCombined}
            </p>
            <p className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
              {analytics.quizAccuracy !== null ? `${analytics.quizAccuracy}%` : '—'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
              {analytics.totalQuizItems > 0
                ? interpolate(t.exam.itemsCorrect, {
                    correct: analytics.totalQuizCorrect,
                    total: analytics.totalQuizItems,
                  })
                : t.exam.completeDrillToScore}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              {t.exam.flashcardLibraryMastery}
            </p>
            <p className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
              {analytics.deckMasteryPct}%
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
              {interpolate(t.exam.deckCardsMastered, {
                done: analytics.masteredDeckCards,
                total: analytics.totalDeckCards,
              })}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              {t.exam.assessmentsCompleted}
            </p>
            <p className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
              {attempts.length}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
              {interpolate(t.exam.upcomingExamsTracked, { count: exams.length })}
            </p>
          </div>
        </div>

        {/* 7-Day Activity & Subject Breakdown Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                {t.exam.sevenDayMinutes}
              </h4>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>

            <div className="grid grid-cols-7 gap-2.5 items-end h-36">
              {analytics.last7Days.map((day) => {
                const heightPct =
                  day.mins > 0 ? Math.max(12, Math.round((day.mins / analytics.maxDayMins) * 100)) : 5;
                return (
                  <div key={day.iso} className="flex flex-col items-center justify-end h-full gap-1.5">
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
                      {day.mins > 0 ? `${day.mins}m` : '0'}
                    </span>
                    <div className="w-full max-w-[30px] flex-1 flex items-end bg-slate-200/70 dark:bg-slate-800 rounded-md overflow-hidden">
                      <div
                        className={`w-full rounded-t-sm transition-all ${
                          day.mins > 0 ? 'bg-blue-700 dark:bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 p-5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
              {t.exam.domainAccuracy}
            </h4>

            {analytics.subjectRows.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-6">
                {t.exam.domainAccuracyEmpty}
              </p>
            ) : (
              <div className="space-y-3">
                {analytics.subjectRows.map((row) => {
                  const pct = row.quizAccuracyPct ?? row.cardMasteryPct ?? 0;
                  const statusColor =
                    pct >= 80
                      ? 'bg-emerald-600 dark:bg-emerald-500'
                      : pct >= 60
                        ? 'bg-blue-700 dark:bg-blue-500'
                        : 'bg-amber-600 dark:bg-amber-500';
                  return (
                    <div key={row.subject} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {row.subject}
                        </span>
                        <span className="font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                          {row.quizAccuracyPct !== null
                            ? `${interpolate(t.progress.quizTag, { pct: row.quizAccuracyPct })} (${row.quizCorrect}/${row.quizTotal})`
                            : row.cardMasteryPct !== null
                              ? interpolate(t.progress.cardsTag, { pct: row.cardMasteryPct })
                              : t.exam.pendingPractice}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${statusColor}`}
                          style={{ width: `${Math.max(4, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Personalized Study Recommendations */}
      <section className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
              {t.exam.personalizedRecsKicker}
            </p>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
              {t.exam.personalizedRecsTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {activePlan.focusSummary}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefreshAiPlan}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.exam.personalizingPlan}</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.exam.personalizeWithAi}</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-xl px-3.5 py-2">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activePlan.recommendations.map((rec) => {
            const priorityClass =
              rec.priority === 'Urgent'
                ? 'text-red-600 dark:text-red-400'
                : rec.priority === 'High'
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-emerald-700 dark:text-emerald-400';

            const actionLabel = t.exam.recActions[rec.actionType];
            const priorityText = t.exam.priorities[rec.priority] ?? rec.priority;

            return (
              <div
                key={rec.id}
                className="p-5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className={`font-semibold ${priorityClass}`}>
                      {priorityText} {t.exam.priorityBadge} · {rec.subject}
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                      ~{rec.estimatedMinutes} {t.common.min}
                    </span>
                  </div>

                  <h4 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100 flex items-start gap-2">
                    <Compass className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>{rec.title}</span>
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rec.reason}
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => onLaunchRecommendation(rec)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline underline-offset-4 cursor-pointer"
                  >
                    <span>{actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
