import React, { useState } from 'react';
import { Panel } from '@xyflow/react';
import { MousePointer2, Hand, Type, Square, Database, Globe, Hexagon, Shield, Circle, Shuffle, Share2, MessageSquare, MoreHorizontal, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export const CanvasToolbar: React.FC = () => {
  const { addNode } = useStore();
  const [isMobile, setIsMobile] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nodeTemplates = [
    { label: 'Frontend', category: 'Frontend', color: '#ff6f3c', icon: Globe, type: 'stackNode' },
    { label: 'Backend', category: 'Backend', color: '#4f98a3', icon: Hexagon, type: 'stackNode' },
    { label: 'Database', category: 'Database', color: '#6daa45', icon: Database, type: 'stackNode' },
    { label: 'Load Balancer', category: 'DevOps', color: '#FF5722', icon: Shuffle, type: 'stackNode' },
    { label: 'API Gateway', category: 'DevOps', color: '#2196F3', icon: Share2, type: 'stackNode' },
    { label: 'Message Queue', category: 'Infrastructure', color: '#673AB7', icon: MessageSquare, type: 'stackNode' },
    { label: 'Auth', category: 'Auth', color: '#a86fdf', icon: Shield, type: 'stackNode' },
    { label: 'Sticky Note', category: 'Note', color: '#fff9c4', icon: Square, type: 'stackNode', isSticky: true },
  ];

  const handleAddNode = (template: any) => {
    const id = `node_${Date.now()}`;
    addNode({
      id,
      type: template.type || 'stackNode',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        label: template.label,
        category: template.category,
        color: template.color,
        description: template.isSticky ? 'Add your notes here...' : 'New Layer Description',
        todos: [],
        progress: 0,
        isSticky: template.isSticky
      },
    });
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const addTextNode = () => {
    const id = `text_${Date.now()}`;
    addNode({
      id,
      type: 'stackNode',
      position: { x: 300, y: 300 },
      data: {
        label: 'New Text',
        category: 'Text',
        color: '#333333',
        description: 'Double click to edit',
        isTextOnly: true
      },
    });
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const addShapeNode = (shapeType: 'Square' | 'Circle') => {
    const isSquare = shapeType === 'Square';
    handleAddNode({
      label: shapeType,
      category: 'Shape',
      color: '#f0f0f0',
      icon: isSquare ? Square : Circle,
      type: 'stackNode'
    });
  };

  // Render for desktop toolbar
  if (!isMobile) {
    return (
      <Panel 
        position="left" 
        className="flex flex-col bg-white dark:bg-[#151515] border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] rounded-none transition-colors !m-6 shrink-0 p-0"
      >
        <div className="flex flex-col border-b-[3px] border-black dark:border-white">
          <button className="p-2.5 bg-brand-yellow text-black hover:bg-brand-yellow/90 transition-all cursor-pointer rounded-none border-none outline-none shrink-0" title="Select">
            <MousePointer2 size={18} />
          </button>
          <button className="p-2.5 text-black dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all cursor-pointer rounded-none border-none outline-none shrink-0" title="Pan">
            <Hand size={18} />
          </button>
        </div>

        <div className="flex flex-col border-b-[3px] border-black dark:border-white py-1">
          {nodeTemplates.map((template) => (
            <button
              key={`${template.category}-${template.label}`}
              onClick={() => handleAddNode(template)}
              className="p-2.5 text-black dark:text-white hover:bg-brand-yellow hover:text-black dark:hover:text-black transition-all group relative cursor-pointer flex items-center justify-center rounded-none border-none outline-none shrink-0"
              title={template.label}
            >
              <template.icon size={18} />
              <span className="absolute left-full ml-4 px-2 py-1 bg-white dark:bg-black text-black dark:text-white text-[9px] font-mono font-black border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 rounded-none uppercase">
                {template.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col">
          <button onClick={addTextNode} className="p-2.5 text-black dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center rounded-none border-none outline-none shrink-0" title="Text">
            <Type size={18} />
          </button>
          <button 
            onClick={() => addShapeNode('Square')}
            className="p-2.5 text-black dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center rounded-none border-none outline-none shrink-0" 
            title="Square"
          >
            <Square size={18} />
          </button>
          <button 
             onClick={() => addShapeNode('Circle')}
             className="p-2.5 text-black dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center rounded-none border-none outline-none shrink-0" 
             title="Circle"
          >
            <Circle size={18} />
          </button>
        </div>
      </Panel>
    );
  }

  // Mobile Collapsible Toolbar
  return (
    <Panel 
      position="bottom-center" 
      className="!m-0 !bottom-28 md:hidden flex flex-col items-center pointer-events-auto"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 bg-black/20 backdrop-blur-xs md:hidden" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="relative z-20 flex flex-col items-center">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute bottom-full mb-3 w-48 max-h-[50vh] overflow-y-auto bg-white dark:bg-neutral-900 border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] flex flex-col rounded-none scrollbar-thin"
            >
              {nodeTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <button
                    key={`${template.category}-${template.label}`}
                    onClick={() => handleAddNode(template)}
                    className="flex items-center gap-3 px-4 py-2.5 text-left border-b-2 last:border-b-0 border-black dark:border-white hover:bg-brand-yellow hover:text-black dark:hover:text-black text-black dark:text-white transition-colors font-mono text-xs font-black uppercase tracking-wider rounded-none outline-none border-none cursor-pointer"
                  >
                    <Icon size={16} className="shrink-0" />
                    <span>{template.label}</span>
                  </button>
                );
              })}

              <button
                onClick={addTextNode}
                className="flex items-center gap-3 px-4 py-2.5 text-left border-b-2 last:border-b-0 border-black dark:border-white hover:bg-brand-yellow hover:text-black dark:hover:text-black text-black dark:text-white transition-colors font-mono text-xs font-black uppercase tracking-wider rounded-none outline-none border-none cursor-pointer"
              >
                <Type size={16} className="shrink-0" />
                <span>Text</span>
              </button>

              <button
                onClick={() => addShapeNode('Square')}
                className="flex items-center gap-3 px-4 py-2.5 text-left border-b-2 last:border-b-0 border-black dark:border-white hover:bg-brand-yellow hover:text-black dark:hover:text-black text-black dark:text-white transition-colors font-mono text-xs font-black uppercase tracking-wider rounded-none outline-none border-none cursor-pointer"
              >
                <Square size={16} className="shrink-0" />
                <span>Square</span>
              </button>

              <button
                onClick={() => addShapeNode('Circle')}
                className="flex items-center gap-3 px-4 py-2.5 text-left hover:bg-brand-yellow hover:text-black dark:hover:text-black text-black dark:text-white transition-colors font-mono text-xs font-black uppercase tracking-wider rounded-none outline-none border-none cursor-pointer"
              >
                <Circle size={16} className="shrink-0" />
                <span>Circle</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 flex items-center justify-center bg-brand-yellow border-[3px] border-black dark:border-white text-black shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer rounded-full outline-none focus:outline-none"
          title="Add Node"
        >
          {isOpen ? <X size={20} className="stroke-[3]" /> : <MoreHorizontal size={20} className="stroke-[3]" />}
        </button>
      </div>
    </Panel>
  );
};
