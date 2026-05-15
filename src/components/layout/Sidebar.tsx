import React, { useRef } from 'react';
import { LayoutDashboard, FolderOpen, Download, Upload, Settings, ChevronLeft, ChevronRight, Clock, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const activeProject = useStore((state) => state.activeProject);
  const exportProject = useStore((state) => state.exportProject);
  const importProject = useStore((state) => state.importProject);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        importProject(content);
      };
      reader.readAsText(file);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Whiteboard', to: '/dashboard' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  return (
    <aside
      className={cn(
        "bg-card-warm border-r border-gray-border flex flex-col transition-all duration-300",
        collapsed ? "w-[60px]" : "w-60"
      )}
    >
      <div className="p-4 flex items-center justify-between h-14 bg-white/5 border-b border-gray-border overflow-hidden">
        {!collapsed && <span className="font-display font-bold text-lg tracking-tight uppercase px-2 text-dark-charcoal/80">Navigation</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-black/5 rounded transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight size={18} className="text-gray-text" /> : <ChevronLeft size={18} className="text-gray-text" />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                isActive
                  ? "bg-brand-yellow/10 text-dark-charcoal font-bold border-l-4 border-brand-yellow"
                  : "text-gray-text hover:bg-gray-100/80 hover:text-dark-charcoal"
              )
            }
          >
            <item.icon size={18} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-gray-border px-3">
          {!collapsed && <div className="text-[10px] font-bold text-gray-text uppercase mb-2 tracking-wider">Storage</div>}
          
          <button
            onClick={() => exportProject()}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg text-sm text-gray-text hover:bg-gray-100/80 hover:text-dark-charcoal transition-all"
            title="Download Project"
          >
            <Download size={18} />
            {!collapsed && <span>Export/Save</span>}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg text-sm text-gray-text hover:bg-gray-100/80 hover:text-dark-charcoal transition-all"
            title="Upload Project"
          >
            <Upload size={18} />
            {!collapsed && <span>Import/Load</span>}
          </button>
          
          <button
            onClick={() => {
              if (confirm('Export and Close Session? All unsaved data will be cleared from the browser.')) {
                exportProject();
                useStore.setState({ activeProject: null });
              }
            }}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg text-sm text-red-500 hover:bg-red-50 transition-all mt-2"
            title="Export and Clear"
          >
            <LogOut size={18} />
            {!collapsed && <span>Export & Exit</span>}
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".json" 
            className="hidden" 
          />
        </div>
      </nav>

      <div className="mt-auto">
        {!collapsed && activeProject && (
          <div className="p-4 space-y-4">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-black/5">
              <div className="text-[10px] font-bold uppercase text-gray-text mb-3 tracking-wider flex items-center justify-between">
                <span>Upcoming Deadlines</span>
                <Clock size={10} />
              </div>
              <div className="space-y-3">
                {activeProject.nodes
                  .filter((n: any) => n.data?.deadline)
                  .sort((a: any, b: any) => new Date(a.data.deadline).getTime() - new Date(b.data.deadline).getTime())
                  .slice(0, 3)
                  .map((node: any) => (
                    <div key={node.id} className="group">
                      <div className="flex flex-col gap-1 mb-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-dark-charcoal truncate flex-1">{node.data.label}</span>
                          <span className="text-[9px] font-bold text-brand-yellow">{node.data.completion || 0}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col flex-1">
                            <span className="text-[7px] font-bold text-gray-text/60 uppercase">Start</span>
                            <input 
                              type="date"
                              className="text-[9px] bg-bg-warm border-none p-0.5 rounded cursor-pointer focus:ring-1 focus:ring-brand-yellow outline-none"
                              value={node.data.startDate || ''}
                              onChange={(e) => useStore.getState().updateNodeData(node.id, { startDate: e.target.value })}
                            />
                          </div>
                          <div className="flex flex-col flex-1">
                            <span className="text-[7px] font-bold text-gray-text/60 uppercase">Deadline</span>
                            <input 
                              type="date"
                              className="text-[9px] bg-bg-warm border-none p-0.5 rounded cursor-pointer focus:ring-1 focus:ring-brand-yellow outline-none"
                              value={node.data.deadline || ''}
                              onChange={(e) => useStore.getState().updateNodeData(node.id, { deadline: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden mb-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${node.data.completion || 0}%` }}
                          className="h-full bg-brand-yellow" 
                          style={{ backgroundColor: node.data.color }}
                        />
                      </div>
                    </div>
                  ))}
                {activeProject.nodes.filter((n: any) => n.data?.deadline).length === 0 && (
                  <div className="text-[10px] text-gray-400 italic">No deadlines set. Select a node to add one.</div>
                )}
              </div>
            </div>

            {/* Project Progress */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-black/5">
              <div className="text-[10px] font-bold uppercase text-gray-text mb-2 tracking-wider font-display">Global Progress</div>
              <div className="flex justify-between text-sm mb-1 font-bold">
                <span>Completed</span>
                <span>{activeProject.completionPercent}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${activeProject.completionPercent}%` }}
                  className="h-full bg-brand-yellow" 
                />
              </div>
              <div className="mt-3 flex items-center gap-2 text-[8px] text-gray-text font-bold uppercase">
                <Clock size={10} />
                <span>Timeline Active</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
