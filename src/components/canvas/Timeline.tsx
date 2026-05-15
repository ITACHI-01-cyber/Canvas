import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { format, addMonths, differenceInDays } from 'date-fns';

export const Timeline: React.FC = () => {
  const activeProject = useStore((state) => state.activeProject);
  
  if (!activeProject) return null;

  const startDate = activeProject.createdAt ? new Date(activeProject.createdAt) : new Date();
  const months = [
    format(startDate, 'MMMM yyyy'),
    format(addMonths(startDate, 1), 'MMMM yyyy'),
    format(addMonths(startDate, 2), 'MMMM yyyy'),
    format(addMonths(startDate, 3), 'MMMM yyyy'),
  ];

  // Get nodes with dates to show as events
  const timelineEvents = activeProject.nodes
    .filter((n: any) => n.data?.deadline || n.data?.startDate)
    .flatMap((n: any) => {
      const nodeEvents = [];
      if (n.data.startDate) {
        nodeEvents.push({
          id: n.id,
          label: `${n.data.label} (Start)`,
          date: new Date(n.data.startDate),
          color: n.data.color || '#E8C832',
          type: 'start' as const,
          field: 'startDate'
        });
      }
      if (n.data.deadline) {
        nodeEvents.push({
          id: n.id,
          label: n.data.label,
          date: new Date(n.data.deadline),
          color: n.data.color || '#E8C832',
          type: 'deadline' as const,
          field: 'deadline'
        });
      }
      return nodeEvents;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime()); // Higher z-index for later dates? No, sort chronologically for display

  const timelineEnd = addMonths(startDate, 4);
  const totalDays = differenceInDays(timelineEnd, startDate);

  const getPosition = (date: Date) => {
    const days = differenceInDays(date, startDate);
    const pos = Math.max(0, Math.min(100, (days / totalDays) * 100));
    return `${pos}%`;
  };

  const events = [
    { label: 'Project Start', position: '0%', color: '#2d2c2a', id: 'start' },
    ...timelineEvents.map(event => ({
      ...event,
      position: getPosition(event.date)
    }))
  ];

  const totalNodes = activeProject.nodes.length;
  const totalEdges = activeProject.edges.length;

  return (
    <footer className="h-32 bg-card-warm border-t border-gray-border shrink-0 flex flex-col z-20 overflow-hidden">
      <div className="flex-1 flex px-10 relative mt-4">
        {/* Current day indicator */}
        <div 
          className="absolute top-0 w-px h-full bg-brand-yellow z-10 opacity-30"
          style={{ left: getPosition(new Date()) }}
        ></div>
        
        {/* Month Labels */}
        <div className="absolute top-0 w-full flex text-[10px] font-bold text-gray-text uppercase tracking-widest px-10">
          {months.map((month) => (
            <div key={month} className="w-1/4">{month}</div>
          ))}
        </div>

        {/* Timeline Track */}
        <div className="w-full mt-12 border-t border-gray-200 flex relative">
          {events.map((event: any, idx) => (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={`${event.id}-${event.label}-${idx}`} 
              className="absolute -top-1.5 flex flex-col items-center group/event" 
              style={{ left: event.position, zIndex: idx }}
            >
              <div 
                className="w-3 h-3 rounded-full border-2 border-white shadow-sm transition-transform group-hover/event:scale-125"
                style={{ backgroundColor: event.color }}
              />
              <div className={cn(
                "mt-2 bg-white px-2 py-1 border rounded text-[9px] font-bold shadow-sm whitespace-nowrap max-w-[120px] truncate flex flex-col gap-1 transition-all group-hover/event:z-50",
                event.color === '#E8C832' ? "border-brand-yellow" : "border-black/5"
              )}>
                <span>{event.label}</span>
                {event.id !== 'start' && (
                  <input 
                    type="date"
                    className="text-[8px] bg-bg-warm border-none p-0 opacity-0 group-hover/event:opacity-100 transition-opacity focus:opacity-100 cursor-pointer"
                    value={format(event.date, 'yyyy-MM-dd')}
                    onChange={(e) => {
                      if (event.id) {
                        useStore.getState().updateNodeData(event.id, { [event.field]: e.target.value });
                      }
                    }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="h-8 bg-[#f0eee9] flex items-center px-10 text-[10px] font-medium text-gray-500">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></span> Today
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Event
          </span>
        </div>
        <span className="ml-auto opacity-70 italic tracking-tight">
          Total Nodes: {totalNodes} • Connectors: {totalEdges} • Last modified {activeProject.updatedAt ? format(new Date(activeProject.updatedAt), 'HH:mm') : 'just now'}
        </span>
      </div>
    </footer>
  );
};
