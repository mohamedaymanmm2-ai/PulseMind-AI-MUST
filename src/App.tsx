import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AiConnectionStatus,
  AppSettings,
  AppView,
  AssessmentAttempt,
  ChatErrorCode,
  ChatMessage,
  Conversation,
  DEFAULT_EXAM_PACK,
  DEFAULT_FLASHCARD_DECKS,
  DEFAULT_GPA_STATE,
  DEFAULT_PROFILE,
  DEFAULT_SETTINGS,
  DEFAULT_STUDY_TASKS,
  DEFAULT_UPCOMING_EXAMS,
  ExamTomorrowPack,
  FlashcardDeck,
  GpaState,
  PersonalizedStudyPlan,
  StudySessionLog,
  StudyTask,
  UpcomingExam,
  UserProfile,
} from './types';
import { usePersistentArray, usePersistentState } from './hooks/usePersistentState';
import { useThemeSync } from './hooks/useThemeSync';
import { useLanguageSync } from './hooks/useLanguageSync';
import { LanguageProvider } from './i18n/LanguageContext';
import { TRANSLATIONS } from './i18n/translations';
import { getTodayIso } from './utils/academicMath';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './components/DashboardPage';
import { ExamModePage } from './components/ExamModePage';
import { ChatPage } from './components/ChatPage';
import { GpaCalculatorPage } from './components/GpaCalculatorPage';
import { StudyPlannerPage } from './components/StudyPlannerPage';
import { FlashcardsPage } from './components/FlashcardsPage';
import { McqGeneratorPage } from './components/McqGeneratorPage';
import { TrueFalsePage } from './components/TrueFalsePage';
import { ProgressPage } from './components/ProgressPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';

function createId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function deriveTitle(prompt: string): string {
  const cleaned = prompt.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 44) return cleaned;
  return `${cleaned.slice(0, 44).trim()}...`;
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [profile, setProfile] = usePersistentState<UserProfile>(
    'pulsemind_profile',
    DEFAULT_PROFILE
  );
  const [settings, setSettings] = usePersistentState<AppSettings>(
    'pulsemind_settings',
    DEFAULT_SETTINGS
  );
  const [conversations, setConversations] = usePersistentArray<Conversation>(
    'pulsemind_conversations',
    []
  );
  const [gpaState, setGpaState] = usePersistentState<GpaState>(
    'pulsemind_gpa_state',
    DEFAULT_GPA_STATE
  );
  const [studyTasks, setStudyTasks] = usePersistentArray<StudyTask>(
    'pulsemind_study_tasks',
    DEFAULT_STUDY_TASKS
  );
  const [flashcardDecks, setFlashcardDecks] = usePersistentArray<FlashcardDeck>(
    'pulsemind_flashcard_decks',
    DEFAULT_FLASHCARD_DECKS
  );
  const [assessmentAttempts, setAssessmentAttempts] = usePersistentArray<AssessmentAttempt>(
    'pulsemind_assessment_attempts',
    []
  );
  const [sessionLogs, setSessionLogs] = usePersistentArray<StudySessionLog>(
    'pulsemind_study_logs',
    []
  );
  const [upcomingExams, setUpcomingExams] = usePersistentArray<UpcomingExam>(
    'pulsemind_upcoming_exams',
    DEFAULT_UPCOMING_EXAMS
  );
  const [examPack, setExamPack] = usePersistentState<ExamTomorrowPack>(
    'pulsemind_exam_pack',
    DEFAULT_EXAM_PACK
  );
  const [studyPlan, setStudyPlan] = usePersistentState<PersonalizedStudyPlan | null>(
    'pulsemind_exam_study_plan',
    null
  );

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSidebarOpenDesktop, setIsSidebarOpenDesktop] = useState(true);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiConnectionStatus>(() =>
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'online'
  );

  const abortControllerRef = useRef<AbortController | null>(null);
  const isDark = useThemeSync(settings.theme);
  useLanguageSync(settings.language);

  useEffect(() => {
    let active = true;

    const checkHealth = async () => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        if (active) setAiStatus('offline');
        return;
      }

      const healthController = new AbortController();
      const healthTimer = window.setTimeout(() => healthController.abort(), 5000);
      try {
        const res = await fetch('/api/health', {
          method: 'GET',
          cache: 'no-store',
          signal: healthController.signal,
        });
        if (!res.ok) {
          if (active) setAiStatus('offline');
          return;
        }
        const data = (await res.json()) as { status?: string; aiConfigured?: boolean };
        if (!active) return;
        if (data.aiConfigured === false) {
          setAiStatus('offline');
        } else {
          setAiStatus((prev) => (prev === 'offline' ? 'online' : prev));
        }
      } catch {
        if (active) setAiStatus('offline');
      } finally {
        window.clearTimeout(healthTimer);
      }
    };

    const handleOnline = () => {
      void checkHealth();
    };
    const handleOffline = () => {
      if (active) setAiStatus('offline');
    };

    void checkHealth();
    const intervalId = window.setInterval(() => {
      void checkHealth();
    }, 30000);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...patch }));
    },
    [setSettings]
  );

  const handleToggleDark = useCallback(() => {
    updateSettings({ theme: isDark ? 'light' : 'dark' });
  }, [isDark, updateSettings]);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) ?? null;

  const logStudyMinutes = useCallback(
    (
      minutes: number,
      subject: string,
      source: StudySessionLog['source']
    ) => {
      if (!Number.isFinite(minutes) || minutes <= 0) return;
      const entry: StudySessionLog = {
        id: createId(),
        date: getTodayIso(),
        subject: subject || 'General Nursing',
        minutes: Math.round(minutes),
        source,
        createdAt: new Date().toISOString(),
      };
      setSessionLogs((prev) => [entry, ...prev]);
    },
    [setSessionLogs]
  );

  const streamAssistantResponse = useCallback(
    async (
      convId: string,
      historyForApi: { role: 'user' | 'assistant'; content: string }[],
      assistantMsgId: string
    ) => {
      const CLIENT_TIMEOUT_MS = 15000;
      const chatDict = TRANSLATIONS[settings.language].chat;

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setAiStatus('offline');
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id !== convId) return conv;
            return {
              ...conv,
              messages: conv.messages.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content: chatDict.offlineError,
                      isError: true,
                      errorCode: 'OFFLINE',
                    }
                  : m
              ),
            };
          })
        );
        return;
      }

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsStreaming(true);

      let didTimeout = false;
      let timeoutId: number | undefined;

      const resetClientTimeout = () => {
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
        }
        timeoutId = window.setTimeout(() => {
          didTimeout = true;
          controller.abort();
        }, CLIENT_TIMEOUT_MS);
      };

      resetClientTimeout();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: historyForApi,
            profile,
            settings,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          let errText = `Server error (${response.status})`;
          try {
            const errJson = await response.json();
            if (errJson?.error) errText = errJson.error;
          } catch {
            // Keep HTTP status fallback
          }
          const err = new Error(errText) as Error & { code?: ChatErrorCode };
          if (response.status === 503 || response.status === 429 || response.status === 504) {
            err.code = 'AI_BUSY';
          }
          throw err;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Streaming response body unavailable.');
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let accumulated = '';

        const processLine = (line: string) => {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) return;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr) return;

          try {
            const event = JSON.parse(jsonStr) as {
              text?: string;
              done?: boolean;
              status?: string;
              error?: string;
              code?: ChatErrorCode;
            };

            if (event.status === 'fallback') {
              setAiStatus('busy');
              resetClientTimeout();
            }

            if (event.error) {
              const err = new Error(event.error) as Error & { code?: ChatErrorCode };
              err.code = event.code;
              throw err;
            }

            if (event.text) {
              resetClientTimeout();
              setAiStatus('online');
              accumulated += event.text;
              setConversations((prev) =>
                prev.map((conv) => {
                  if (conv.id !== convId) return conv;
                  return {
                    ...conv,
                    updatedAt: new Date().toISOString(),
                    messages: conv.messages.map((m) =>
                      m.id === assistantMsgId ? { ...m, content: accumulated } : m
                    ),
                  };
                })
              );
            }
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== 'Unexpected end of JSON input') {
              throw parseErr;
            }
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            processLine(line);
          }
        }

        buffer += decoder.decode();
        if (buffer.trim()) {
          for (const line of buffer.split('\n')) {
            processLine(line);
          }
        }

        if (!accumulated.trim()) {
          const busyErr = new Error(chatDict.serviceBusyError) as Error & {
            code?: ChatErrorCode;
          };
          busyErr.code = 'AI_BUSY';
          throw busyErr;
        }

        setAiStatus('online');
      } catch (err: unknown) {
        let errorCode: ChatErrorCode = 'GENERIC';
        let message = chatDict.serviceBusyError;

        if (didTimeout) {
          errorCode = 'AI_BUSY';
          message = chatDict.serviceBusyError;
          setAiStatus('busy');
        } else if (err instanceof Error && err.name === 'AbortError') {
          setConversations((prev) =>
            prev.map((conv) => {
              if (conv.id !== convId) return conv;
              return {
                ...conv,
                messages: conv.messages.map((m) =>
                  m.id === assistantMsgId && !m.content.trim()
                    ? {
                        ...m,
                        content: chatDict.stoppedByUser,
                        isError: true,
                        errorCode: 'ABORTED',
                      }
                    : m
                ),
              };
            })
          );
          return;
        } else {
          const rawMsg = err instanceof Error ? err.message : '';
          const explicitCode =
            typeof err === 'object' && err !== null && 'code' in err
              ? (err as { code?: ChatErrorCode }).code
              : undefined;

          const isOffline =
            (typeof navigator !== 'undefined' && !navigator.onLine) ||
            /failed to fetch|networkerror|load failed|network request failed/i.test(rawMsg);

          const isBusy =
            explicitCode === 'AI_BUSY' ||
            /AI service is busy|503|429|504|UNAVAILABLE|RESOURCE_EXHAUSTED|high demand|overloaded|timed out|timeout/i.test(
              rawMsg
            );

          if (isOffline) {
            errorCode = 'OFFLINE';
            message = chatDict.offlineError;
            setAiStatus('offline');
          } else if (isBusy) {
            errorCode = 'AI_BUSY';
            message = chatDict.serviceBusyError;
            setAiStatus('busy');
          } else {
            errorCode = 'GENERIC';
            message = rawMsg || 'Connection failed. Check your server and try again.';
          }
        }

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id !== convId) return conv;
            return {
              ...conv,
              messages: conv.messages.map((m) =>
                m.id === assistantMsgId
                  ? { ...m, content: message, isError: true, errorCode }
                  : m
              ),
            };
          })
        );
      } finally {
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
        }
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [profile, settings, setConversations]
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      const now = new Date().toISOString();
      const userMsg: ChatMessage = {
        id: createId(),
        role: 'user',
        content,
        createdAt: now,
      };
      const assistantMsgId = createId();
      const assistantPlaceholder: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        createdAt: now,
      };

      let targetConvId = activeConversationId;
      let apiHistory: { role: 'user' | 'assistant'; content: string }[] = [];

      if (!targetConvId || !conversations.some((c) => c.id === targetConvId)) {
        targetConvId = createId();
        const newConv: Conversation = {
          id: targetConvId,
          title: deriveTitle(content),
          updatedAt: now,
          messages: [userMsg, assistantPlaceholder],
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(targetConvId);
        apiHistory = [{ role: 'user', content }];
      } else {
        const existing = conversations.find((c) => c.id === targetConvId);
        const priorValid = (existing?.messages ?? [])
          .filter((m) => !m.isError && m.content.trim().length > 0)
          .map((m) => ({ role: m.role, content: m.content }));

        apiHistory = [...priorValid, { role: 'user', content }];

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id !== targetConvId) return conv;
            const title =
              conv.messages.length === 0 ? deriveTitle(content) : conv.title;
            return {
              ...conv,
              title,
              updatedAt: now,
              messages: [...conv.messages, userMsg, assistantPlaceholder],
            };
          })
        );
      }

      void streamAssistantResponse(targetConvId, apiHistory, assistantMsgId);
    },
    [activeConversationId, conversations, setConversations, streamAssistantResponse]
  );

  const handleRegenerateLast = useCallback(() => {
    if (!activeConversation || isStreaming) return;
    const msgs = activeConversation.messages;
    if (msgs.length === 0) return;

    const lastUserIdx = [...msgs]
      .reverse()
      .findIndex((m) => m.role === 'user');
    if (lastUserIdx === -1) return;

    const cutIndex = msgs.length - 1 - lastUserIdx;
    const keptMessages = msgs.slice(0, cutIndex + 1);
    const assistantMsgId = createId();
    const placeholder: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
    };

    const apiHistory = keptMessages
      .filter((m) => !m.isError && m.content.trim().length > 0)
      .map((m) => ({ role: m.role, content: m.content }));

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation.id
          ? { ...conv, messages: [...keptMessages, placeholder] }
          : conv
      )
    );

    void streamAssistantResponse(activeConversation.id, apiHistory, assistantMsgId);
  }, [activeConversation, isStreaming, setConversations, streamAssistantResponse]);

  const handleStopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const handleNewChat = useCallback(() => {
    if (isStreaming) {
      abortControllerRef.current?.abort();
      setIsStreaming(false);
    }
    setActiveConversationId(null);
    setActiveView('chat');
  }, [isStreaming]);

  const handleDeleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    },
    [activeConversationId, setConversations]
  );

  const handleClearAllConversations = useCallback(() => {
    setConversations([]);
    setActiveConversationId(null);
  }, [setConversations]);

  const handleStartPromptFromLanding = useCallback(
    (prompt: string) => {
      setActiveConversationId(null);
      setActiveView('chat');
      const now = new Date().toISOString();
      const newConvId = createId();
      const userMsg: ChatMessage = {
        id: createId(),
        role: 'user',
        content: prompt,
        createdAt: now,
      };
      const assistantMsgId = createId();
      const assistantPlaceholder: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        createdAt: now,
      };
      const newConv: Conversation = {
        id: newConvId,
        title: deriveTitle(prompt),
        updatedAt: now,
        messages: [userMsg, assistantPlaceholder],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConvId);
      void streamAssistantResponse(
        newConvId,
        [{ role: 'user', content: prompt }],
        assistantMsgId
      );
    },
    [setConversations, streamAssistantResponse]
  );

  // Study Planner Handlers
  const handleAddTask = useCallback(
    (taskInput: Omit<StudyTask, 'id' | 'completed'>) => {
      const created: StudyTask = {
        ...taskInput,
        id: createId(),
        completed: false,
      };
      setStudyTasks((prev) => [created, ...prev]);
    },
    [setStudyTasks]
  );

  const handleToggleTask = useCallback(
    (taskId: string) => {
      const target = studyTasks.find((t) => t.id === taskId);
      const becomingCompleted = target ? !target.completed : false;

      setStudyTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;
          const nextCompleted = !task.completed;
          return {
            ...task,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        })
      );

      if (target && becomingCompleted) {
        logStudyMinutes(target.durationMinutes, target.subject, 'planner');
      }
    },
    [studyTasks, setStudyTasks, logStudyMinutes]
  );

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      setStudyTasks((prev) => prev.filter((t) => t.id !== taskId));
    },
    [setStudyTasks]
  );

  // Flashcards Handlers
  const handleAddDeck = useCallback(
    (deck: FlashcardDeck) => {
      setFlashcardDecks((prev) => [deck, ...prev]);
    },
    [setFlashcardDecks]
  );

  const handleDeleteDeck = useCallback(
    (deckId: string) => {
      setFlashcardDecks((prev) => prev.filter((d) => d.id !== deckId));
    },
    [setFlashcardDecks]
  );

  const handleToggleCardMastered = useCallback(
    (deckId: string, cardId: string) => {
      setFlashcardDecks((prev) =>
        prev.map((deck) => {
          if (deck.id !== deckId) return deck;
          return {
            ...deck,
            cards: deck.cards.map((card) =>
              card.id === cardId ? { ...card, mastered: !card.mastered } : card
            ),
          };
        })
      );
    },
    [setFlashcardDecks]
  );

  // Assessment Attempt Handler (MCQ + True/False)
  const handleRecordAttempt = useCallback(
    (attempt: AssessmentAttempt, studyMinutes: number) => {
      setAssessmentAttempts((prev) => [attempt, ...prev]);
      logStudyMinutes(studyMinutes, attempt.subject, attempt.mode);
    },
    [setAssessmentAttempts, logStudyMinutes]
  );

  // Upcoming Exams Handlers
  const handleAddExam = useCallback(
    (examInput: Omit<UpcomingExam, 'id'>) => {
      const created: UpcomingExam = {
        ...examInput,
        id: createId(),
      };
      setUpcomingExams((prev) => [created, ...prev]);
    },
    [setUpcomingExams]
  );

  const handleDeleteExam = useCallback(
    (examId: string) => {
      setUpcomingExams((prev) => prev.filter((e) => e.id !== examId));
    },
    [setUpcomingExams]
  );

  return (
    <LanguageProvider
      language={settings.language}
      onChangeLanguage={(language) => updateSettings({ language })}
    >
      {activeView === 'landing' ? (
        <LandingPage
          onNavigate={setActiveView}
          onStartPrompt={handleStartPromptFromLanding}
          isDark={isDark}
          onToggleDark={handleToggleDark}
        />
      ) : (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B1120]">
          <Sidebar
            activeView={activeView}
            onNavigate={setActiveView}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onNewChat={handleNewChat}
            onDeleteConversation={handleDeleteConversation}
            profile={profile}
            isDark={isDark}
            onToggleDark={handleToggleDark}
            isOpenDesktop={isSidebarOpenDesktop}
            onCloseDesktop={() => setIsSidebarOpenDesktop(false)}
            isOpenMobile={isSidebarOpenMobile}
            onCloseMobile={() => setIsSidebarOpenMobile(false)}
          />

          <div className="flex-1 min-w-0">
        {activeView === 'dashboard' && (
          <DashboardPage
            profile={profile}
            gpaState={gpaState}
            tasks={studyTasks}
            decks={flashcardDecks}
            attempts={assessmentAttempts}
            sessionLogs={sessionLogs}
            conversations={conversations}
            upcomingExams={upcomingExams}
            onNavigate={setActiveView}
            onToggleTask={handleToggleTask}
            onSelectConversation={setActiveConversationId}
            onNewChat={handleNewChat}
            isSidebarOpenDesktop={isSidebarOpenDesktop}
            onOpenSidebarDesktop={() => setIsSidebarOpenDesktop(true)}
            onOpenSidebarMobile={() => setIsSidebarOpenMobile(true)}
          />
        )}

        {activeView === 'exam' && (
          <ExamModePage
            profile={profile}
            exams={upcomingExams}
            onAddExam={handleAddExam}
            onDeleteExam={handleDeleteExam}
            examPack={examPack}
            onUpdateExamPack={setExamPack}
            studyPlan={studyPlan}
            onUpdateStudyPlan={setStudyPlan}
            attempts={assessmentAttempts}
            decks={flashcardDecks}
            tasks={studyTasks}
            sessionLogs={sessionLogs}
            onRecordAttempt={handleRecordAttempt}
            onLogStudyMinutes={(mins, subj, src) => logStudyMinutes(mins, subj, src)}
            isSidebarOpenDesktop={isSidebarOpenDesktop}
            onOpenSidebarDesktop={() => setIsSidebarOpenDesktop(true)}
            onOpenSidebarMobile={() => setIsSidebarOpenMobile(true)}
          />
        )}

        {activeView === 'chat' && (
          <ChatPage
            conversation={activeConversation}
            profile={profile}
            settings={settings}
            aiStatus={aiStatus}
            onUpdateSettings={updateSettings}
            onSendMessage={handleSendMessage}
            onStopStreaming={handleStopStreaming}
            onRegenerateLast={handleRegenerateLast}
            onNewChat={handleNewChat}
            isStreaming={isStreaming}
            isSidebarOpenDesktop={isSidebarOpenDesktop}
            onOpenSidebarDesktop={() => setIsSidebarOpenDesktop(true)}
            onOpenSidebarMobile={() => setIsSidebarOpenMobile(true)}
          />
        )}

        {activeView === 'gpa' && (
          <GpaCalculatorPage
            gpaState={gpaState}
            onUpdateGpaState={setGpaState}
            isSidebarOpenDesktop={isSidebarOpenDesktop}
            onOpenSidebarDesktop={() => setIsSidebarOpenDesktop(true)}
            onOpenSidebarMobile={() => setIsSidebarOpenMobile(true)}
          />
        )}

        {activeView === 'planner' && (
          <StudyPlannerPage
            tasks={studyTasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onLogStudyMinutes={(mins, subj, src) => logStudyMinutes(mins, subj, src)}
            isSidebarOpenDesktop={isSidebarOpenDesktop}
            onOpenSidebarDesktop={() => setIsSidebarOpenDesktop(true)}
            onOpenSidebarMobile={() => setIsSidebarOpenMobile(true)}
          />
        )}

        {activeView === 'flashcards' && (
          <FlashcardsPage
            profile={profile}
            decks={flashcardDecks}
            onAddDeck={handleAddDeck}
            onDeleteDeck={handleDeleteDeck}
            onToggleCardMastered={handleToggleCardMastered}
            onLogStudyMinutes={(mins, subj, src) => logStudyMinutes(mins, subj, src)}
            isSidebarOpenDesktop={isSidebarOpenDesktop}
            onOpenSidebarDesktop={() => setIsSidebarOpenDesktop(true)}
            onOpenSidebarMobile={() => setIsSidebarOpenMobile(true)}
          />
        )}

        {activeView === 'mcq' && (
          <McqGeneratorPage
            profile={profile}
            onRecordAttempt={handleRecordAttempt}
            isSidebarOpenDesktop={isSidebarOpenDesktop}
            onOpenSidebarDesktop={() => setIsSidebarOpenDesktop(true)}
            onOpenSidebarMobile={() => setIsSidebarOpenMobile(true)}
          />
        )}

        {activeView === 'truefalse' && (
          <TrueFalsePage
            profile={profile}
            onRecordAttempt={handleRecordAttempt}
            isSidebarOpenDesktop={isSidebarOpenDesktop}
            onOpenSidebarDesktop={() => setIsSidebarOpenDesktop(true)}
            onOpenSidebarMobile={() => setIsSidebarOpenMobile(true)}
          />
        )}

        {activeView === 'progress' && (
          <ProgressPage
            gpaState={gpaState}
            tasks={studyTasks}
            decks={flashcardDecks}
            attempts={assessmentAttempts}
            sessionLogs={sessionLogs}
            conversations={conversations}
            onNavigate={setActiveView}
            onClearAttempts={() => setAssessmentAttempts([])}
            isSidebarOpenDesktop={isSidebarOpenDesktop}
            onOpenSidebarDesktop={() => setIsSidebarOpenDesktop(true)}
            onOpenSidebarMobile={() => setIsSidebarOpenMobile(true)}
          />
        )}

        {activeView === 'profile' && (
          <ProfilePage
            profile={profile}
            onSaveProfile={setProfile}
            conversations={conversations}
            isSidebarOpenDesktop={isSidebarOpenDesktop}
            onOpenSidebarDesktop={() => setIsSidebarOpenDesktop(true)}
            onOpenSidebarMobile={() => setIsSidebarOpenMobile(true)}
          />
        )}

        {activeView === 'settings' && (
          <SettingsPage
            settings={settings}
            onUpdateSettings={updateSettings}
            conversations={conversations}
            onClearAllConversations={handleClearAllConversations}
            isSidebarOpenDesktop={isSidebarOpenDesktop}
            onOpenSidebarDesktop={() => setIsSidebarOpenDesktop(true)}
            onOpenSidebarMobile={() => setIsSidebarOpenMobile(true)}
          />
        )}
          </div>
        </div>
      )}
    </LanguageProvider>
  );
}
