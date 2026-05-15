import React from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

export const TopBar: React.FC = () => {
  const activeProject = useStore((state) => state.activeProject);
  const exportProject = useStore((state) => state.exportProject);
  const theme = useStore((state) => state.settings.theme);

  const isDark = ['dark', 'cobalt', 'slate'].includes(theme);

  return (
    <header className={cn(
      "h-14 border-b flex items-center justify-between px-6 z-10 shadow-sm shrink-0 transition-colors duration-500",
      isDark ? "bg-black/40 border-white/10 text-white" : "bg-white/90 border-gray-border text-dark-charcoal"
    )}>
      <div className="flex items-center gap-4">
        {activeProject ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-sm font-medium">Whiteboard /</span>
              <h1 className="font-display font-medium text-base tracking-tight">{activeProject.name}</h1>
            </div>
            {activeProject.createdAt && (
              <span className="text-[10px] text-white/30 font-mono tracking-tighter">
                Session Active • Started: {new Date(activeProject.createdAt).toLocaleString()}
              </span>
            )}
          </div>
        ) : (
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="text"
              placeholder="Search whiteboards..."
              className="pl-9 pr-4 py-1.5 bg-white/10 border border-white/5 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 transition-all w-64 lg:w-96"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className={cn(
          "flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-opacity duration-300",
          isDark ? "opacity-60" : "opacity-40"
        )}>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shadow-[0_0_8px_rgba(232,200,50,0.5)] animate-pulse"></span>
          Pure Frontend Mode
        </div>
        
        <div className={cn("flex items-center gap-3 border-l pl-6", isDark ? "border-white/10" : "border-gray-border")}>
          <button 
            onClick={() => exportProject()}
            className={cn(
              "px-3 py-1 bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 rounded-md text-[10px] font-bold hover:bg-brand-yellow/20 transition-all uppercase tracking-wider"
            )}
          >
            Export Backup
          </button>
          <button 
            onClick={() => {
              if (confirm('Export and Close Session? This will download your work and clear the local session.')) {
                exportProject();
                useStore.setState({ activeProject: null });
              }
            }}
            className="px-4 py-1.5 bg-brand-yellow text-dark-charcoal rounded-md text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            Save & Exit
          </button>
        </div>
      </div>
    </header>
  );
};
