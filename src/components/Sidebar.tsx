import React from 'react';
import {
  Calculator,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Home,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Moon,
  PanelLeftClose,
  Plus,
  Settings,
  Sun,
  Trash2,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import { AppView, Conversation, UserProfile } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { PulseMindLogo } from './PulseMindLogo';
import { StudentAvatar } from './StudentAvatar';

interface SidebarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  profile: UserProfile;
  isDark: boolean;
  onToggleDark: () => void;
  isOpenDesktop: boolean;
  onCloseDesktop: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  profile,
  isDark,
  onToggleDark,
  isOpenDesktop,
  onCloseDesktop,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { t } = useTranslation();

  const coreNavItems: {
    id: AppView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'exam', label: t.nav.examMode, icon: GraduationCap },
    { id: 'chat', label: t.nav.aiChat, icon: MessageSquare },
  ];

  const studyToolItems: {
    id: AppView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'flashcards', label: t.nav.flashcards, icon: Layers },
    { id: 'mcq', label: t.nav.mcqGenerator, icon: ClipboardCheck },
    { id: 'truefalse', label: t.nav.trueFalse, icon: CheckCircle2 },
    { id: 'planner', label: t.nav.studyPlanner, icon: CalendarCheck },
    { id: 'gpa', label: t.nav.gpaCalculator, icon: Calculator },
    { id: 'progress', label: t.nav.progressTracking, icon: TrendingUp },
  ];

  const accountNavItems: {
    id: AppView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'profile', label: t.nav.userProfile, icon: User },
    { id: 'settings', label: t.nav.settings, icon: Settings },
    { id: 'landing', label: t.nav.landingPage, icon: Home },
  ];

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    onCloseMobile();
  };

  const handleSelectThread = (id: string) => {
    onSelectConversation(id);
    onNavigate('chat');
    onCloseMobile();
  };

  const handleNewChatClick = () => {
    onNewChat();
    onNavigate('chat');
    onCloseMobile();
  };

  const renderNavButton = (item: {
    id: AppView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => {
    const Icon = item.icon;
    const isActive = activeView === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleNavClick(item.id)}
        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
          isActive
            ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
        }`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-100/90 dark:bg-[#0F172A] border-e border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 select-none">
      {/* Top Brand & Collapse Row */}
      <div className="px-3.5 pt-3.5 pb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2.5 px-1.5 py-1 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <PulseMindLogo size={24} />
          <span className="font-display font-bold text-base tracking-tight text-slate-900 dark:text-slate-50">
            {t.common.brandName}
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseDesktop}
          className="hidden lg:inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label={t.common.collapseSidebar}
          title={t.common.collapseSidebar}
        >
          <PanelLeftClose className="w-4 h-4 rtl:rotate-180" />
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label={t.common.closeNav}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 py-2">
        <button
          type="button"
          onClick={handleNewChatClick}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>{t.nav.newClinicalChat}</span>
        </button>
      </div>

      {/* Scrollable Nav + Recent Threads */}
      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-1 space-y-4">
        <nav aria-label={t.nav.dashboard} className="space-y-0.5">
          {coreNavItems.map(renderNavButton)}
        </nav>

        <div>
          <p className="px-2.5 pb-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {t.nav.studySuite}
          </p>
          <nav aria-label={t.nav.studySuite} className="space-y-0.5">
            {studyToolItems.map(renderNavButton)}
          </nav>
        </div>

        <div>
          <p className="px-2.5 pb-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {t.nav.accountPrefs}
          </p>
          <nav aria-label={t.nav.accountPrefs} className="space-y-0.5">
            {accountNavItems.map(renderNavButton)}
          </nav>
        </div>

        {/* Recent Conversations */}
        <div>
          <p className="px-2.5 pb-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {t.nav.recentStudies}
          </p>

          {conversations.length === 0 ? (
            <p className="px-2.5 py-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.nav.noRecentChats}
            </p>
          ) : (
            <div className="space-y-0.5 pb-4">
              {conversations.map((conv) => {
                const isSelected = activeView === 'chat' && conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    className={`group flex items-center gap-1 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectThread(conv.id)}
                      dir="auto"
                      className="flex-1 min-w-0 text-start px-2.5 py-2 text-sm truncate cursor-pointer"
                      title={conv.title}
                    >
                      {conv.title}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 me-1 rounded-md text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-opacity cursor-pointer"
                      aria-label={`${t.nav.deleteChat}: ${conv.title}`}
                      title={t.nav.deleteChat}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls: Dark Mode Quick Toggle + User Profile Summary */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          type="button"
          onClick={onToggleDark}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2.5 whitespace-nowrap">
            {isDark ? (
              <Moon className="w-4 h-4 text-blue-400" />
            ) : (
              <Sun className="w-4 h-4 text-blue-700" />
            )}
            <span>{isDark ? t.common.darkMode : t.common.lightMode}</span>
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isDark ? t.common.on : t.common.off}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick('profile')}
          className={`w-full flex items-center gap-3 p-2 rounded-xl transition-colors text-start cursor-pointer ${
            activeView === 'profile'
              ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
              : 'hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <StudentAvatar name={profile.fullName} sizeClass="w-9 h-9" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {profile.fullName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {profile.academicYear}
            </p>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Rail */}
      {isOpenDesktop && (
        <aside className="hidden lg:block w-[264px] shrink-0 h-screen sticky top-0">
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-[280px] max-w-[85vw] h-full">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
