import React, { useState } from 'react';
import { Calculator, Plus, RotateCcw, Trash2 } from 'lucide-react';
import {
  DEFAULT_GPA_STATE,
  GpaCourse,
  GpaState,
  GradeLetter,
  MUST_GRADE_POINTS,
} from '../types';
import { calculateGpaMetrics } from '../utils/academicMath';
import { useTranslation } from '../i18n/LanguageContext';
import { interpolate, translateStandingLabel } from '../i18n/translations';
import { WorkspaceHeader } from './WorkspaceHeader';

interface GpaCalculatorPageProps {
  gpaState: GpaState;
  onUpdateGpaState: (next: GpaState) => void;
  isSidebarOpenDesktop: boolean;
  onOpenSidebarDesktop: () => void;
  onOpenSidebarMobile: () => void;
}

const GRADE_OPTIONS = Object.keys(MUST_GRADE_POINTS) as GradeLetter[];

export const GpaCalculatorPage: React.FC<GpaCalculatorPageProps> = ({
  gpaState,
  onUpdateGpaState,
  isSidebarOpenDesktop,
  onOpenSidebarDesktop,
  onOpenSidebarMobile,
}) => {
  const { t } = useTranslation();
  const [showScaleTable, setShowScaleTable] = useState(false);

  const metrics = calculateGpaMetrics(gpaState);

  const handleAddCourse = () => {
    const newCourse: GpaCourse = {
      id: `course-${Date.now()}`,
      code: `NUR ${310 + gpaState.courses.length}`,
      name: '',
      credits: 3,
      grade: 'A-',
    };
    onUpdateGpaState({
      ...gpaState,
      courses: [...gpaState.courses, newCourse],
    });
  };

  const handleUpdateCourse = (id: string, patch: Partial<GpaCourse>) => {
    onUpdateGpaState({
      ...gpaState,
      courses: gpaState.courses.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  };

  const handleRemoveCourse = (id: string) => {
    onUpdateGpaState({
      ...gpaState,
      courses: gpaState.courses.filter((c) => c.id !== id),
    });
  };

  const handleReset = () => {
    onUpdateGpaState(DEFAULT_GPA_STATE);
  };

  const standingToneClasses = {
    emerald: 'text-emerald-700 dark:text-emerald-400',
    blue: 'text-blue-700 dark:text-blue-400',
    amber: 'text-amber-700 dark:text-amber-400',
    red: 'text-red-600 dark:text-red-400',
  }[metrics.standingTone];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      <WorkspaceHeader
        title={t.gpa.title}
        subtitle={t.gpa.subtitle}
        isSidebarOpenDesktop={isSidebarOpenDesktop}
        onOpenSidebarDesktop={onOpenSidebarDesktop}
        onOpenSidebarMobile={onOpenSidebarMobile}
        rightAction={
          <button
            type="button"
            onClick={() => setShowScaleTable((prev) => !prev)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {showScaleTable ? t.gpa.hideScale : t.gpa.viewScale}
          </button>
        }
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Top Summary KPI Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {t.gpa.semesterGpa}
            </p>
            <p className="font-mono text-3xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
              {metrics.semesterGpa.toFixed(2)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 tabular-nums">
              {interpolate(t.gpa.ptsCredits, {
                pts: metrics.semesterQualityPoints.toFixed(1),
                credits: metrics.semesterCredits,
              })}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {t.gpa.projectedCgpa}
            </p>
            <p className="font-mono text-3xl font-bold text-blue-700 dark:text-blue-400 tabular-nums">
              {metrics.cumulativeGpa.toFixed(2)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 tabular-nums">
              {interpolate(t.gpa.totalCredits, { credits: metrics.cumulativeCredits })}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {t.gpa.academicStanding}
            </p>
            <p className={`font-display text-xl font-bold ${standingToneClasses}`}>
              {translateStandingLabel(metrics.standingLabel, t)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {t.gpa.facultyBenchmark}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {t.gpa.targetForecast}
            </p>
            <p className="font-mono text-xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
              {metrics.requiredFutureGpaForTarget === null
                ? '—'
                : metrics.requiredFutureGpaForTarget > 4.0
                  ? '> 4.00'
                  : metrics.requiredFutureGpaForTarget <= 0
                    ? t.gpa.achieved
                    : `${metrics.requiredFutureGpaForTarget.toFixed(2)} ${t.gpa.reqSuffix}`}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 tabular-nums">
              {interpolate(t.gpa.next15Cr, { target: gpaState.targetCgpa.toFixed(2) })}
            </p>
          </div>
        </section>

        {/* Optional MUST Grade Scale Reference */}
        {showScaleTable && (
          <section className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                  {t.gpa.scaleTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.gpa.scaleSubtitle}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {GRADE_OPTIONS.map((letter) => (
                <div
                  key={letter}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p dir="ltr" className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                      {letter}
                    </p>
                    <p dir="ltr" className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      {MUST_GRADE_POINTS[letter].minPercent}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                    {MUST_GRADE_POINTS[letter].points.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Prior Standing & Target Settings */}
        <section className="p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
          <div className="mb-4">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
              {t.gpa.priorKicker}
            </p>
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
              {t.gpa.priorTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="gpa-semester-label"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.gpa.semesterLabel}
              </label>
              <input
                id="gpa-semester-label"
                type="text"
                value={gpaState.semesterLabel}
                onChange={(e) =>
                  onUpdateGpaState({ ...gpaState, semesterLabel: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="gpa-prior-credits"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.gpa.priorCreditsLabel}
              </label>
              <input
                id="gpa-prior-credits"
                type="number"
                min={0}
                max={220}
                step={1}
                value={gpaState.priorCredits}
                onChange={(e) =>
                  onUpdateGpaState({
                    ...gpaState,
                    priorCredits: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="gpa-prior-cgpa"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.gpa.priorCgpaLabel}
              </label>
              <input
                id="gpa-prior-cgpa"
                type="number"
                min={0}
                max={4}
                step={0.01}
                value={gpaState.priorCgpa}
                onChange={(e) =>
                  onUpdateGpaState({
                    ...gpaState,
                    priorCgpa: Math.max(0, Math.min(4, Number(e.target.value) || 0)),
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="gpa-target-cgpa"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.gpa.targetCgpaLabel}
              </label>
              <input
                id="gpa-target-cgpa"
                type="number"
                min={0}
                max={4}
                step={0.01}
                value={gpaState.targetCgpa}
                onChange={(e) =>
                  onUpdateGpaState({
                    ...gpaState,
                    targetCgpa: Math.max(0, Math.min(4, Number(e.target.value) || 0)),
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Coursework Table */}
        <section className="rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                {t.gpa.coursesKicker}
              </p>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                {gpaState.semesterLabel || t.gpa.currentSemesterFallback}
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.gpa.resetSample}</span>
              </button>
              <button
                type="button"
                onClick={handleAddCourse}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.gpa.addCourse}</span>
              </button>
            </div>
          </div>

          {gpaState.courses.length === 0 ? (
            <div className="p-10 text-center">
              <Calculator className="w-7 h-7 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                {t.gpa.noCoursesTitle}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                {t.gpa.noCoursesSub}
              </p>
              <button
                type="button"
                onClick={handleAddCourse}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.gpa.addFirstCourse}</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-[#0F172A]/60">
                    <th className="py-3 px-4">{t.gpa.colCode}</th>
                    <th className="py-3 px-4">{t.gpa.colTitle}</th>
                    <th className="py-3 px-4 text-end">{t.gpa.colCredits}</th>
                    <th className="py-3 px-4">{t.gpa.colGrade}</th>
                    <th className="py-3 px-4 text-end">{t.gpa.colQualityPts}</th>
                    <th className="py-3 px-4 text-end">{t.gpa.colAction}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                  {gpaState.courses.map((course) => {
                    const gradePoints = MUST_GRADE_POINTS[course.grade]?.points ?? 0;
                    const rowQualityPts = course.credits * gradePoints;
                    return (
                      <tr
                        key={course.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-2.5 px-4 w-32">
                          <input
                            type="text"
                            dir="ltr"
                            value={course.code}
                            onChange={(e) =>
                              handleUpdateCourse(course.id, { code: e.target.value })
                            }
                            aria-label={t.gpa.colCode}
                            placeholder="NUR 301"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="py-2.5 px-4 min-w-[210px]">
                          <input
                            type="text"
                            value={course.name}
                            onChange={(e) =>
                              handleUpdateCourse(course.id, { name: e.target.value })
                            }
                            aria-label={t.gpa.colTitle}
                            placeholder={t.gpa.courseTitlePlaceholder}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="py-2.5 px-4 w-24 text-end">
                          <select
                            value={course.credits}
                            onChange={(e) =>
                              handleUpdateCourse(course.id, {
                                credits: Number(e.target.value),
                              })
                            }
                            aria-label={t.gpa.colCredits}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 font-mono text-xs tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          >
                            {[1, 2, 3, 4, 5, 6].map((cr) => (
                              <option key={cr} value={cr}>
                                {cr} {t.gpa.crUnit}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-4 w-36">
                          <select
                            dir="ltr"
                            value={course.grade}
                            onChange={(e) =>
                              handleUpdateCourse(course.id, {
                                grade: e.target.value as GradeLetter,
                              })
                            }
                            aria-label={t.gpa.colGrade}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 font-mono text-xs tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          >
                            {GRADE_OPTIONS.map((g) => (
                              <option key={g} value={g}>
                                {g} ({MUST_GRADE_POINTS[g].points.toFixed(1)})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-4 text-end font-mono text-xs font-semibold tabular-nums text-slate-800 dark:text-slate-200">
                          {rowQualityPts.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-4 text-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveCourse(course.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            aria-label={`${t.common.delete} ${course.name || course.code}`}
                            title={t.common.delete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
