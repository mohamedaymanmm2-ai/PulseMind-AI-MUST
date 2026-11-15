import React, { useState } from 'react';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  KeyRound,
  Layers,
  Zap,
} from 'lucide-react';
import {
  AssessmentAttempt,
  ExamTomorrowPack,
  FlashcardDeck,
  PersonalizedRecommendation,
  PersonalizedStudyPlan,
  SmartRevisionNote,
  StudySessionLog,
  StudyTask,
  UpcomingExam,
  UserProfile,
} from '../types';
import { WorkspaceHeader } from './WorkspaceHeader';
import { useTranslation } from '../i18n/LanguageContext';
import { interpolate } from '../i18n/translations';
import { postJsonWithRetry } from '../utils/apiFetch';
import { ExamCountdownSection } from './exam/ExamCountdownSection';
import {
  ExamMcqPracticeSection,
  ExamTrueFalsePracticeSection,
  HighYieldSummarySection,
  ImportantKeywordsSection,
  RapidRevisionCardsSection,
  SmartRevisionNotesSection,
} from './exam/ExamPracticePanels';
import { ExamAnalyticsSection } from './exam/ExamAnalyticsSection';

type ExamTab =
  | 'sprint'
  | 'summaries'
  | 'keywords'
  | 'mcq'
  | 'truefalse'
  | 'cards'
  | 'analytics';

interface ExamModePageProps {
  profile: UserProfile;
  exams: UpcomingExam[];
  onAddExam: (exam: Omit<UpcomingExam, 'id'>) => void;
  onDeleteExam: (id: string) => void;
  examPack: ExamTomorrowPack;
  onUpdateExamPack: (pack: ExamTomorrowPack) => void;
  studyPlan: PersonalizedStudyPlan | null;
  onUpdateStudyPlan: (plan: PersonalizedStudyPlan) => void;
  attempts: AssessmentAttempt[];
  decks: FlashcardDeck[];
  tasks: StudyTask[];
  sessionLogs: StudySessionLog[];
  onRecordAttempt: (attempt: AssessmentAttempt, studyMinutes: number) => void;
  onLogStudyMinutes: (minutes: number, subject: string, source: 'exam') => void;
  isSidebarOpenDesktop: boolean;
  onOpenSidebarDesktop: () => void;
  onOpenSidebarMobile: () => void;
}

export const ExamModePage: React.FC<ExamModePageProps> = ({
  profile,
  exams,
  onAddExam,
  onDeleteExam,
  examPack,
  onUpdateExamPack,
  studyPlan,
  onUpdateStudyPlan,
  attempts,
  decks,
  tasks,
  sessionLogs,
  onRecordAttempt,
  onLogStudyMinutes,
  isSidebarOpenDesktop,
  onOpenSidebarDesktop,
  onOpenSidebarMobile,
}) => {
  const { language, t } = useTranslation();
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id ?? '');
  const [isExamTomorrowMode, setIsExamTomorrowMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ExamTab>('sprint');
  const [sprintTopic, setSprintTopic] = useState<string>(
    exams[0]?.topics ?? examPack.topic
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const selectedExam = exams.find((e) => e.id === selectedExamId) ?? exams[0] ?? null;

  const handleToggleTomorrowMode = (enabled: boolean) => {
    setIsExamTomorrowMode(enabled);
    if (enabled) {
      setActiveTab('sprint');
    } else if (activeTab === 'sprint') {
      setActiveTab('summaries');
    }
  };

  const handleGeneratePack = async (topicOverride?: string, forceTomorrow?: boolean) => {
    const targetTopic = (topicOverride ?? sprintTopic).trim();
    if (!targetTopic || isGenerating) return;

    const tomorrowFlag = forceTomorrow ?? isExamTomorrowMode;
    setIsGenerating(true);
    setGenError(null);

    try {
      const data = await postJsonWithRetry<ExamTomorrowPack>(
        '/api/exam/tomorrow-pack',
        {
          topic: targetTopic,
          examType: selectedExam?.examType || 'Midterm / Clinical Exam',
          isExamTomorrow: tomorrowFlag,
          profile,
          language,
        },
        { timeoutMs: 40000, retries: 1 }
      );

      onUpdateExamPack(data);
      onLogStudyMinutes(10, data.subject || 'Exam Prep', 'exam');
      if (tomorrowFlag) {
        setActiveTab('sprint');
      }
    } catch (err: unknown) {
      setGenError(err instanceof Error ? err.message : 'Unable to generate Exam Pack.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleNoteReviewed = (noteId: string) => {
    onUpdateExamPack({
      ...examPack,
      smartNotes: examPack.smartNotes.map((n) =>
        n.id === noteId ? { ...n, reviewed: !n.reviewed } : n
      ),
    });
  };

  const handleAddCustomNote = (noteInput: Omit<SmartRevisionNote, 'id'>) => {
    const newNote: SmartRevisionNote = {
      ...noteInput,
      id: `sn-custom-${Date.now()}`,
    };
    onUpdateExamPack({
      ...examPack,
      smartNotes: [newNote, ...examPack.smartNotes],
    });
  };

  const handleToggleKeywordMastered = (keywordId: string) => {
    onUpdateExamPack({
      ...examPack,
      keywords: examPack.keywords.map((k) =>
        k.id === keywordId ? { ...k, mastered: !k.mastered } : k
      ),
    });
  };

  const handleToggleCardConfident = (cardId: string) => {
    onUpdateExamPack({
      ...examPack,
      revisionCards: examPack.revisionCards.map((c) =>
        c.id === cardId ? { ...c, confident: !c.confident } : c
      ),
    });
  };

  const handleLaunchRecommendation = (rec: PersonalizedRecommendation) => {
    setSprintTopic(rec.suggestedTopic);
    if (rec.actionType === 'exam_tomorrow') {
      setIsExamTomorrowMode(true);
      setActiveTab('sprint');
      void handleGeneratePack(rec.suggestedTopic, true);
      return;
    }
    if (rec.actionType === 'mcq') {
      setActiveTab('mcq');
      return;
    }
    if (rec.actionType === 'truefalse') {
      setActiveTab('truefalse');
      return;
    }
    if (rec.actionType === 'flashcards') {
      setActiveTab('cards');
      return;
    }
    setActiveTab('summaries');
  };

  const tabs: {
    id: ExamTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    ...(isExamTomorrowMode
      ? [{ id: 'sprint' as ExamTab, label: t.exam.tabs.sprint, icon: Zap }]
      : []),
    { id: 'summaries', label: t.exam.tabs.summaries, icon: BookOpen },
    { id: 'keywords', label: t.exam.tabs.keywords, icon: KeyRound },
    { id: 'mcq', label: t.exam.tabs.mcq, icon: ClipboardCheck },
    { id: 'truefalse', label: t.exam.tabs.truefalse, icon: CheckCircle2 },
    { id: 'cards', label: t.exam.tabs.cards, icon: Layers },
    { id: 'analytics', label: t.exam.tabs.analytics, icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      <WorkspaceHeader
        title={t.exam.title}
        subtitle={
          isExamTomorrowMode
            ? t.exam.subtitleTomorrow
            : `${examPack.subject} · ${t.exam.subtitleStandard}`
        }
        isSidebarOpenDesktop={isSidebarOpenDesktop}
        onOpenSidebarDesktop={onOpenSidebarDesktop}
        onOpenSidebarMobile={onOpenSidebarMobile}
        rightAction={
          <button
            type="button"
            onClick={() => handleToggleTomorrowMode(!isExamTomorrowMode)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isExamTomorrowMode
                ? 'bg-blue-700 text-white dark:bg-blue-600'
                : 'bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-600'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isExamTomorrowMode ? t.exam.tomorrowOn : t.exam.activateTomorrow}</span>
          </button>
        }
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Live Exam Countdown + Mode Toggle + Sprint Generator */}
        <ExamCountdownSection
          exams={exams}
          selectedExamId={selectedExamId}
          onSelectExam={setSelectedExamId}
          onAddExam={onAddExam}
          onDeleteExam={onDeleteExam}
          isExamTomorrowMode={isExamTomorrowMode}
          onToggleExamTomorrowMode={handleToggleTomorrowMode}
          sprintTopic={sprintTopic}
          onChangeSprintTopic={setSprintTopic}
          onGeneratePack={handleGeneratePack}
          isGenerating={isGenerating}
          error={genError}
        />

        {/* Segmented Tab Bar */}
        <nav
          aria-label="Exam Mode sections"
          className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
                  active
                    ? 'border-blue-700 dark:border-blue-400 text-blue-700 dark:text-blue-400 bg-white dark:bg-[#131C31]'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Active Exam Mode Content */}
        {activeTab === 'sprint' && (
          <div className="space-y-8">
            {/* Sprint Jump Overview Strip */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-0.5">
                  {t.exam.sprintActiveKicker}
                </p>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                  {examPack.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                  {interpolate(t.exam.sprintStats, {
                    kw: examPack.keywords.length,
                    mcq: examPack.mcqs.length,
                    tf: examPack.trueFalse.length,
                    rc: examPack.revisionCards.length,
                  })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <a
                  href="#sprint-summary"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
                >
                  {t.exam.jumpSummary}
                </a>
                <a
                  href="#sprint-keywords"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
                >
                  {t.exam.jumpKeywords}
                </a>
                <a
                  href="#sprint-mcqs"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
                >
                  {t.exam.jumpMcqs}
                </a>
                <a
                  href="#sprint-tf"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
                >
                  {t.exam.jumpTf}
                </a>
                <a
                  href="#sprint-cards"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
                >
                  {t.exam.jumpCards}
                </a>
              </div>
            </div>

            <div id="sprint-summary">
              <HighYieldSummarySection pack={examPack} />
            </div>

            <div id="sprint-keywords">
              <ImportantKeywordsSection
                keywords={examPack.keywords}
                onToggleKeywordMastered={handleToggleKeywordMastered}
              />
            </div>

            <div id="sprint-cards">
              <RapidRevisionCardsSection
                key={`cards-${examPack.id}`}
                cards={examPack.revisionCards}
                onToggleConfident={handleToggleCardConfident}
              />
            </div>

            <div id="sprint-mcqs">
              <ExamMcqPracticeSection
                key={`mcq-${examPack.id}`}
                title={examPack.title}
                subject={examPack.subject}
                questions={examPack.mcqs}
                onRecordAttempt={onRecordAttempt}
              />
            </div>

            <div id="sprint-tf">
              <ExamTrueFalsePracticeSection
                key={`tf-${examPack.id}`}
                title={examPack.title}
                subject={examPack.subject}
                statements={examPack.trueFalse}
                onRecordAttempt={onRecordAttempt}
              />
            </div>

            <SmartRevisionNotesSection
              notes={examPack.smartNotes}
              onToggleReviewed={handleToggleNoteReviewed}
              onAddCustomNote={handleAddCustomNote}
            />

            <ExamAnalyticsSection
              profile={profile}
              exams={exams}
              pack={examPack}
              attempts={attempts}
              decks={decks}
              tasks={tasks}
              sessionLogs={sessionLogs}
              studyPlan={studyPlan}
              onUpdateStudyPlan={onUpdateStudyPlan}
              onLaunchRecommendation={handleLaunchRecommendation}
            />
          </div>
        )}

        {activeTab === 'summaries' && (
          <div className="space-y-8">
            <HighYieldSummarySection pack={examPack} />
            <SmartRevisionNotesSection
              notes={examPack.smartNotes}
              onToggleReviewed={handleToggleNoteReviewed}
              onAddCustomNote={handleAddCustomNote}
            />
          </div>
        )}

        {activeTab === 'keywords' && (
          <ImportantKeywordsSection
            keywords={examPack.keywords}
            onToggleKeywordMastered={handleToggleKeywordMastered}
          />
        )}

        {activeTab === 'mcq' && (
          <ExamMcqPracticeSection
            key={`mcq-tab-${examPack.id}`}
            title={examPack.title}
            subject={examPack.subject}
            questions={examPack.mcqs}
            onRecordAttempt={onRecordAttempt}
          />
        )}

        {activeTab === 'truefalse' && (
          <ExamTrueFalsePracticeSection
            key={`tf-tab-${examPack.id}`}
            title={examPack.title}
            subject={examPack.subject}
            statements={examPack.trueFalse}
            onRecordAttempt={onRecordAttempt}
          />
        )}

        {activeTab === 'cards' && (
          <RapidRevisionCardsSection
            key={`cards-tab-${examPack.id}`}
            cards={examPack.revisionCards}
            onToggleConfident={handleToggleCardConfident}
          />
        )}

        {activeTab === 'analytics' && (
          <ExamAnalyticsSection
            profile={profile}
            exams={exams}
            pack={examPack}
            attempts={attempts}
            decks={decks}
            tasks={tasks}
            sessionLogs={sessionLogs}
            studyPlan={studyPlan}
            onUpdateStudyPlan={onUpdateStudyPlan}
            onLaunchRecommendation={handleLaunchRecommendation}
          />
        )}
      </main>
    </div>
  );
};
