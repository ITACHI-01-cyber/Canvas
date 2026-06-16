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
          color: n.data.color || '#ff6f3c',
          type: 'start' as const,
          field: 'startDate'
        });
      }
      if (n.data.deadline) {
        nodeEvents.push({
          id: n.id,
          label: n.data.label,
          date: new Date(n.data.deadline),
          color: n.data.color || '#ff6f3c',
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
    <footer className="h-8 md:h-32 bg-white dark:bg-[#151515] border-t-[3px] border-black dark:border-white shrink-0 flex flex-col z-20 overflow-hidden transition-all duration-300">
      <div className="hidden md:flex flex-1 px-10 relative mt-4">
        {/* Current day indicator */}
        <div 
          className="absolute top-0 w-[2px] h-full bg-brand-yellow dark:bg-white z-10"
          style={{ left: getPosition(new Date()) }}
        ></div>
        
        {/* Month Labels */}
        <div className="absolute top-0 w-full flex text-[9px] font-mono font-black text-black dark:text-white uppercase tracking-widest px-10">
          {months.map((month) => (
            <div key={month} className="w-1/4">{month}</div>
          ))}
        </div>
 
        {/* Timeline Track */}
        <div className="w-full mt-12 border-t-[3px] border-black dark:border-white flex relative">
          {events.map((event: any, idx) => (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={`${event.id}-${event.label}-${idx}`} 
              className="absolute -top-2 flex flex-col items-center group/event" 
              style={{ left: event.position, zIndex: idx }}
            >
              <div 
                className="w-3.5 h-3.5 rounded-none border-2 border-black dark:border-white shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#fff] transition-transform group-hover/event:scale-110 cursor-pointer"
                style={{ backgroundColor: event.color }}
              />
              <div className={cn(
                "mt-2 bg-white dark:bg-neutral-900 px-2 py-1.5 border-2 border-black dark:border-white rounded-none text-[8px] font-mono font-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] whitespace-nowrap max-w-[130px] truncate flex flex-col gap-1 transition-all group-hover/event:z-50 uppercase text-black dark:text-white",
                event.color === '#ff6f3c' ? "border-brand-yellow" : "border-black dark:border-white"
              )}>
                <span>{event.label}</span>
                {event.id !== 'start' && (
                  <input 
                    type="date"
                    className="text-[8px] bg-slate-50 dark:bg-neutral-800 text-black dark:text-white border border-black p-0.5 rounded-none opacity-0 group-hover/event:opacity-100 transition-opacity focus:opacity-100 cursor-pointer outline-none font-mono"
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
 
      <div className="h-8 bg-white dark:bg-neutral-900 border-t-2 border-black dark:border-white flex items-center px-4 md:px-10 text-[8px] font-mono font-black text-black dark:text-white uppercase tracking-widest justify-between w-full overflow-hidden select-none">
        <div className="flex gap-4 shrink-0">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-none border border-black bg-brand-yellow"></span> Today
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <span className="w-2 h-2 rounded-none border border-black bg-gray-400"></span> Event
          </span>
        </div>
        <span className="opacity-80 tracking-widest font-mono truncate ml-4 text-right">
          NODES: {totalNodes} • CONNS: {totalEdges} • UP: {activeProject.updatedAt ? format(new Date(activeProject.updatedAt), 'HH:mm') : 'JUST NOW'}
        </span>
      </div>
    </footer>
  );
};
