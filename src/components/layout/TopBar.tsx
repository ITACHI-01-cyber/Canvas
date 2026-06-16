import React from 'react';
import { Search, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

interface TopBarProps {
  onMenuToggle?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuToggle }) => {
  const activeProject = useStore((state) => state.activeProject);
  const theme = useStore((state) => state.settings.theme);
  const user = useStore((state) => state.user);
  const location = useLocation();

  const isDark = ['dark', 'cobalt', 'slate'].includes(theme);
  const isProjectPage = activeProject && location.pathname.startsWith('/projects/');

  return (
    <header className={cn(
      "h-14 border-b-[3px] flex items-center justify-between px-6 z-10 shrink-0 transition-colors duration-300",
      isDark ? "bg-[#121212] border-white text-white" : "bg-white border-black text-black"
    )}>
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className={cn(
            "p-1.5 border-2 md:hidden rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer",
            isDark ? "border-white bg-[#181818] text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]" : "border-black bg-white text-black"
          )}
        >
          <Menu size={16} />
        </button>

        {isProjectPage ? (
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 hidden sm:inline">Whiteboard /</span>
              <h1 className="font-display font-black text-sm tracking-tight truncate max-w-[120px] xs:max-w-[160px] sm:max-w-none">{activeProject.name}</h1>
            </div>
            {activeProject.createdAt && (
              <span className="text-[9px] opacity-65 font-mono hidden sm:block">
                SESSION ID: {activeProject._id} • START: {new Date(activeProject.createdAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        ) : (
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" size={14} />
            <input
              type="text"
              placeholder="SEARCH WORKSPACES..."
              className={cn(
                "pl-9 pr-4 py-1 border-2 text-xs font-mono placeholder-black/40 focus:outline-none transition-all w-36 xs:w-48 sm:w-64 lg:w-96 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                isDark ? "bg-[#181818] border-white text-white placeholder-white/40 focus:bg-white/5" : "bg-white border-black text-black"
              )}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className={cn(
          "flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 border-2 transition-all",
          isDark ? "bg-neutral-900 border-white text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]" : "bg-white border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        )}>
          <span className="w-2 h-2 rounded-none bg-green-500 border border-current animate-pulse"></span>
          DB ACTIVE
        </div>

        {user && (
          <div className={cn(
            "w-8 h-8 rounded-none border-2 overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center bg-[#ff6f3c] transition-all shrink-0",
            isDark ? "border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] bg-neutral-800" : "border-black"
          )}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
            ) : (
              <svg className="w-full h-full text-white p-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
