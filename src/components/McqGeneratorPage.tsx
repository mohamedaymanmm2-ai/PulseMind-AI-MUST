import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { AssessmentAttempt, McqQuestion, UserProfile } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { interpolate } from '../i18n/translations';
import { WorkspaceHeader } from './WorkspaceHeader';
import { postJsonWithRetry } from '../utils/apiFetch';

interface McqGeneratorPageProps {
  profile: UserProfile;
  onRecordAttempt: (attempt: AssessmentAttempt, studyMinutes: number) => void;
  isSidebarOpenDesktop: boolean;
  onOpenSidebarDesktop: () => void;
  onOpenSidebarMobile: () => void;
}

const DIFFICULTIES = ['Core Concepts', 'Clinical Application', 'Priority & Triage (NCLEX/OSCE)'];
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const McqGeneratorPage: React.FC<McqGeneratorPageProps> = ({
  profile,
  onRecordAttempt,
  isSidebarOpenDesktop,
  onOpenSidebarDesktop,
  onOpenSidebarMobile,
}) => {
  const { language, t } = useTranslation();
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quizTitle, setQuizTitle] = useState('');
  const [quizSubject, setQuizSubject] = useState('');
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [instantFeedback, setInstantFeedback] = useState(true);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const data = await postJsonWithRetry<{
        title?: string;
        subject?: string;
        questions?: McqQuestion[];
      }>('/api/generate/mcq', {
        topic: trimmed,
        count,
        difficulty,
        profile,
        language,
      });

      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No questions were returned. Please try again.');
      }

      setQuizTitle(data.title || trimmed.slice(0, 48));
      setQuizSubject(data.subject || 'Medical-Surgical Nursing');
      setQuestions(data.questions);
      setAnswers({});
      setSubmitted(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to generate MCQ quiz.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (submitted) return;
    if (instantFeedback && answers[questionId] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;
  const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;

  const handleFinishQuiz = () => {
    if (questions.length === 0 || submitted) return;
    setSubmitted(true);
    onRecordAttempt(
      {
        id: `att-${Date.now()}`,
        mode: 'mcq',
        title: quizTitle || 'Clinical MCQ Quiz',
        subject: quizSubject || 'Medical-Surgical',
        score: correctCount,
        total: questions.length,
        createdAt: new Date().toISOString(),
      },
      Math.max(5, questions.length * 2)
    );
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      <WorkspaceHeader
        title={t.mcq.title}
        subtitle={t.mcq.subtitle}
        isSidebarOpenDesktop={isSidebarOpenDesktop}
        onOpenSidebarDesktop={onOpenSidebarDesktop}
        onOpenSidebarMobile={onOpenSidebarMobile}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generator Controls */}
        <div className="lg:col-span-4">
          <form
            onSubmit={handleGenerate}
            className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-4 lg:sticky lg:top-20"
          >
            <div>
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                {t.mcq.builderKicker}
              </p>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                {t.mcq.builderTitle}
              </h2>
            </div>

            <div>
              <label
                htmlFor="mcq-topic"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.mcq.topicLabel}
              </label>
              <textarea
                id="mcq-topic"
                rows={4}
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t.mcq.topicPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {t.mcq.presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTopic(preset)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer text-start"
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="mcq-count"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  {t.mcq.questionsLabel}
                </label>
                <select
                  id="mcq-count"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 font-mono text-xs tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                >
                  {[5, 8, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} {t.mcq.questionsUnit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="mcq-difficulty"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  {t.mcq.levelLabel}
                </label>
                <select
                  id="mcq-difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                >
                  {DIFFICULTIES.map((d, idx) => (
                    <option key={d} value={d}>
                      {t.mcq.difficulties[idx] ?? d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {t.mcq.feedbackModeLabel}
              </span>
              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setInstantFeedback(true)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    instantFeedback
                      ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {t.mcq.instant}
                </button>
                <button
                  type="button"
                  onClick={() => setInstantFeedback(false)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    !instantFeedback
                      ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {t.mcq.examEnd}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!topic.trim() || isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.mcq.generatingBtn}</span>
                </>
              ) : (
                <>
                  <ClipboardCheck className="w-4 h-4" />
                  <span>{t.mcq.generateBtn}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Interactive MCQ Exam Stage */}
        <div className="lg:col-span-8 space-y-5">
          {questions.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-center">
              <ClipboardCheck className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 mb-1">
                {t.mcq.emptyTitle}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {t.mcq.emptySub}
              </p>
            </div>
          ) : (
            <>
              {/* Quiz Header Banner */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                    {quizSubject}
                  </p>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
                    {quizTitle}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                    {interpolate(t.mcq.answeredOf, {
                      answered: answeredCount,
                      total: questions.length,
                    })}
                    {submitted
                      ? ` · ${t.mcq.scoreLabel}: ${correctCount}/${questions.length} (${Math.round(
                          (correctCount / questions.length) * 100
                        )}%)`
                      : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  {submitted ? (
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-600 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.mcq.retakeQuiz}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinishQuiz}
                      disabled={answeredCount < questions.length}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      {t.mcq.submitSaveScore}
                    </button>
                  )}
                </div>
              </div>

              {/* Question Cards */}
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
                          {interpolate(t.mcq.questionOf, {
                            current: qIdx + 1,
                            total: questions.length,
                          })}
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
                                <span>{t.mcq.correct}</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                <span>{t.mcq.incorrect}</span>
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
                          const isRightOption = q.correctIndex === optIdx;

                          let btnClasses =
                            'bg-slate-50 dark:bg-[#0B1120] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-600 dark:hover:border-blue-500';

                          if (showRationale) {
                            if (isRightOption) {
                              btnClasses =
                                'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-100';
                            } else if (isSelected && !isRightOption) {
                              btnClasses =
                                'bg-red-50 dark:bg-red-950/30 border-red-500 dark:border-red-500 text-red-900 dark:text-red-100';
                            } else {
                              btnClasses =
                                'bg-slate-50/50 dark:bg-[#0B1120]/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400';
                            }
                          } else if (isSelected) {
                            btnClasses =
                              'bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 text-blue-950 dark:text-blue-100';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`w-full text-start px-4 py-3 rounded-xl border text-sm flex items-start gap-3 transition-colors cursor-pointer ${btnClasses}`}
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
                            {t.mcq.clinicalRationale}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {q.rationale}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                              {t.mcq.distractorPrefix}{' '}
                            </span>
                            {q.distractorNote}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
