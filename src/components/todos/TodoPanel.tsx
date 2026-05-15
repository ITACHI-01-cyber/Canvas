import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { motion } from 'motion/react';
import { X, Plus, Trash2, CheckCircle2, Circle, Clock, Tag, MessageSquare, Share2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TodoPanelProps {
  nodeId: string;
  onClose: () => void;
}

export const TodoPanel: React.FC<TodoPanelProps> = ({ nodeId, onClose }) => {
  const activeProject = useStore((state) => state.activeProject);
  const updateNodeData = useStore((state) => state.updateNodeData);
  const [newTodo, setNewTodo] = useState('');

  const node = activeProject?.nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const data = node.data as any;
  const todos = data.todos || [];

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    const updatedTodos = [...todos, { id: `todo_${Date.now()}`, text: newTodo, done: false, priority: 'medium' }];
    updateNodeData(nodeId, { todos: updatedTodos });
    setNewTodo('');
  };

  const toggleTodo = (todoId: string) => {
    const updatedTodos = todos.map((t: any) =>
      t.id === todoId ? { ...t, done: !t.done } : t
    );
    updateNodeData(nodeId, { todos: updatedTodos });
  };

  const removeTodo = (todoId: string) => {
    const updatedTodos = todos.filter((t: any) => t.id !== todoId);
    updateNodeData(nodeId, { todos: updatedTodos });
  };

  const doneCount = todos.filter((t: any) => t.done).length;
  const progress = todos.length > 0 ? Math.round((doneCount / todos.length) * 100) : 0;

  return (
    <motion.aside
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 w-[400px] h-full bg-card-warm border-l border-gray-border shadow-2xl z-40 flex flex-col"
    >
      <header className="p-6 border-b border-gray-border flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-yellow/20">
             <Tag size={18} style={{ color: data.color }} />
           </div>
           <div>
             <h2 className="font-display font-bold text-lg">{data.label}</h2>
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-text">{data.category} Layer</span>
           </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-text hover:text-dark-charcoal"
        >
          <X size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Progress Card */}
        <div className="bg-white border border-gray-border rounded-2xl p-5 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <span className="text-xs font-bold uppercase tracking-wider text-gray-text">Project Progress</span>
             <span className="text-sm font-bold text-dark-charcoal">{progress}%</span>
           </div>
           <div className="h-2 bg-black/5 rounded-full overflow-hidden">
             <motion.div
               animate={{ width: `${progress}%` }}
               className="h-full"
               style={{ backgroundColor: data.color || '#E8C832' }}
             />
           </div>
           <div className="mt-4 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-bg-warm" />
                ))}
              </div>
              <span className="text-[10px] font-bold text-gray-text uppercase">Architects assigned</span>
           </div>
        </div>

        {/* Task List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base">Implementation Tasks</h3>
            <span className="px-2 py-0.5 bg-brand-yellow/15 text-dark-charcoal rounded text-[10px] font-bold">{todos.length}</span>
          </div>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
              placeholder="Add next architectural task..."
              className="flex-1 bg-white border border-gray-border px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 transition-all"
            />
            <button
              onClick={handleAddTodo}
              className="p-3 bg-dark-charcoal text-white rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {todos.map((todo: any) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "group flex items-center gap-3 p-4 bg-white border border-gray-border rounded-2xl transition-all hover:shadow-md",
                  todo.done && "opacity-60"
                )}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={cn(
                    "shrink-0 transition-colors",
                    todo.done ? "text-green-500" : "text-gray-text"
                  )}
                >
                  {todo.done ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </button>
                <span className={cn(
                  "flex-1 text-sm font-medium transition-all",
                  todo.done && "line-through grayscale"
                )}>
                  {todo.text}
                </span>
                <button
                  onClick={() => removeTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
            {todos.length === 0 && (
              <div className="text-center py-8 bg-black/2 rounded-2xl border border-dashed border-gray-border">
                <p className="text-xs font-medium text-gray-text italic">No tasks listed for this layer.</p>
              </div>
            )}
          </div>
        </section>

        {/* Metadata */}
        <section className="space-y-4 pt-6 border-t border-gray-border">
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-white border border-gray-border flex items-center justify-center text-gray-text">
               <Clock size={16} />
             </div>
             <div className="flex-1">
               <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-text">Deadline</label>
               <p className="text-sm font-bold">Aug 24, 2026</p>
             </div>
           </div>
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-white border border-gray-border flex items-center justify-center text-gray-text">
               <MessageSquare size={16} />
             </div>
             <div className="flex-1">
               <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-text">Notes</label>
               <input
                 type="text"
                 placeholder="Add architectural notes..."
                 className="w-full text-sm font-medium focus:outline-none bg-transparent"
               />
             </div>
           </div>
        </section>
      </div>

      <footer className="p-6 border-t border-gray-border bg-white">
        <button 
          onClick={() => {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard! You can now share this whiteboard with anyone.');
          }}
          className="w-full py-3 bg-brand-yellow text-dark-charcoal font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
        >
          <Share2 size={18} />
          Share Whiteboard
        </button>
      </footer>
    </motion.aside>
  );
};
