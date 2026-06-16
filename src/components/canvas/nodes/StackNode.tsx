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

  const isDarkTheme = settings.theme === 'dark' || settings.theme === 'cobalt' || settings.theme === 'slate';

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "group relative transition-all duration-300 rounded-none",
        isSticky 
          ? "w-48 h-48 bg-[#fffde7] border-[3px] border-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 rotate-1" 
          : isCircle 
            ? "w-36 h-36 rounded-full flex items-center justify-center text-center p-4 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black dark:text-white"
            : "w-64 bg-white dark:bg-[#181818] border-[3px] border-black dark:border-white p-0 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]",
        selected && !isSticky && !isCircle && (
          isDarkTheme 
            ? "shadow-[10px_10px_0px_0px_#fff] -translate-x-1 -translate-y-1 z-50" 
            : "shadow-[10px_10px_0px_0px_#000] -translate-x-1 -translate-y-1 z-50"
        ),
        selected && isSticky && "shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1 z-50",
        selected && isCircle && (
          isDarkTheme 
            ? "shadow-[10px_10px_0px_0px_#fff] -translate-x-1 -translate-y-1 z-50" 
            : "shadow-[10px_10px_0px_0px_#000] -translate-x-1 -translate-y-1 z-50"
        )
      )}
      style={isCircle ? { backgroundColor: data.color || settings.defaultColor } : {}}
    >
      {/* Delete Button */}
      {selected && (
        <button
          onClick={handleDelete}
          className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 border-2 border-black text-white flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] transition-all z-[100] rounded-none cursor-pointer"
        >
          <Trash2 size={12} />
        </button>
      )}

      {isSticky ? (
        <div className="h-full flex flex-col">
          <h3 className="font-mono font-black text-black/80 text-xs mb-2 uppercase tracking-widest border-b border-black pb-1">Note</h3>
          {selected ? (
            <textarea
              autoFocus
              className="bg-transparent border-none outline-none text-xs font-mono text-black leading-snug flex-1 resize-none"
              value={data.description}
              onChange={(e) => updateNodeData(id, { description: e.target.value })}
            />
          ) : (
            <p className="text-xs font-mono text-black leading-snug flex-1">
               {data.description}
            </p>
          )}
        </div>
      ) : isCircle ? (
        <div className="w-full h-full flex items-center justify-center">
          {selected ? (
            <input 
              autoFocus
              className="bg-transparent border-none outline-none text-center w-full font-mono font-black text-black/70 dark:text-white/70 uppercase text-[10px] tracking-widest"
              value={data.label}
              onChange={(e) => updateNodeData(id, { label: e.target.value })}
            />
          ) : (
            <span className="font-mono font-black text-black/70 dark:text-white/70 uppercase text-[10px] tracking-widest">{data.label}</span>
          )}
        </div>
      ) : (
        <>
          {/* Header */}
          <div className={cn(
            "p-3 flex items-center gap-2 border-b-[3px] border-black dark:border-white bg-[#f8f7f4] dark:bg-neutral-900 transition-colors",
            selected && "bg-brand-yellow/10"
          )}>
            <span 
              className="w-3.5 h-3.5 rounded-none flex-shrink-0 border-2 border-black dark:border-white shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#fff]"
              style={{ backgroundColor: data.color || settings.defaultColor }}
            />
            {selected ? (
              <input 
                autoFocus
                className="bg-transparent border-none outline-none text-xs font-mono font-black text-black dark:text-white w-full uppercase"
                value={data.label}
                onChange={(e) => updateNodeData(id, { label: e.target.value })}
              />
            ) : (
              <h3 className="text-xs font-mono font-black text-black dark:text-white truncate uppercase">{data.label}</h3>
            )}
            <span className="ml-auto text-[9px] font-mono font-black border-2 border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white px-2 py-0.5 rounded-none shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] uppercase">
              {data.category}
            </span>
          </div>

          {/* Body */}
          <div className="p-3 bg-white dark:bg-[#181818]">
            {selected ? (
              <textarea
                className="w-full text-[11px] font-mono font-bold text-black dark:text-white leading-relaxed mb-4 min-h-[36px] bg-slate-50 dark:bg-neutral-800 border-2 border-black dark:border-white p-1.5 rounded-none outline-none resize-none"
                value={data.description}
                onChange={(e) => updateNodeData(id, { description: e.target.value })}
              />
            ) : (
              <p className="text-[11px] font-mono text-black/60 dark:text-white/60 leading-relaxed mb-4 line-clamp-2 min-h-[36px]">
                {data.description || 'Define your tech stack components...'}
              </p>
            )}
            
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[9px] font-mono font-black text-black dark:text-white uppercase tracking-wider">
                <span>Implementation</span>
                <span className="bg-brand-yellow text-black border border-black px-1 font-mono font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-800 h-4 border-2 border-black dark:border-white overflow-hidden rounded-none">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-brand-yellow border-r-2 border-black dark:border-white"
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            {/* Todo List */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-[9px] font-mono font-black text-black dark:text-white uppercase tracking-wider">
                <span>Tasks</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const newTodos = [...(nodeData.todos || []), { id: Math.random().toString(36).substr(2, 9), text: 'NEW TASK', done: false }];
                    const doneCount = newTodos.filter(t => t.done).length;
                    const completion = Math.round((doneCount / newTodos.length) * 100);
                    updateNodeData(id, { todos: newTodos, completion });
                  }}
                  className="text-brand-yellow font-black hover:text-brand-yellow/80 transition-colors uppercase border-2 border-black dark:border-white bg-white dark:bg-neutral-900 px-1.5 py-0.5 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] transition-all cursor-pointer text-[8px]"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-1.5">
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
                        "w-4 h-4 rounded-none border-2 border-black dark:border-white flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]",
                        todo.done ? "bg-brand-yellow" : "bg-white dark:bg-neutral-800"
                      )}
                    >
                      {todo.done && <CheckCircle2 size={10} className="text-black font-black" />}
                    </button>
                    {selected ? (
                      <input
                        className={cn(
                          "text-[9px] font-mono bg-transparent border-b border-transparent focus:border-black dark:focus:border-white focus:outline-none flex-1 truncate font-bold text-black dark:text-white uppercase",
                          todo.done && "text-gray-text line-through"
                        )}
                        value={todo.text}
                        onChange={(e) => {
                          const newTodos = nodeData.todos.map((t: any) => 
                            t.id === todo.id ? { ...t, text: e.target.value.toUpperCase() } : t
                          );
                          updateNodeData(id, { todos: newTodos });
                        }}
                      />
                    ) : (
                      <span className={cn(
                        "text-[9px] font-mono text-black dark:text-white truncate flex-1 font-bold",
                        todo.done && "text-gray-text line-through opacity-60"
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
              <div className="space-y-1.5 mt-3 pt-3 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between text-[9px] font-mono font-black text-black dark:text-white uppercase tracking-wider">
                  <span className="flex items-center gap-1 text-gray-text"><Clock size={10} /> Timeline</span>
                  <span className="bg-slate-200 dark:bg-neutral-800 px-1 border border-black dark:border-white font-mono font-bold">{timeProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-neutral-800 h-2.5 border-2 border-black dark:border-white overflow-hidden rounded-none">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${timeProgress}%` }}
                    className="h-full bg-black/40 dark:bg-white/40 border-r-2 border-black dark:border-white rounded-none"
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )}

            {/* Date Controls */}
            {selected && !isSticky && !isCircle && (
              <div className="mt-4 pt-3 border-t-2 border-black dark:border-white flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col flex-1">
                    <label className="text-[7px] font-mono font-black text-gray-text uppercase">Start</label>
                    <input 
                      type="date"
                      className="text-[9px] font-mono bg-white dark:bg-neutral-800 border-2 border-black dark:border-white p-1 rounded-none text-black dark:text-white"
                      value={nodeData.startDate || ''}
                      onChange={(e) => updateNodeData(id, { startDate: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-[7px] font-mono font-black text-gray-text uppercase">Deadline</label>
                    <input 
                      type="date"
                      className="text-[9px] font-mono bg-white dark:bg-neutral-800 border-2 border-black dark:border-white p-1 rounded-none text-black dark:text-white"
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
      <Handle type="target" position={Position.Top} className="!bg-brand-yellow !border-2 !border-black dark:!border-white !w-3 !h-3 rounded-none shadow-none" />
      <Handle type="source" position={Position.Bottom} className="!bg-brand-yellow !border-2 !border-black dark:!border-white !w-3 !h-3 rounded-none shadow-none" />
      <Handle type="target" position={Position.Left} className="!bg-brand-yellow !border-2 !border-black dark:!border-white !w-3 !h-3 rounded-none shadow-none" />
      <Handle type="source" position={Position.Right} className="!bg-brand-yellow !border-2 !border-black dark:!border-white !w-3 !h-3 rounded-none shadow-none" />
    </motion.div>
  );
});
