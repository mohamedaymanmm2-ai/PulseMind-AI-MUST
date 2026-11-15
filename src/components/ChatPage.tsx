import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  AlertCircle,
  ArrowUp,
  Check,
  Copy,
  Menu,
  PanelLeftOpen,
  Plus,
  RotateCcw,
  Square,
  Zap,
} from 'lucide-react';
import {
  AiConnectionStatus,
  AppSettings,
  ChatMessage,
  ClinicalResponseFormat,
  Conversation,
  UserProfile,
} from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PulseMindLogo } from './PulseMindLogo';

interface ChatPageProps {
  conversation: Conversation | null;
  profile: UserProfile;
  settings: AppSettings;
  aiStatus: AiConnectionStatus;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onSendMessage: (content: string) => void;
  onStopStreaming: () => void;
  onRegenerateLast: () => void;
  onNewChat: () => void;
  isStreaming: boolean;
  isSidebarOpenDesktop: boolean;
  onOpenSidebarDesktop: () => void;
  onOpenSidebarMobile: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  conversation,
  profile,
  settings,
  aiStatus,
  onUpdateSettings,
  onSendMessage,
  onStopStreaming,
  onRegenerateLast,
  onNewChat,
  isStreaming,
  isSidebarOpenDesktop,
  onOpenSidebarDesktop,
  onOpenSidebarMobile,
}) => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);

  const messages: ChatMessage[] = conversation?.messages ?? [];
  const firstName = profile.fullName.trim().split(' ')[0] || 'Student';

  const hour = new Date().getHours();
  const greetingPrefix =
    hour < 12 ? t.chat.goodMorning : hour < 18 ? t.chat.goodAfternoon : t.chat.goodEvening;

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, messages[messages.length - 1]?.content]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    setInput('');
    onSendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && settings.enterToSend) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard blocked
    }
  };

  const proseSizeClass =
    settings.fontSize === 'large'
      ? 'clinical-prose-large'
      : settings.density === 'compact'
        ? 'clinical-prose-compact'
        : '';

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      {/* Workspace Top Bar */}
      <header className="h-14 px-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3 shrink-0 bg-slate-50/90 dark:bg-[#0B1120]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onOpenSidebarMobile}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label={t.common.openNav}
          >
            <Menu className="w-5 h-5" />
          </button>

          {!isSidebarOpenDesktop && (
            <button
              type="button"
              onClick={onOpenSidebarDesktop}
              className="hidden lg:inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label={t.common.expandSidebar}
              title={t.common.expandSidebar}
            >
              <PanelLeftOpen className="w-4 h-4 rtl:rotate-180" />
            </button>
          )}

          <h1 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
            {conversation ? conversation.title : t.chat.newClinicalStudy}
          </h1>
          <span className="hidden md:inline text-xs text-slate-400 dark:text-slate-500">·</span>
          <span className="hidden md:inline text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {t.chat.formats[settings.responseFormat]}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            role="status"
            aria-live="polite"
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border whitespace-nowrap shrink-0 ${
              aiStatus === 'online'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60'
                : aiStatus === 'busy'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200/80 dark:border-red-800/60'
            }`}
          >
            {t.chat.connectionStatus[aiStatus]}
          </span>
          <LanguageSwitcher compact />
          <button
            type="button"
            onClick={onNewChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.chat.newChat}</span>
          </button>
        </div>
      </header>

      {/* Main Scrollable Thread */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-10 flex flex-col justify-center min-h-full">
            <div className="mb-6">
              <div className="inline-flex items-center gap-3 mb-3">
                <PulseMindLogo size={32} />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                  {t.common.brandName} · {profile.clinicalRotation}
                </span>
              </div>
              <h2
                className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4"
                style={{ textWrap: 'balance' }}
              >
                {greetingPrefix}, {firstName} 👋
              </h2>

              {/* PulseMind AI Welcome Message Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 shrink-0">
                    <PulseMindLogo size={26} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-display text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {t.common.brandName}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
                      <span className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                        {t.chat.studyPartnerBadge}
                      </span>
                    </div>
                    <div
                      dir="auto"
                      className="text-[15px] leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-line"
                    >
                      {t.chat.welcomeMessage}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {t.chat.suggestedPrompts.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => onSendMessage(item.prompt)}
                  className="text-start p-4 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 transition-colors cursor-pointer group"
                >
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
                    {item.category}
                  </p>
                  <p
                    dir="auto"
                    className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
                  >
                    {item.title}
                  </p>
                  <p
                    dir="auto"
                    className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed"
                  >
                    {item.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-7">
            {messages.map((msg, idx) => {
              const isLastMessage = idx === messages.length - 1;
              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div
                      dir="auto"
                      className="max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 bg-blue-700 dark:bg-blue-600 text-white text-[15px] leading-relaxed whitespace-pre-wrap"
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              }

              const resolvedErrorText =
                msg.errorCode === 'AI_BUSY'
                  ? t.chat.serviceBusyError
                  : msg.errorCode === 'OFFLINE'
                    ? t.chat.offlineError
                    : msg.errorCode === 'ABORTED'
                      ? t.chat.stoppedByUser
                      : msg.content || t.chat.serviceBusyError;

              const isActivelyWaiting =
                isStreaming && isLastMessage && !msg.isError && !msg.content.trim();
              const isInterruptedEmpty =
                !isActivelyWaiting && !msg.isError && !msg.content.trim();
              const showErrorCard = Boolean(msg.isError) || isInterruptedEmpty;

              return (
                <div key={msg.id} className="flex items-start gap-3.5">
                  <div className="mt-0.5 shrink-0">
                    <PulseMindLogo size={26} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-display text-xs font-semibold text-slate-800 dark:text-slate-200">
                        PulseMind AI
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {t.chat.formats[settings.responseFormat]}
                      </span>
                      {isStreaming && isLastMessage && !msg.isError && (
                        <>
                          <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                            <span>{t.chat.typingStatus}</span>
                          </span>
                        </>
                      )}
                    </div>

                    {showErrorCard ? (
                      <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium mb-1">{t.chat.errorTitle}</p>
                          <p className="text-xs opacity-90">{resolvedErrorText}</p>
                        </div>
                      </div>
                    ) : (
                      <div
                        dir="auto"
                        className={`clinical-prose ${proseSizeClass} text-slate-800 dark:text-slate-100`}
                      >
                        {msg.content ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        ) : (
                          <div
                            role="status"
                            aria-live="polite"
                            className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300"
                          >
                            <span className="inline-flex items-center gap-1" aria-hidden="true">
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce"
                                style={{ animationDelay: '0ms' }}
                              />
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce"
                                style={{ animationDelay: '150ms' }}
                              />
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce"
                                style={{ animationDelay: '300ms' }}
                              />
                            </span>
                            <span>{t.chat.thinkingPlaceholder}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {(!isStreaming || !isLastMessage) && (msg.content || showErrorCard) && (
                      <div className="mt-3 flex items-center gap-3">
                        {!showErrorCard && msg.content && (
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                <span>{t.common.copied}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{t.common.copy}</span>
                              </>
                            )}
                          </button>
                        )}

                        {isLastMessage && (
                          <button
                            type="button"
                            onClick={onRegenerateLast}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{showErrorCard ? t.chat.retry : t.chat.regenerate}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomAnchorRef} />
          </div>
        )}
      </div>

      {/* Claude-Style Bottom Composer */}
      <div className="px-4 sm:px-6 pb-4 pt-2 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent dark:from-[#0B1120] dark:via-[#0B1120] dark:to-transparent shrink-0">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-700/80 focus-within:border-blue-600 dark:focus-within:border-blue-500 shadow-xs transition-colors"
          >
            <textarea
              ref={textareaRef}
              dir="auto"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={t.chat.composerPlaceholder}
              aria-label={t.chat.composerPlaceholder}
              className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-[15px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none max-h-[180px]"
            />

            <div className="px-3 pb-2.5 pt-1 flex items-center justify-between gap-2">
              {/* Interactive Format Selector + Exam Tomorrow Trigger */}
              <div className="flex items-center gap-1 overflow-x-auto">
                <button
                  type="button"
                  disabled={isStreaming}
                  onClick={() => onSendMessage('Exam Tomorrow')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                  title={t.chat.examTomorrowChip}
                >
                  <Zap className="w-3 h-3" />
                  <span>{t.chat.examTomorrowChip}</span>
                </button>
                {(Object.keys(t.chat.formats) as ClinicalResponseFormat[]).map((fmt) => {
                  const active = settings.responseFormat === fmt;
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => onUpdateSettings({ responseFormat: fmt })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {t.chat.formats[fmt]}
                    </button>
                  );
                })}
              </div>

              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStopStreaming}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
                  aria-label={t.chat.stopGenerating}
                  title={t.chat.stopGenerating}
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  aria-label={t.chat.sendMessage}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          <p className="mt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
            {t.chat.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};
