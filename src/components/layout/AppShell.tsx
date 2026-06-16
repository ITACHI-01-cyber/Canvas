import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNavBar } from './MobileNavBar';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { AnimatePresence, motion } from 'motion/react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, compactSidebar } = useStore((state) => state.settings);

  const themeClasses = {
    light: 'bg-[#ebdcb9] text-black',
    dark: 'bg-[#121212] text-white dark',
    amber: 'bg-[#fef3c7] text-black',
    emerald: 'bg-[#d1fae5] text-black',
    indigo: 'bg-[#e0e7ff] text-black',
    rose: 'bg-[#ffe4e6] text-black',
    cobalt: 'bg-[#1e3a8a] text-white dark',
    slate: 'bg-[#334155] text-white dark',
  };

  return (
    <div className={cn("flex h-screen overflow-hidden transition-colors duration-500", themeClasses[theme])}>
      {/* Backdrop overlay for mobile screen */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar 
        collapsed={sidebarCollapsed || compactSidebar} 
        setCollapsed={setSidebarCollapsed} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 overflow-auto pb-24 md:pb-0">
          {children}
        </main>
        <MobileNavBar />
      </div>
    </div>
  );
};
