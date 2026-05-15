import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, compactSidebar } = useStore((state) => state.settings);

  const themeClasses = {
    light: 'bg-bg-warm text-dark-charcoal',
    dark: 'bg-dark-charcoal text-white dark',
    amber: 'bg-amber-50 text-amber-950',
    emerald: 'bg-emerald-50 text-emerald-950',
    indigo: 'bg-indigo-50 text-indigo-950',
    rose: 'bg-rose-50 text-rose-950',
    cobalt: 'bg-blue-900 text-white dark',
    slate: 'bg-slate-700 text-white dark',
  };

  return (
    <div className={cn("flex h-screen overflow-hidden transition-colors duration-500", themeClasses[theme])}>
      <Sidebar collapsed={sidebarCollapsed || compactSidebar} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
