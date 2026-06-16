import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Search, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export const MobileNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, activeProject } = useStore();
  
  const [activeOverlay, setActiveOverlay] = useState<'search' | 'history' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine currently active tab based on route and overlay states
  let currentTab = 'home';
  if (activeOverlay === 'search') {
    currentTab = 'search';
  } else if (activeOverlay === 'history') {
    currentTab = 'history';
  } else if (location.pathname.startsWith('/projects/')) {
    currentTab = 'message';
  } else if (location.pathname === '/settings') {
    currentTab = 'user';
  }

  const tabs = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: Home, 
      color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-900/40', 
      action: () => { setActiveOverlay(null); navigate('/dashboard'); } 
    },
    { 
      id: 'message', 
      label: 'Message', 
      icon: MessageSquare, 
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40', 
      action: () => { 
        setActiveOverlay(null);
        if (activeProject) {
          navigate(`/projects/${activeProject._id}`);
        } else if (projects.length > 0) {
          navigate(`/projects/${projects[0]._id}`);
        } else {
          alert("Please select or create a whiteboard first!");
        }
      } 
    },
    { 
      id: 'search', 
      label: 'Search', 
      icon: Search, 
      color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-200 dark:border-teal-900/40', 
      action: () => setActiveOverlay(activeOverlay === 'search' ? null : 'search') 
    },
    { 
      id: 'history', 
      label: 'History', 
      icon: Clock, 
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40', 
      action: () => setActiveOverlay(activeOverlay === 'history' ? null : 'history') 
    },
    { 
      id: 'user', 
      label: 'User', 
      icon: User, 
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 border border-pink-200 dark:border-pink-900/40', 
      action: () => { setActiveOverlay(null); navigate('/settings'); } 
    },
  ];

  // Filtering projects for search overlay
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      {/* Floating Bottom Navigation Bar (Mobile only) */}
      <nav className="fixed bottom-6 inset-x-0 mx-auto w-[92%] max-w-sm bg-white dark:bg-[#151515] border-[3px] border-black dark:border-white rounded-full shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] z-45 p-1.5 flex items-center justify-between md:hidden transition-all duration-300 selection:bg-transparent">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={tab.action}
              className="relative flex-1 flex justify-center items-center py-2 transition-all outline-none"
            >
              {isActive ? (
                <motion.div
                  layoutId="activeTabHighlight"
                  className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[9px] font-black uppercase tracking-wider", tab.color)}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                >
                  <Icon size={13} className="shrink-0" />
                  <span>{tab.label}</span>
                </motion.div>
              ) : (
                <div className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors p-1.5">
                  <Icon size={15} />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Navigation Overlays */}
      <AnimatePresence>
        {/* Search Overlay */}
        {activeOverlay === 'search' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed inset-0 z-50 md:hidden flex flex-col bg-[#ebdcb9] dark:bg-[#121212] p-6 pb-24"
          >
            <div className="flex items-center justify-between mb-6 border-b-[3px] border-black dark:border-white pb-3">
              <h2 className="font-display font-black text-base uppercase tracking-wider text-black dark:text-white">Search Boards</h2>
              <button 
                onClick={() => setActiveOverlay(null)}
                className="p-1 px-2 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-mono font-black text-xs rounded-none shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
              >
                CLOSE
              </button>
            </div>
            
            <input
              type="text"
              placeholder="SEARCH WORKSPACES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-[3px] border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white px-4 py-3 text-xs font-mono font-bold outline-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-8 uppercase"
              autoFocus
            />
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredProjects.map((p) => (
                <div 
                  key={p._id}
                  onClick={() => {
                    setActiveOverlay(null);
                    navigate(`/projects/${p._id}`);
                  }}
                  className="p-4 bg-white dark:bg-neutral-900 border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] cursor-pointer hover:bg-brand-yellow/10 transition-colors uppercase font-mono text-xs font-bold"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="truncate flex-1 pr-4 text-black dark:text-white">{p.name}</span>
                    <span className="text-[9px] font-black bg-brand-yellow border border-black px-1 text-black shrink-0">{p.type}</span>
                  </div>
                  {p.description && <p className="text-[9px] opacity-60 truncate normal-case text-gray-text dark:text-neutral-400 mt-1">{p.description}</p>}
                </div>
              ))}
              {filteredProjects.length === 0 && (
                <div className="text-center py-10 font-mono text-xs opacity-50 italic text-black dark:text-white">No workspaces found.</div>
              )}
            </div>
          </motion.div>
        )}

        {/* History Drawer */}
        {activeOverlay === 'history' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/40 backdrop-blur-xs"
          >
            <div 
              className="absolute inset-0" 
              onClick={() => setActiveOverlay(null)} 
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 max-h-[75vh] flex flex-col bg-[#ebdcb9] dark:bg-[#121212] border-t-[3px] border-black dark:border-white p-6 pb-28 shadow-[0_-8px_20px_rgba(0,0,0,0.15)]"
            >
              <div className="flex items-center justify-between mb-6 border-b-[3px] border-black dark:border-white pb-3">
                <div className="flex flex-col">
                  <h2 className="font-display font-black text-base uppercase tracking-wider text-black dark:text-white">Recent Boards</h2>
                  <span className="text-[9px] font-mono opacity-60 text-black dark:text-white uppercase tracking-widest">Activity History Log</span>
                </div>
                <button 
                  onClick={() => setActiveOverlay(null)}
                  className="p-1 px-2 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-mono font-black text-xs rounded-none shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
                >
                  CLOSE
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {[...projects]
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .map((p) => (
                    <div 
                      key={p._id}
                      onClick={() => {
                        setActiveOverlay(null);
                        navigate(`/projects/${p._id}`);
                      }}
                      className="p-4 bg-white dark:bg-neutral-900 border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] cursor-pointer hover:bg-brand-yellow/10 transition-colors flex justify-between items-center font-mono text-xs font-bold uppercase"
                    >
                      <div className="truncate flex-1 pr-4">
                        <span className="text-black dark:text-white">{p.name}</span>
                        <p className="text-[8px] opacity-50 lowercase normal-case mt-0.5 text-gray-text dark:text-neutral-400">
                          Updated {formatDistanceToNow(new Date(p.updatedAt), { addSuffix: true })}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 bg-brand-yellow border border-black text-black shrink-0">{p.completionPercent}%</span>
                    </div>
                  ))}
                {projects.length === 0 && (
                  <div className="text-center py-10 font-mono text-xs opacity-50 italic text-black dark:text-white">No board history logs.</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
