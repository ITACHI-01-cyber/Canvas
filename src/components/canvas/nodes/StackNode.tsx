import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, MoreHorizontal, Layout, Trash2, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useStore } from '../../../store/useStore';

export const StackNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const settings = useStore((state) => state.settings);
  const nodeData = data as any;
  const totalTodos = nodeData.todos?.length || 0;
  const doneTodos = nodeData.todos?.filter((t: any) => t.done).length || 0;
  const progress = totalTodos > 0 ? Math.round((doneTodos / totalTodos) * 100) : 0;
  
  const calculateTimeProgress = () => {
    if (!nodeData.startDate || !nodeData.deadline) return null;
    const start = new Date(nodeData.startDate).getTime();
    const end = new Date(nodeData.deadline).getTime();
    const now = new Date().getTime();
    
    if (end <= start) return 100;
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };
  
  const timeProgress = calculateTimeProgress();

  const isTextOnly = nodeData.isTextOnly;
  const isSticky = nodeData.isSticky;
  const isCircle = nodeData.category === 'Shape' && nodeData.label === 'Circle';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nodes = useStore.getState().activeProject?.nodes || [];
    const setNodes = useStore.getState().setNodes;
    setNodes(nodes.filter((n) => n.id !== id));
  };

  if (isTextOnly) {
    return (
      <div className={cn(
        "min-w-[100px] p-2 font-medium text-lg text-center transition-colors",
        settings.theme === 'dark' ? "text-white" : "text-dark-charcoal",
        selected && "ring-2 ring-brand-yellow rounded bg-white/10"
      )}>
        {selected ? (
          <input 
            autoFocus
            className="bg-transparent border-none outline-none text-center w-full"
            value={data.label}
            onChange={(e) => updateNodeData(id, { label: e.target.value })}
          />
        ) : (
          data.label
        )}
        <Handle type="target" position={Position.Top} className="opacity-0" />
        <Handle type="source" position={Position.Bottom} className="opacity-0" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "group relative transition-all duration-300",
        isSticky ? "w-48 h-48 bg-[#fff9c4] shadow-md border-none p-4 rotate-1" : 
        isCircle ? "w-32 h-32 rounded-full flex items-center justify-center text-center p-4 border" :
        "w-64 bg-white rounded-xl shadow-node border p-0",
        selected ? "ring-4 ring-brand-yellow/30 z-50 shadow-lift" : "border-black/5"
      )}
      style={isCircle ? { backgroundColor: data.color || settings.defaultColor, borderColor: 'rgba(0,0,0,0.1)' } : {}}
    >
      {/* Delete Button */}
      {selected && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-[100]"
        >
          <Trash2 size={12} />
        </button>
      )}

      {isSticky ? (
        <div className="h-full flex flex-col">
          <h3 className="font-display font-bold text-dark-charcoal/80 text-sm mb-2 uppercase tracking-tighter">Note</h3>
          {selected ? (
            <textarea
              autoFocus
              className="bg-transparent border-none outline-none text-sm italic text-dark-charcoal/70 leading-snug flex-1 resize-none"
              value={data.description}
              onChange={(e) => updateNodeData(id, { description: e.target.value })}
            />
          ) : (
            <p className="text-sm italic text-dark-charcoal/70 leading-snug flex-1">
               {data.description}
            </p>
          )}
        </div>
      ) : isCircle ? (
        <div className="w-full h-full flex items-center justify-center">
          {selected ? (
            <input 
              autoFocus
              className="bg-transparent border-none outline-none text-center w-full font-bold text-dark-charcoal/60 uppercase text-[10px] tracking-widest"
              value={data.label}
              onChange={(e) => updateNodeData(id, { label: e.target.value })}
            />
          ) : (
            <span className="font-bold text-dark-charcoal/60 uppercase text-[10px] tracking-widest">{data.label}</span>
          )}
        </div>
      ) : (
        <>
          {/* Header */}
          <div className={cn(
            "p-3 flex items-center gap-2 border-b border-black/5 rounded-t-xl transition-colors",
            selected && "bg-brand-yellow/5"
          )}>
            <span 
              className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
              style={{ backgroundColor: data.color || settings.defaultColor }}
            />
            {selected ? (
              <input 
                autoFocus
                className="bg-transparent border-none outline-none text-sm font-bold text-dark-charcoal w-full"
                value={data.label}
                onChange={(e) => updateNodeData(id, { label: e.target.value })}
              />
            ) : (
              <h3 className="text-sm font-bold text-dark-charcoal truncate">{data.label}</h3>
            )}
            <span className="ml-auto text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-text font-medium uppercase tracking-tight">
              {data.category}
            </span>
          </div>

          {/* Body */}
          <div className="p-3">
            {selected ? (
              <textarea
                className="w-full text-[11px] text-gray-500 leading-relaxed mb-4 min-h-[32px] bg-transparent border-none outline-none resize-none"
                value={data.description}
                onChange={(e) => updateNodeData(id, { description: e.target.value })}
              />
            ) : (
              <p className="text-[11px] text-gray-500 leading-relaxed mb-4 line-clamp-2 min-h-[32px]">
                {data.description || 'Define your tech stack components...'}
              </p>
            )}
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-dark-charcoal/80 uppercase tracking-tight">
                <span>Implementation</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: data.color || settings.defaultColor }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            {/* Todo List */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-dark-charcoal/80 uppercase tracking-tight">
                <span>Components / Tasks</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const newTodos = [...(nodeData.todos || []), { id: Math.random().toString(36).substr(2, 9), text: 'New Task', done: false }];
                    const doneCount = newTodos.filter(t => t.done).length;
                    const completion = Math.round((doneCount / newTodos.length) * 100);
                    updateNodeData(id, { todos: newTodos, completion });
                  }}
                  className="text-brand-yellow hover:text-brand-yellow/80 transition-colors"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-1">
                {(nodeData.todos || []).map((todo: any) => (
                  <div key={todo.id} className="flex items-center gap-2 group/todo">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newTodos = nodeData.todos.map((t: any) => 
                          t.id === todo.id ? { ...t, done: !t.done } : t
                        );
                        const doneCount = newTodos.filter((t: any) => t.done).length;
                        const completion = Math.round((doneCount / newTodos.length) * 100);
                        updateNodeData(id, { todos: newTodos, completion });
                      }}
                      className={cn(
                        "w-3 h-3 rounded-sm border flex-shrink-0 flex items-center justify-center transition-colors",
                        todo.done ? "bg-brand-yellow border-brand-yellow" : "border-black/10 hover:border-brand-yellow"
                      )}
                    >
                      {todo.done && <CheckCircle2 size={10} className="text-white" />}
                    </button>
                    {selected ? (
                      <input
                        className={cn(
                          "text-[10px] bg-transparent border-none outline-none flex-1 truncate",
                          todo.done && "text-gray-text line-through"
                        )}
                        value={todo.text}
                        onChange={(e) => {
                          const newTodos = nodeData.todos.map((t: any) => 
                            t.id === todo.id ? { ...t, text: e.target.value } : t
                          );
                          updateNodeData(id, { todos: newTodos });
                        }}
                      />
                    ) : (
                      <span className={cn(
                        "text-[10px] text-dark-charcoal truncate flex-1",
                        todo.done && "text-gray-text line-through"
                      )}>
                        {todo.text}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Time Progress Bar */}
            {timeProgress !== null && (
              <div className="space-y-1.5 mt-3">
                <div className="flex items-center justify-between text-[10px] font-bold tracking-tight opacity-50">
                  <span className="flex items-center gap-1 text-gray-text"><Clock size={10} /> Timeline</span>
                  <span>{timeProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${timeProgress}%` }}
                    className="h-full bg-current opacity-20 rounded-full"
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )}

            {/* Date Controls */}
            {selected && !isSticky && !isCircle && (
              <div className="mt-4 pt-3 border-t border-black/5 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col flex-1">
                    <label className="text-[8px] font-bold text-gray-text uppercase">Start</label>
                    <input 
                      type="date"
                      className="text-[10px] bg-bg-warm border-none outline-none rounded p-1 text-dark-charcoal"
                      value={nodeData.startDate || ''}
                      onChange={(e) => updateNodeData(id, { startDate: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-[8px] font-bold text-gray-text uppercase">Deadline</label>
                    <input 
                      type="date"
                      className="text-[10px] bg-bg-warm border-none outline-none rounded p-1 text-dark-charcoal"
                      value={nodeData.deadline || ''}
                      onChange={(e) => updateNodeData(id, { deadline: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} className="!bg-brand-yellow !border-white !w-2 !h-2 shadow-sm" />
      <Handle type="source" position={Position.Bottom} className="!bg-brand-yellow !border-white !w-2 !h-2 shadow-sm" />
      <Handle type="target" position={Position.Left} className="!bg-brand-yellow !border-white !w-2 !h-2 shadow-sm" />
      <Handle type="source" position={Position.Right} className="!bg-brand-yellow !border-white !w-2 !h-2 shadow-sm" />
    </motion.div>
  );
});
