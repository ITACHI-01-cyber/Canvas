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
      className="absolute top-0 right-0 w-full sm:w-[400px] h-full bg-white border-l-[3px] border-black shadow-[-8px_0px_0px_0px_rgba(0,0,0,0.15)] z-40 flex flex-col"
    >
      <header className="p-6 border-b-[3px] border-black flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
           <div 
             className="w-9 h-9 border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]"
             style={{ backgroundColor: data.color || '#ff6f3c' }}
           >
             <Tag size={16} className="text-black" />
           </div>
           <div>
             <h2 className="font-display font-black text-sm text-black uppercase">{data.label}</h2>
             <span className="text-[9px] font-mono font-black uppercase tracking-widest text-gray-text">{data.category} Layer</span>
           </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-colors text-black rounded-none shadow-[2px_2px_0px_0px_#000] cursor-pointer"
        >
          <X size={14} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Progress Card */}
        <div className="bg-white border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_#000] rounded-none">
           <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
             <span className="text-[10px] font-mono font-black uppercase tracking-wider text-black">Progress Status</span>
             <span className="text-xs font-mono font-black bg-brand-yellow border border-black px-1 text-black">{progress}%</span>
           </div>
           <div className="h-4 bg-slate-100 border-2 border-black rounded-none overflow-hidden">
             <motion.div
               animate={{ width: `${progress}%` }}
               className="h-full bg-brand-yellow border-r-2 border-black"
             />
           </div>
           <div className="mt-4 flex items-center gap-4">
              <div className="flex -space-x-1.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 border-2 border-black bg-slate-100 rounded-none shadow-[1px_1px_0px_0px_#000]" />
                ))}
              </div>
              <span className="text-[8px] font-mono font-black text-gray-text uppercase">CONTRIBUTORS ASSIGNED</span>
           </div>
        </div>

        {/* Task List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono font-black text-xs uppercase tracking-wider text-black">Implementation Tasks</h3>
            <span className="px-2 py-0.5 bg-brand-yellow text-black border-2 border-black text-[9px] font-mono font-black">{todos.length}</span>
          </div>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
              placeholder="ADD TASK INSTRUCTION..."
              className="flex-1 bg-white border-[3px] border-black px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:bg-brand-yellow/10 transition-colors rounded-none shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#000]"
            />
            <button
              onClick={handleAddTodo}
              className="p-3 bg-black text-white hover:bg-brand-yellow hover:text-black border-[3px] border-black transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000] rounded-none cursor-pointer flex items-center justify-center"
            >
              <Plus size={16} />
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
                  "group flex items-center gap-3 p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] rounded-none transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000]",
                  todo.done && "opacity-75 bg-slate-50"
                )}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={cn(
                    "w-5 h-5 rounded-none border-2 border-black flex items-center justify-center transition-colors cursor-pointer shadow-[1px_1px_0px_0px_#000]",
                    todo.done ? "bg-green-500 text-white" : "bg-white"
                  )}
                >
                  {todo.done && <CheckCircle2 size={12} className="text-black font-black" />}
                </button>
                <span className={cn(
                  "flex-1 text-xs font-mono font-bold uppercase transition-all text-black",
                  todo.done && "line-through opacity-50"
                )}>
                  {todo.text}
                </span>
                <button
                  onClick={() => removeTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 border border-black bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-none transition-all cursor-pointer shadow-[1.5px_1.5px_0px_0px_#000]"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))}
            {todos.length === 0 && (
              <div className="text-center py-8 bg-[#f5f4f0] border-2 border-dashed border-black">
                <p className="text-[10px] font-mono font-bold text-gray-text uppercase italic">No tasks listed for this layer.</p>
              </div>
            )}
          </div>
        </section>

        {/* Metadata */}
        <section className="space-y-4 pt-6 border-t-[3px] border-black">
           <div className="flex items-center gap-4">
             <div className="w-9 h-9 border-2 border-black bg-white flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000] rounded-none">
               <Clock size={14} />
             </div>
             <div className="flex-1">
               <label className="block text-[8px] font-mono font-black uppercase tracking-wider text-gray-text">Deadline</label>
               <p className="text-xs font-mono font-black uppercase text-black">Aug 24, 2026</p>
             </div>
           </div>
           <div className="flex items-center gap-4">
             <div className="w-9 h-9 border-2 border-black bg-white flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000] rounded-none">
               <MessageSquare size={14} />
             </div>
             <div className="flex-1">
               <label className="block text-[8px] font-mono font-black uppercase tracking-wider text-gray-text">Notes</label>
               <input
                 type="text"
                 placeholder="ADD NOTE RECORD..."
                 className="w-full text-xs font-mono font-bold uppercase focus:outline-none bg-transparent border-b border-black/10 focus:border-black"
               />
             </div>
           </div>
        </section>
      </div>

      <footer className="p-6 border-t-[3px] border-black bg-white">
        <button 
          onClick={() => {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            alert('Share link copied!');
          }}
          className="w-full py-3 bg-brand-yellow text-black border-[3px] border-black font-mono font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0px_0px_#000] transition-all cursor-pointer flex items-center justify-center gap-2 rounded-none"
        >
          <Share2 size={14} />
          Share Whiteboard
        </button>
      </footer>
    </motion.aside>
  );
};
