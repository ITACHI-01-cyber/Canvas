import React from 'react';
import { Panel } from '@xyflow/react';
import { MousePointer2, Hand, Type, Square, Database, Globe, Hexagon, Shield, Circle, Shuffle, Share2, MessageSquare } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const CanvasToolbar: React.FC = () => {
  const { addNode } = useStore();

  const nodeTemplates = [
    { label: 'Frontend', category: 'Frontend', color: '#E8C832', icon: Globe, type: 'stackNode' },
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
  };

  const addTextNode = () => {
    const id = `text_${Date.now()}`;
    addNode({
      id,
      type: 'stackNode', // Using stackNode for now but we can style it differently
      position: { x: 300, y: 300 },
      data: {
        label: 'New Text',
        category: 'Text',
        color: '#333333',
        description: 'Double click to edit',
        isTextOnly: true
      },
    });
  };

  return (
    <Panel position="left" className="flex flex-col gap-2 p-1 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-xl shadow-lg overflow-hidden transition-colors">
      <div className="flex flex-col border-b border-black/5 dark:border-white/5 mb-1">
        <button className="p-3 bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow/20 transition-all" title="Select">
          <MousePointer2 size={20} />
        </button>
        <button className="p-3 opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all" title="Pan">
          <Hand size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-1 py-1">
        {nodeTemplates.map((template) => (
          <button
            key={`${template.category}-${template.label}`}
            onClick={() => handleAddNode(template)}
            className="p-3 opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all group relative"
            title={template.label}
          >
            <template.icon size={20} />
            <span className="absolute left-full ml-3 px-2 py-1 bg-dark-charcoal dark:bg-white dark:text-dark-charcoal text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {template.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col border-t border-black/5 dark:border-white/5 mt-1">
        <button onClick={addTextNode} className="p-3 opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all" title="Text">
          <Type size={20} />
        </button>
        <button 
          onClick={() => handleAddNode({ label: 'Square', category: 'Shape', color: '#f0f0f0', icon: Square, type: 'stackNode' })}
          className="p-3 opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all" 
          title="Square"
        >
          <Square size={20} />
        </button>
        <button 
           onClick={() => handleAddNode({ label: 'Circle', category: 'Shape', color: '#f0f0f0', icon: Circle, type: 'stackNode' })}
           className="p-3 opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all" 
           title="Circle"
        >
          <Circle size={20} />
        </button>
      </div>
    </Panel>
  );
};
