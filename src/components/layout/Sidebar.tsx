import React, { useRef } from 'react';
import { LayoutDashboard, FolderOpen, Download, Upload, Settings, ChevronLeft, ChevronRight, Clock, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const activeProject = useStore((state) => state.activeProject);

  const navItems = [
    { icon: LayoutDashboard, label: 'Whiteboard', to: '/dashboard' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];
  return (
    <aside
      className={cn(
        "bg-white dark:bg-[#151515] border-r-[3px] border-black dark:border-white flex flex-col transition-all duration-300",
        // Desktop widths
        collapsed ? "md:w-[60px]" : "md:w-60",
        // Mobile layout
        "fixed md:static inset-y-0 left-0 z-50 md:z-auto transition-transform md:translate-x-0 w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="p-4 flex items-center justify-between h-14 bg-white/5 border-b-[3px] border-black dark:border-white overflow-hidden">
        {(!collapsed || mobileOpen) && (
          <div className="flex items-center gap-2 px-1">
            <img src="/logo.jpg" alt="Logo" className="w-6 h-6 border-2 border-black dark:border-white" />
            <span className="font-display font-black text-xs tracking-wider uppercase text-black dark:text-white">Workspace</span>
          </div>
        )}
        
        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:inline-flex p-1.5 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-brand-yellow/10 transition-colors ml-auto rounded-none shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen?.(false)}
          className="md:hidden p-1.5 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-brand-yellow/10 transition-colors ml-auto rounded-none text-[9px] font-mono font-black"
        >
          CLOSE
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen?.(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 text-xs font-mono font-bold uppercase transition-all duration-200 border-2 rounded-none",
                isActive
                  ? "bg-brand-yellow text-black border-black shadow-[3px_3px_0px_0px_#000] scale-[1.02]"
                  : "text-gray-text border-transparent hover:bg-black/5 hover:text-black dark:hover:bg-white/5 dark:hover:text-white"
              )
            }
          >
            <item.icon size={16} />
            {(!collapsed || mobileOpen) && <span>{item.label}</span>}
          </NavLink>
        ))}
        <button
          onClick={() => {
            setMobileOpen?.(false);
            useStore.getState().logout();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-mono font-bold uppercase transition-all duration-200 border-2 border-transparent text-red-500 hover:bg-red-500/10 hover:text-red-600 dark:hover:bg-red-500/15 dark:hover:text-red-400 rounded-none cursor-pointer"
        >
          <LogOut size={16} />
          {(!collapsed || mobileOpen) && <span>Logout</span>}
        </button>
      </nav>


      <div className="mt-auto">
        {(!collapsed || mobileOpen) && activeProject && (
          <div className="p-4 space-y-4 border-t-[3px] border-black dark:border-white bg-white dark:bg-[#181818]">
            {/* Upcoming Deadlines */}
            <div className="bg-white dark:bg-neutral-900 border-[3px] border-black dark:border-white p-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="text-[9px] font-mono font-black uppercase text-black dark:text-white mb-3 tracking-widest flex items-center justify-between border-b-2 border-black dark:border-white pb-1.5">
                <span>Deadlines</span>
                <Clock size={12} />
              </div>
              <div className="space-y-4">
                {activeProject.nodes
                  .filter((n: any) => n.data?.deadline)
                  .sort((a: any, b: any) => new Date(a.data.deadline).getTime() - new Date(b.data.deadline).getTime())
                  .slice(0, 3)
                  .map((node: any) => (
                    <div key={node.id} className="group">
                      <div className="flex flex-col gap-1 mb-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-black dark:text-white truncate flex-1">{node.data.label}</span>
                          <span className="text-[9px] font-mono font-black bg-brand-yellow px-1 border border-black text-black">{node.data.completion || 0}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex flex-col flex-1">
                            <span className="text-[7px] font-mono font-black text-gray-text uppercase">Start</span>
                            <input 
                              type="date"
                              className="text-[9px] bg-slate-100 dark:bg-neutral-800 text-black dark:text-white border border-black dark:border-white p-0.5 rounded-none cursor-pointer focus:bg-brand-yellow/10 outline-none"
                              value={node.data.startDate || ''}
                              onChange={(e) => useStore.getState().updateNodeData(node.id, { startDate: e.target.value })}
                            />
                          </div>
                          <div className="flex flex-col flex-1">
                            <span className="text-[7px] font-mono font-black text-gray-text uppercase">Deadline</span>
                            <input 
                              type="date"
                              className="text-[9px] bg-slate-100 dark:bg-neutral-800 text-black dark:text-white border border-black dark:border-white p-0.5 rounded-none cursor-pointer focus:bg-brand-yellow/10 outline-none"
                              value={node.data.deadline || ''}
                              onChange={(e) => useStore.getState().updateNodeData(node.id, { deadline: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-neutral-800 h-2.5 border border-black dark:border-white overflow-hidden mb-1">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${node.data.completion || 0}%` }}
                          className="h-full border-r border-black dark:border-white" 
                          style={{ backgroundColor: node.data.color || '#ff6f3c' }}
                        />
                      </div>
                    </div>
                  ))}
                {activeProject.nodes.filter((n: any) => n.data?.deadline).length === 0 && (
                  <div className="text-[9px] font-mono text-gray-400 italic text-center py-2">No deadlines set.</div>
                )}
              </div>
            </div>

            {/* Project Progress */}
            <div className="bg-white dark:bg-neutral-900 border-[3px] border-black dark:border-white p-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="text-[9px] font-mono font-black uppercase text-black dark:text-white mb-2 tracking-widest border-b-2 border-black dark:border-white pb-1.5">Progress</div>
              <div className="flex justify-between text-xs mb-1.5 font-mono font-black text-black dark:text-white">
                <span>COMPLETED</span>
                <span>{activeProject.completionPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-800 h-4 border border-black dark:border-white overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${activeProject.completionPercent}%` }}
                  className="h-full bg-brand-yellow border-r border-black dark:border-white" 
                />
              </div>
              <div className="mt-3.5 flex items-center gap-2 text-[8px] text-gray-text font-mono font-bold uppercase">
                <Clock size={10} />
                <span>TIMELOG ACTIVE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
