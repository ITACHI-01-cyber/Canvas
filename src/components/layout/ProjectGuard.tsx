import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileJson, ArrowRight, ShieldAlert } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const ProjectGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const activeProject = useStore((state) => state.activeProject);
  const importProject = useStore((state) => state.importProject);
  const createProject = useStore((state) => state.createProject);
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

  return (
    <div className="relative w-full h-full min-h-screen">
      <AnimatePresence mode="wait">
        {!activeProject ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark-charcoal flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full">
              <div className="bg-card-warm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-yellow"></div>
                
                <div className="mb-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center text-brand-yellow mb-4">
                    <ShieldAlert size={32} />
                  </div>
                  <h1 className="text-2xl font-bold text-dark-charcoal mb-2">Project Key Required</h1>
                  <p className="text-gray-text text-sm">
                    This is a pure frontend workspace. To continue, please upload your project backup file (.json).
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-dark-charcoal text-white rounded-xl font-bold hover:bg-black transition-all group"
                  >
                    <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
                    Upload Project File
                  </button>
                  
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card-warm px-2 text-gray-400 font-bold">Or Start Fresh</span>
                    </div>
                  </div>

                  <button
                    onClick={() => createProject({ name: 'New Workspace' })}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-dark-charcoal/10 text-dark-charcoal rounded-xl font-bold hover:bg-white transition-all text-sm"
                  >
                    Create New Project <ArrowRight size={16} />
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json"
                  className="hidden"
                />

                <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-3">
                  <FileJson size={24} className="text-gray-400" />
                  <div className="text-[10px] text-gray-500 leading-tight">
                    <p className="font-bold uppercase mb-0.5">Privacy Guaranteed</p>
                    <p>No data leaves your browser. All processing and storage happens locally on your device.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
