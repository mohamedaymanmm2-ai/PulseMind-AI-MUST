import React from 'react';
import { Menu, PanelLeftOpen } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface WorkspaceHeaderProps {
  title: string;
  subtitle?: string;
  isSidebarOpenDesktop: boolean;
  onOpenSidebarDesktop: () => void;
  onOpenSidebarMobile: () => void;
  rightAction?: React.ReactNode;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  title,
  subtitle,
  isSidebarOpenDesktop,
  onOpenSidebarDesktop,
  onOpenSidebarMobile,
  rightAction,
}) => {
  const { t } = useTranslation();

  return (
    <header className="h-14 px-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3 shrink-0 bg-slate-50/90 dark:bg-[#0B1120]/90 backdrop-blur-sm sticky top-0 z-20">
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
          {title}
        </h1>

        {subtitle && (
          <>
            <span className="hidden md:inline text-xs text-slate-400 dark:text-slate-500">·</span>
            <span className="hidden md:inline text-xs text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </span>
          </>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <LanguageSwitcher compact />
        {rightAction}
      </div>
    </header>
  );
};
