import React, { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useStore } from '../store/useStore';
import { Plus, Folder, Clock, Trash2, ArrowUpRight, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const { projects, fetchProjects, isLoading, createProject, deleteProject } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', type: 'Web App', otherTypeDescription: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      ...newProject,
      type: newProject.type === 'Other' ? newProject.otherTypeDescription : newProject.type
    };
    const project = await createProject(projectData);
    setShowModal(false);
    navigate(`/projects/${project._id}`);
  };

  const handleClone = async (project: any) => {
    const cloneData = {
      ...project,
      name: `${project.name} (Copy)`,
      _id: undefined,
      createdAt: undefined,
      updatedAt: undefined
    };
    const newProj = await createProject(cloneData);
    navigate(`/projects/${newProj._id}`);
  };

  return (
    <AppShell>
      <div className="p-8 max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-display font-bold mb-2">My Whiteboards</h2>
            <p className="opacity-70">Overview of all your brainstormed projects</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-brand-yellow text-dark-charcoal font-bold rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <Plus size={20} />
            New Project
          </button>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-50">
             <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin mb-4" />
             <p className="font-medium animate-pulse">Loading architecture...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white/40 dark:bg-black/20 backdrop-blur-md border border-dashed border-black/10 dark:border-white/10 rounded-3xl">
            <div className="w-20 h-20 bg-brand-yellow/10 rounded-full flex items-center justify-center mb-6">
              <Folder className="text-brand-yellow" size={40} />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">No whiteboards yet</h3>
            <p className="text-gray-text mb-8 max-w-md mx-auto">
              Ready to start brainstorming? Create your first whiteboard to begin visually mapping your ideas.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-4 bg-dark-charcoal text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl"
            >
              Start Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {projects.map((project: any) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-white/80 dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white dark:bg-white/10 border border-black/5 dark:border-white/5 rounded-2xl shadow-sm group-hover:bg-brand-yellow group-hover:border-brand-yellow transition-all duration-300">
                      <Folder className="group-hover:text-dark-charcoal transition-colors" size={24} />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleClone(project)}
                        className="p-2 opacity-60 hover:opacity-100 hover:text-brand-yellow transition-all"
                        title="Clone Project"
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={() => deleteProject(project._id)}
                        className="p-2 opacity-60 hover:opacity-100 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/projects/${project._id}`)}
                        className="p-2 opacity-60 hover:opacity-100 transition-all"
                      >
                        <ArrowUpRight size={22} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-bold mb-2 truncate">{project.name}</h3>
                  <p className="opacity-60 text-sm mb-6 line-clamp-2 min-h-[40px]">
                    {project.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.completionPercent}%` }}
                        className="h-full bg-brand-yellow shadow-[0_0_10px_rgba(232,200,50,0.4)]"
                      />
                    </div>
                    <span className="text-xs font-bold">{project.completionPercent}%</span>
                  </div>

                  <div className="flex flex-col gap-2 pt-4 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 opacity-60">
                        <Clock size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                        </span>
                      </div>
                      <span className="px-2 py-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded text-[10px] font-bold opacity-70 uppercase tracking-widest leading-none">
                        {project.type}
                      </span>
                    </div>
                    {project.createdAt && (
                      <div className="flex items-center gap-2 text-gray-text/60">
                        <span className="text-[9px] font-medium">Started on: {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white text-dark-charcoal w-full max-w-lg p-8 rounded-3xl shadow-2xl border border-black/10"
          >
            <h2 className="text-2xl font-display font-bold mb-6">New Whiteboard</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-dark-charcoal/60 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-black/5 bg-black/5 text-dark-charcoal focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 transition-all font-medium"
                    placeholder="e.g. E-Commerce Platform"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-dark-charcoal/60 mb-2">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-black/5 bg-black/5 text-dark-charcoal focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 transition-all font-medium resize-none"
                    rows={3}
                    placeholder="Brief summary of the architecture goals"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-dark-charcoal/60 mb-2">Project Type</label>
                    <select
                      value={newProject.type}
                      onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-black/5 bg-black/5 text-dark-charcoal focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 transition-all font-medium appearance-none"
                    >
                      <option>Web App</option>
                      <option>Mobile App</option>
                      <option>API</option>
                      <option>ML Service</option>
                      <option>Infrastructure</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  {newProject.type === 'Other' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label className="block text-xs font-bold uppercase tracking-wider text-dark-charcoal/60 mb-2">Custom Type Description</label>
                      <input
                        type="text"
                        value={newProject.otherTypeDescription}
                        onChange={(e) => setNewProject({ ...newProject, otherTypeDescription: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-black/5 bg-black/5 text-dark-charcoal focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 transition-all font-medium"
                        placeholder="e.g. Game Engine Design"
                        required={newProject.type === 'Other'}
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-dark-charcoal/60 font-bold hover:bg-black/5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-brand-yellow text-dark-charcoal font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  Create Board
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AppShell>
  );
}
