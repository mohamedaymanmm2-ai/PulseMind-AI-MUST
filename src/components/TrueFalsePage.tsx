import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { AssessmentAttempt, TrueFalseStatement, UserProfile } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { interpolate } from '../i18n/translations';
import { WorkspaceHeader } from './WorkspaceHeader';
import { postJsonWithRetry } from '../utils/apiFetch';

interface TrueFalsePageProps {
  profile: UserProfile;
  onRecordAttempt: (attempt: AssessmentAttempt, studyMinutes: number) => void;
  isSidebarOpenDesktop: boolean;
  onOpenSidebarDesktop: () => void;
  onOpenSidebarMobile: () => void;
}

const FOCUS_LEVELS = [
  'Clinical Safety & Rapid Recall',
  'Pharmacology Contraindications',
  'OSCE & Bedside Protocols',
];

export const TrueFalsePage: React.FC<TrueFalsePageProps> = ({
  profile,
  onRecordAttempt,
  isSidebarOpenDesktop,
  onOpenSidebarDesktop,
  onOpenSidebarMobile,
}) => {
  const { language, t } = useTranslation();
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(6);
  const [difficulty, setDifficulty] = useState(FOCUS_LEVELS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [drillTitle, setDrillTitle] = useState('');
  const [drillSubject, setDrillSubject] = useState('');
  const [statements, setStatements] = useState<TrueFalseStatement[]>([]);
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [savedScore, setSavedScore] = useState(false);

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
        statements?: TrueFalseStatement[];
      }>('/api/generate/true-false', {
        topic: trimmed,
        count,
        difficulty,
        profile,
        language,
      });

      if (!Array.isArray(data.statements) || data.statements.length === 0) {
        throw new Error('No statements were returned. Please try again.');
      }

      setDrillTitle(data.title || trimmed.slice(0, 48));
      setDrillSubject(data.subject || 'Clinical Pharmacology');
      setStatements(data.statements);
      setResponses({});
      setSavedScore(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to generate True/False drill.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (id: string, choice: boolean) => {
    if (responses[id] !== undefined) return;
    setResponses((prev) => ({ ...prev, [id]: choice }));
  };

  const answeredCount = statements.filter((s) => responses[s.id] !== undefined).length;
  const correctCount = statements.filter((s) => responses[s.id] === s.isTrue).length;

  const handleSaveSession = () => {
    if (statements.length === 0 || savedScore) return;
    setSavedScore(true);
    onRecordAttempt(
      {
        id: `att-${Date.now()}`,
        mode: 'truefalse',
        title: drillTitle || 'True/False Clinical Drill',
        subject: drillSubject || 'Clinical Safety',
        score: correctCount,
        total: statements.length,
        createdAt: new Date().toISOString(),
      },
      Math.max(4, Math.round(statements.length * 1.5))
    );
  };

  const handleRetake = () => {
    setResponses({});
    setSavedScore(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      <WorkspaceHeader
        title={t.truefalse.title}
        subtitle={t.truefalse.subtitle}
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
                {t.truefalse.builderKicker}
              </p>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                {t.truefalse.builderTitle}
              </h2>
            </div>

            <div>
              <label
                htmlFor="tf-topic"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.truefalse.topicLabel}
              </label>
              <textarea
                id="tf-topic"
                rows={4}
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t.truefalse.topicPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {t.truefalse.presets.map((preset) => (
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
                  htmlFor="tf-count"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  {t.truefalse.statementsLabel}
                </label>
                <select
                  id="tf-count"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 font-mono text-xs tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                >
                  {[5, 6, 10, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} {t.truefalse.statementsUnit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="tf-focus"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  {t.truefalse.focusLabel}
                </label>
                <select
                  id="tf-focus"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                >
                  {FOCUS_LEVELS.map((f, idx) => (
                    <option key={f} value={f}>
                      {t.truefalse.focusLevels[idx] ?? f}
                    </option>
                  ))}
                </select>
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
                  <span>{t.truefalse.generatingBtn}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.truefalse.generateBtn}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Interactive Statements */}
        <div className="lg:col-span-8 space-y-5">
          {statements.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-center">
              <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 mb-1">
                {t.truefalse.emptyTitle}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {t.truefalse.emptySub}
              </p>
            </div>
          ) : (
            <>
              <div className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                    {drillSubject}
                  </p>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
                    {drillTitle}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                    {interpolate(t.truefalse.answeredCorrect, {
                      answered: answeredCount,
                      total: statements.length,
                      correct: correctCount,
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-600 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.common.reset}</span>
                  </button>
                  <button
                    type="button"
                    disabled={answeredCount < statements.length || savedScore}
                    onClick={handleSaveSession}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {savedScore ? t.truefalse.savedToProgress : t.truefalse.saveDrillScore}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {statements.map((item, idx) => {
                  const chosen = responses[item.id];
                  const answered = chosen !== undefined;
                  const isRight = chosen === item.isTrue;
                  const trueOrFalseText = item.isTrue
                    ? t.truefalse.trueLabel
                    : t.truefalse.falseLabel;

                  return (
                    <article
                      key={item.id}
                      className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                          {interpolate(t.truefalse.statementOf, {
                            current: idx + 1,
                            total: statements.length,
                          })}
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
                                  {t.truefalse.correct} ({trueOrFalseText})
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                <span>
                                  {t.truefalse.incorrect} ({t.truefalse.actually} {trueOrFalseText})
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
                              onClick={() => handleAnswer(item.id, val)}
                              className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-colors cursor-pointer disabled:cursor-default ${cls}`}
                            >
                              {val ? t.truefalse.trueLabel : t.truefalse.falseLabel}
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
                            {t.truefalse.keyRulePrefix} {item.keyTakeaway}
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
