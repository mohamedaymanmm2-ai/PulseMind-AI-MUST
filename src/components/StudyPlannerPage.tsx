import React, { useEffect, useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Clock,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import {
  StudyTask,
  StudyTaskCategory,
  StudyTaskPriority,
} from '../types';
import { formatShortDate, getTodayIso } from '../utils/academicMath';
import { useTranslation } from '../i18n/LanguageContext';
import { interpolate } from '../i18n/translations';
import { WorkspaceHeader } from './WorkspaceHeader';

interface StudyPlannerPageProps {
  tasks: StudyTask[];
  onAddTask: (task: Omit<StudyTask, 'id' | 'completed'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onLogStudyMinutes: (minutes: number, subject: string, source: 'planner' | 'timer') => void;
  isSidebarOpenDesktop: boolean;
  onOpenSidebarDesktop: () => void;
  onOpenSidebarMobile: () => void;
}

const CATEGORIES: StudyTaskCategory[] = [
  'Lecture Review',
  'Clinical Prep',
  'Exam Practice',
  'Lab / OSCE',
  'Assignment',
];

const PRIORITIES: StudyTaskPriority[] = ['High', 'Medium', 'Low'];

const SUBJECT_PRESETS = [
  'Pharmacology',
  'Medical-Surgical',
  'Maternal & Newborn',
  'Pediatrics',
  'Critical Care',
  'Dosage Math',
  'OSCE & Skills',
];

export const StudyPlannerPage: React.FC<StudyPlannerPageProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onLogStudyMinutes,
  isSidebarOpenDesktop,
  onOpenSidebarDesktop,
  onOpenSidebarMobile,
}) => {
  const { t, language } = useTranslation();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Pharmacology');
  const [category, setCategory] = useState<StudyTaskCategory>('Lecture Review');
  const [priority, setPriority] = useState<StudyTaskPriority>('High');
  const [dueDate, setDueDate] = useState(getTodayIso());
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [notes, setNotes] = useState('');

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');

  // Integrated Clinical Focus Timer
  const [timerPresetMinutes, setTimerPresetMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSubject, setTimerSubject] = useState('Pharmacology');
  const [timerNoticeData, setTimerNoticeData] = useState<{ mins: number; subject: string } | null>(
    null
  );

  const translateSubject = (sub: string) => {
    const idx = SUBJECT_PRESETS.indexOf(sub);
    return idx >= 0 ? (t.planner.subjects[idx] ?? sub) : sub;
  };

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          onLogStudyMinutes(timerPresetMinutes, timerSubject, 'timer');
          setTimerNoticeData({ mins: timerPresetMinutes, subject: timerSubject });
          return timerPresetMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerPresetMinutes, timerSubject, onLogStudyMinutes]);

  const handleSelectTimerPreset = (mins: number) => {
    setTimerRunning(false);
    setTimerPresetMinutes(mins);
    setSecondsRemaining(mins * 60);
    setTimerNoticeData(null);
  };

  const handleLogElapsedNow = () => {
    const elapsedSeconds = timerPresetMinutes * 60 - secondsRemaining;
    const elapsedMinutes = Math.max(5, Math.round(elapsedSeconds / 60));
    onLogStudyMinutes(elapsedMinutes, timerSubject, 'timer');
    setTimerRunning(false);
    setSecondsRemaining(timerPresetMinutes * 60);
    setTimerNoticeData({ mins: elapsedMinutes, subject: timerSubject });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAddTask({
      title: trimmed,
      subject,
      category,
      priority,
      dueDate: dueDate || getTodayIso(),
      durationMinutes: Math.max(10, Math.min(240, durationMinutes)),
      notes: notes.trim() || undefined,
    });
    setTitle('');
    setNotes('');
  };

  const todayIso = getTodayIso();
  const uniqueSubjects = ['All', ...Array.from(new Set(tasks.map((task) => task.subject)))];

  const filteredTasks = tasks
    .filter((task) => {
      if (statusFilter === 'pending' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;
      if (subjectFilter !== 'All' && task.subject !== subjectFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return a.dueDate.localeCompare(b.dueDate);
    });

  const pendingMinutes = tasks
    .filter((task) => !task.completed)
    .reduce((sum, task) => sum + task.durationMinutes, 0);
  const completedCount = tasks.filter((task) => task.completed).length;

  const minsDisplay = String(Math.floor(secondsRemaining / 60)).padStart(2, '0');
  const secsDisplay = String(secondsRemaining % 60).padStart(2, '0');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      <WorkspaceHeader
        title={t.planner.title}
        subtitle={t.planner.subtitle}
        isSidebarOpenDesktop={isSidebarOpenDesktop}
        onOpenSidebarDesktop={onOpenSidebarDesktop}
        onOpenSidebarMobile={onOpenSidebarMobile}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: New Task Form + Focus Timer */}
        <div className="lg:col-span-5 space-y-6">
          {/* Add Study Task */}
          <form
            onSubmit={handleCreateTask}
            className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <div>
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                {t.planner.addKicker}
              </p>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                {t.planner.addTitle}
              </h2>
            </div>

            <div>
              <label
                htmlFor="planner-title"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.planner.taskTitleLabel}
              </label>
              <input
                id="planner-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.planner.taskTitlePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="planner-subject"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  {t.planner.subjectLabel}
                </label>
                <select
                  id="planner-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                >
                  {SUBJECT_PRESETS.map((sub, idx) => (
                    <option key={sub} value={sub}>
                      {t.planner.subjects[idx] ?? sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="planner-category"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  {t.planner.studyTypeLabel}
                </label>
                <select
                  id="planner-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as StudyTaskCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {t.planner.categories[cat]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="planner-date"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  {t.planner.targetDateLabel}
                </label>
                <input
                  id="planner-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label
                  htmlFor="planner-duration"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  {t.planner.minutesLabel}
                </label>
                <input
                  id="planner-duration"
                  type="number"
                  min={10}
                  max={240}
                  step={5}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value) || 30)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label
                  htmlFor="planner-priority"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  {t.planner.priorityLabel}
                </label>
                <select
                  id="planner-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as StudyTaskPriority)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {t.planner.priorities[p]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="planner-notes"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.planner.notesLabel}
              </label>
              <input
                id="planner-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.planner.notesPlaceholder}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.planner.addToPlanBtn}</span>
            </button>
          </form>

          {/* Clinical Focus Timer */}
          <section className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                  {t.planner.timerKicker}
                </p>
                <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                  {t.planner.timerTitle}
                </h2>
              </div>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-center justify-between gap-3 py-2">
              <span
                dir="ltr"
                className="font-mono text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums"
              >
                {minsDisplay}:{secsDisplay}
              </span>

              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                {[25, 45, 60].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectTimerPreset(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono tabular-nums font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      timerPresetMinutes === preset
                        ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {preset}{language === 'ar' ? ` ${t.common.min}` : 'm'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="timer-subject"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.planner.sessionSubjectLabel}
              </label>
              <select
                id="timer-subject"
                value={timerSubject}
                onChange={(e) => setTimerSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              >
                {SUBJECT_PRESETS.map((sub, idx) => (
                  <option key={sub} value={sub}>
                    {t.planner.subjects[idx] ?? sub}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setTimerNoticeData(null);
                  setTimerRunning((prev) => !prev);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors whitespace-nowrap cursor-pointer"
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{timerRunning ? t.planner.pause : t.planner.startSession}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setSecondsRemaining(timerPresetMinutes * 60);
                }}
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label={t.planner.resetTimer}
                title={t.planner.resetTimer}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleLogElapsedNow}
                className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-600 dark:hover:border-blue-500 transition-colors whitespace-nowrap cursor-pointer"
              >
                {t.planner.logTime}
              </button>
            </div>

            {timerNoticeData && (
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {interpolate(t.planner.loggedNotice, {
                  mins: timerNoticeData.mins,
                  subject: translateSubject(timerNoticeData.subject),
                })}
              </p>
            )}
          </section>
        </div>

        {/* Right Column: Task List & Filters */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
                  {t.planner.scheduleTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                  {interpolate(t.planner.scheduleSummary, {
                    done: completedCount,
                    total: tasks.length,
                    mins: pendingMinutes,
                  })}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                  {(['all', 'pending', 'completed'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        statusFilter === status
                          ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {t.common[status]}
                    </button>
                  ))}
                </div>

                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  aria-label={t.planner.subjectLabel}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-600"
                >
                  {uniqueSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub === 'All' ? t.planner.allSubjects : translateSubject(sub)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center">
                <CalendarCheck className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  {t.planner.noMatchingTasks}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.planner.noMatchingTasksSub}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredTasks.map((task) => {
                  const isOverdue = !task.completed && task.dueDate < todayIso;
                  const isDueToday = !task.completed && task.dueDate === todayIso;
                  return (
                    <div
                      key={task.id}
                      className="py-4 flex items-start justify-between gap-3.5"
                    >
                      <button
                        type="button"
                        onClick={() => onToggleTask(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors shrink-0 cursor-pointer"
                        aria-label={task.title}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-semibold ${
                            task.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {task.title}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{translateSubject(task.subject)}</span>
                          <span aria-hidden="true">·</span>
                          <span>{t.planner.categories[task.category]}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {task.durationMinutes} {t.common.min}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={
                              task.priority === 'High' && !task.completed
                                ? 'text-amber-700 dark:text-amber-400 font-medium'
                                : ''
                            }
                          >
                            {t.planner.priorities[task.priority]} {t.planner.priorityWord}
                          </span>
                        </div>

                        {task.notes && (
                          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {task.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-xs font-mono tabular-nums whitespace-nowrap ${
                            task.completed
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : isOverdue
                                ? 'text-red-600 dark:text-red-400 font-semibold'
                                : isDueToday
                                  ? 'text-blue-700 dark:text-blue-400 font-semibold'
                                  : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {task.completed
                            ? t.common.completed
                            : isOverdue
                              ? `${t.common.overdue} (${formatShortDate(task.dueDate, language)})`
                              : isDueToday
                                ? t.common.today
                                : formatShortDate(task.dueDate, language)}
                        </span>

                        <button
                          type="button"
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                          aria-label={`${t.common.delete} ${task.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
