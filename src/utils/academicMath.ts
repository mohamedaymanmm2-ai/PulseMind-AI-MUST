import { GpaState, MUST_GRADE_POINTS } from '../types';

export interface GpaMetrics {
  semesterCredits: number;
  semesterQualityPoints: number;
  semesterGpa: number;
  cumulativeCredits: number;
  cumulativeGpa: number;
  standingLabel: string;
  standingTone: 'emerald' | 'blue' | 'amber' | 'red';
  requiredFutureGpaForTarget: number | null;
}

export function calculateGpaMetrics(gpaState: GpaState): GpaMetrics {
  const semesterCredits = gpaState.courses.reduce(
    (sum, course) => sum + (Number.isFinite(course.credits) && course.credits > 0 ? course.credits : 0),
    0
  );

  const semesterQualityPoints = gpaState.courses.reduce((sum, course) => {
    const credits = Number.isFinite(course.credits) && course.credits > 0 ? course.credits : 0;
    const pts = MUST_GRADE_POINTS[course.grade]?.points ?? 0;
    return sum + credits * pts;
  }, 0);

  const semesterGpa = semesterCredits > 0 ? semesterQualityPoints / semesterCredits : 0;

  const priorCredits = Math.max(0, Number(gpaState.priorCredits) || 0);
  const priorCgpa = Math.max(0, Math.min(4.0, Number(gpaState.priorCgpa) || 0));
  const priorQualityPoints = priorCredits * priorCgpa;

  const cumulativeCredits = priorCredits + semesterCredits;
  const cumulativeGpa =
    cumulativeCredits > 0 ? (priorQualityPoints + semesterQualityPoints) / cumulativeCredits : 0;

  let standingLabel = 'Good Standing';
  let standingTone: GpaMetrics['standingTone'] = 'blue';

  if (cumulativeCredits === 0 && semesterCredits === 0) {
    standingLabel = 'No Credits Entered';
    standingTone = 'blue';
  } else if (cumulativeGpa >= 3.7) {
    standingLabel = "Dean's Honors";
    standingTone = 'emerald';
  } else if (cumulativeGpa >= 3.0) {
    standingLabel = 'Good Standing';
    standingTone = 'blue';
  } else if (cumulativeGpa >= 2.0) {
    standingLabel = 'Satisfactory';
    standingTone = 'amber';
  } else {
    standingLabel = 'Academic Warning';
    standingTone = 'red';
  }

  // What GPA is needed over the next 15 credits (standard semester) to reach targetCgpa?
  const target = Math.max(0, Math.min(4.0, Number(gpaState.targetCgpa) || 0));
  let requiredFutureGpaForTarget: number | null = null;
  if (target > 0 && cumulativeCredits > 0) {
    const nextCredits = 15;
    const currentPoints = priorQualityPoints + semesterQualityPoints;
    const needed = (target * (cumulativeCredits + nextCredits) - currentPoints) / nextCredits;
    requiredFutureGpaForTarget = needed;
  }

  return {
    semesterCredits,
    semesterQualityPoints,
    semesterGpa,
    cumulativeCredits,
    cumulativeGpa,
    standingLabel,
    standingTone,
    requiredFutureGpaForTarget,
  };
}

export function getTodayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatShortDate(isoDate: string, language: 'en' | 'ar' = 'en'): string {
  if (!isoDate) return '';
  const date = new Date(isoDate.length === 10 ? `${isoDate}T12:00:00` : isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
}
