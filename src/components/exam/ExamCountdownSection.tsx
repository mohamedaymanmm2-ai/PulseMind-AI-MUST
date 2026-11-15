import React, { useEffect, useState } from 'react';
import {
  CalendarClock,
  Flame,
  Loader2,
  Plus,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { ExamType, UpcomingExam } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';
import { interpolate } from '../../i18n/translations';

interface ExamCountdownSectionProps {
  exams: UpcomingExam[];
  selectedExamId: string;
  onSelectExam: (id: string) => void;
  onAddExam: (exam: Omit<UpcomingExam, 'id'>) => void;
  onDeleteExam: (id: string) => void;
  isExamTomorrowMode: boolean;
  onToggleExamTomorrowMode: (enabled: boolean) => void;
  sprintTopic: string;
  onChangeSprintTopic: (val: string) => void;
  onGeneratePack: (topicOverride?: string, forceTomorrow?: boolean) => void;
  isGenerating: boolean;
  error: string | null;
}

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalHours: number;
  isPast: boolean;
}

function computeRemaining(examDateIso: string, nowMs: number): TimeParts {
  const targetMs = new Date(examDateIso).getTime();
  if (Number.isNaN(targetMs)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalHours: 0, isPast: true };
  }
  const diffMs = targetMs - nowMs;
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalHours: 0, isPast: true };
  }
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    days,
    hours,
    minutes,
    seconds,
    totalHours: Math.round(diffMs / 3600000),
    isPast: false,
  };
}

const EXAM_TYPES: ExamType[] = ['Midterm', 'Final', 'OSCE', 'Clinical Quiz'];

export const ExamCountdownSection: React.FC<ExamCountdownSectionProps> = ({
  exams,
  selectedExamId,
  onSelectExam,
  onAddExam,
  onDeleteExam,
  isExamTomorrowMode,
  onToggleExamTomorrowMode,
  sprintTopic,
  onChangeSprintTopic,
  onGeneratePack,
  isGenerating,
  error,
}) => {
  const { t } = useTranslation();
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [showAddForm, setShowAddForm] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('NUR 304');
  const [newSubject, setNewSubject] = useState('Pharmacology');
  const [newType, setNewType] = useState<ExamType>('Midterm');
  const [newDate, setNewDate] = useState(() => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T09:00`;
  });
  const [newTargetScore, setNewTargetScore] = useState(85);
  const [newTopics, setNewTopics] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const selectedExam = exams.find((e) => e.id === selectedExamId) ?? exams[0] ?? null;
  const countdown = selectedExam
    ? computeRemaining(selectedExam.examDateIso, nowMs)
    : { days: 0, hours: 0, minutes: 0, seconds: 0, totalHours: 0, isPast: true };

  const isUrgentCountdown = !countdown.isPast && countdown.totalHours <= 36;

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTopics.trim()) return;
    onAddExam({
      title: newTitle.trim(),
      courseCode: newCourse.trim() || 'NUR 300',
      subject: newSubject.trim() || 'Clinical Nursing',
      examType: newType,
      examDateIso: newDate,
      targetScore: Math.max(50, Math.min(100, Number(newTargetScore) || 85)),
      topics: newTopics.trim(),
    });
    setNewTitle('');
    setNewTopics('');
    setShowAddForm(false);
  };

  const pad2 = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="space-y-6">
      {/* Exam Mode Header & Mode Switcher */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
              {t.exam.commandCenterKicker}
            </p>
            <h2
              className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
              style={{ textWrap: 'balance' }}
            >
              {isExamTomorrowMode ? t.exam.commandTitleTomorrow : t.exam.commandTitleStandard}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              {isExamTomorrowMode ? t.exam.commandDescTomorrow : t.exam.commandDescStandard}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => onToggleExamTomorrowMode(true)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  isExamTomorrowMode
                    ? 'bg-blue-700 text-white shadow-xs dark:bg-blue-600'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{t.exam.modeTomorrow}</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleExamTomorrowMode(false)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  !isExamTomorrowMode
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {t.exam.modeStandard}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1120] hover:border-blue-600 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{showAddForm ? t.exam.closeForm : t.exam.addExam}</span>
            </button>
          </div>
        </div>

        {/* Add New Exam Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreateExam}
            className="p-5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                {t.exam.scheduleFormTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.exam.examTitleLabel}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={t.exam.examTitlePlaceholder}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.exam.courseCodeLabel}
                </label>
                <input
                  type="text"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  placeholder="NUR 304"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.exam.subjectDomainLabel}
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Pharmacology"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.exam.examDateTimeLabel}
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.exam.formatLabel}
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as ExamType)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                >
                  {EXAM_TYPES.map((typeVal) => (
                    <option key={typeVal} value={typeVal}>
                      {t.exam.examTypes[typeVal]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.exam.targetScoreLabel}
                </label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={newTargetScore}
                  onChange={(e) => setNewTargetScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.exam.syllabusLabel}
                </label>
                <input
                  type="text"
                  required
                  value={newTopics}
                  onChange={(e) => setNewTopics(e.target.value)}
                  placeholder={t.exam.syllabusPlaceholder}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer"
              >
                {t.exam.saveCountdownBtn}
              </button>
            </div>
          </form>
        )}

        {/* Two-Column Split: Live Countdown & Exam Selector + Rapid Sprint Generator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Live Exam Countdown & Upcoming Exams */}
          <div className="lg:col-span-6 p-5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {t.exam.examCountdownLabel}
                  </span>
                </div>
                {selectedExam && (
                  <span
                    className={`text-xs font-medium tabular-nums ${
                      isUrgentCountdown
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {countdown.isPast
                      ? t.exam.windowReached
                      : isUrgentCountdown
                        ? interpolate(t.exam.tomorrowWindowLeft, { hours: countdown.totalHours })
                        : interpolate(t.exam.daysRemaining, { days: countdown.days })}
                  </span>
                )}
              </div>

              {selectedExam ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedExam.courseCode} · {selectedExam.subject} ·{' '}
                        {t.exam.examTypes[selectedExam.examType]} · {t.exam.targetLabel}{' '}
                        {selectedExam.targetScore}%
                      </p>
                      {exams.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteExam(selectedExam.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                          title={t.common.delete}
                          aria-label={`${t.common.delete} ${selectedExam.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-50 mt-1">
                      {selectedExam.title}
                    </h3>
                  </div>

                  {/* Live Digital Countdown Strip */}
                  <div className="grid grid-cols-4 gap-2.5 mb-4">
                    {[
                      { label: t.exam.daysUnit, value: pad2(countdown.days) },
                      { label: t.exam.hoursUnit, value: pad2(countdown.hours) },
                      { label: t.exam.minsUnit, value: pad2(countdown.minutes) },
                      { label: t.exam.secsUnit, value: pad2(countdown.seconds) },
                    ].map((unit) => (
                      <div
                        key={unit.label}
                        className="p-3 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-center"
                      >
                        <p className="font-mono text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                          {unit.value}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {unit.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 flex-1">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {t.exam.topicsPrefix}{' '}
                      </span>
                      {selectedExam.topics}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onToggleExamTomorrowMode(true);
                        onChangeSprintTopic(selectedExam.topics);
                        onGeneratePack(selectedExam.topics, true);
                      }}
                      disabled={isGenerating}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>{t.exam.cramThisExam}</span>
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.exam.emptyExams}
                </p>
              )}
            </div>

            {/* Upcoming Exam Selector Tabs */}
            {exams.length > 0 && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {t.exam.upcomingExamsLabel}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {exams.map((ex) => {
                    const isActive = selectedExam?.id === ex.id;
                    const rem = computeRemaining(ex.examDateIso, nowMs);
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => {
                          onSelectExam(ex.id);
                          onChangeSprintTopic(ex.topics);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-start cursor-pointer ${
                          isActive
                            ? 'bg-white dark:bg-[#131C31] text-blue-700 dark:text-blue-400 border border-blue-600/60 dark:border-blue-500/60'
                            : 'bg-white/60 dark:bg-[#131C31]/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <span>{ex.courseCode}</span>
                        <span className="mx-1.5 text-slate-400" aria-hidden="true">
                          ·
                        </span>
                        <span className="font-mono tabular-nums">
                          {rem.isPast
                            ? t.exam.nowLabel
                            : rem.days > 0
                              ? `${rem.days}${t.exam.dayShort}`
                              : `${rem.hours}${t.exam.hourShort}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Exam Tomorrow Pack Generator */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onGeneratePack();
            }}
            className="lg:col-span-6 p-5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="exam-sprint-topic"
                  className="text-xs font-semibold text-slate-900 dark:text-slate-100"
                >
                  {isExamTomorrowMode
                    ? t.exam.genPackTitleTomorrow
                    : t.exam.genPackTitleStandard}
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.exam.genPackMeta}
                </span>
              </div>

              <textarea
                id="exam-sprint-topic"
                rows={3}
                required
                value={sprintTopic}
                onChange={(e) => onChangeSprintTopic(e.target.value)}
                placeholder={t.exam.genPackPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 resize-none"
              />

              <div className="flex flex-wrap gap-1.5">
                {t.exam.presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onChangeSprintTopic(preset)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300 transition-colors text-start cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.exam.genPackHelper}
              </p>
              <button
                type="submit"
                disabled={!sprintTopic.trim() || isGenerating}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.exam.buildingPack}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>
                      {isExamTomorrowMode
                        ? t.exam.generateTomorrowKit
                        : t.exam.buildStudyPack}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
