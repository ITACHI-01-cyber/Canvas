import React from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from '@xyflow/react';
import { motion } from 'motion/react';
import { useStore } from '../../../store/useStore';
import { cn } from '../../../lib/utils';
import { Trash2 } from 'lucide-react';

export const LabeledEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  selected,
  data,
}: EdgeProps) => {
  // Use getSmoothStepPath for clean, logic-filled orthogonal routing
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 12,
    offset: 24,
  });

  const activeProject = useStore((state) => state.activeProject);
  const sourceNode = activeProject?.nodes.find((n) => n.id === source);
  const targetNode = activeProject?.nodes.find((n) => n.id === target);

  const setEdges = useStore((state) => state.setEdges);
  const edges = useStore((state) => state.activeProject?.edges || []);
  const customColor = (data as any)?.color;

  const updateEdgeColor = (color?: string) => {
    const updatedEdges = edges.map((e) =>
      e.id === id ? { ...e, data: { ...e.data, color } } : e
    );
    setEdges(updatedEdges);
  };

  const deleteEdge = () => {
    const updatedEdges = edges.filter((e) => e.id !== id);
    setEdges(updatedEdges);
  };

  const getFlowSettings = () => {
    const defaultSettings = {
      color: customColor || '#9a9895',
      duration: '1.5s',
      strokeWidth: 1.5,
      dashArray: '6, 10',
      reqDir: 'forward' as const,
      reqColor: customColor || '#9a9895',
      reqRadius: 3,
      resColor: customColor ? '#FFFFFF' : '#e8e6e1',
      resRadius: 2,
      hasResponse: customColor ? true : false,
    };

    if (!sourceNode || !targetNode) {
      return defaultSettings;
    }

    const catA = (sourceNode.data as any)?.category?.toLowerCase() || '';
    const catB = (targetNode.data as any)?.category?.toLowerCase() || '';

    const isConn = (c1: string, c2: string) => 
      (catA === c1 && catB === c2) || (catA === c2 && catB === c1);

    // 1. Frontend <-> Backend flow (API Request stream)
    if (isConn('frontend', 'backend')) {
      const isFrontendSource = catA === 'frontend';
      return {
        color: customColor || '#ff6f3c', // Brand Orange
        duration: '0.8s', // Snappy request flow
        strokeWidth: 2,
        dashArray: '8, 8',
        reqDir: (isFrontendSource ? 'forward' : 'backward') as 'forward' | 'backward',
        reqColor: customColor || '#ff6f3c',
        reqRadius: 3.5,
        resColor: customColor ? '#FFFFFF' : '#FFFFFF',
        resRadius: 2.5,
        hasResponse: true,
      };
    }

    // 2. Backend <-> Database flow (Database Queries stream)
    if (isConn('backend', 'database')) {
      const isBackendSource = catA === 'backend';
      return {
        color: customColor || '#4f98a3', // Database Teal
        duration: '0.6s', // Extremely rapid query loop
        strokeWidth: 2,
        dashArray: '4, 12',
        reqDir: (isBackendSource ? 'forward' : 'backward') as 'forward' | 'backward',
        reqColor: customColor || '#4f98a3',
        reqRadius: 3,
        resColor: customColor ? '#10b981' : '#10b981', // Vivid Emerald for data payload
        resRadius: 3.5,
        hasResponse: true,
      };
    }

    // 3. Any connections involving Auth Node (Security flow)
    if (catA === 'auth' || catB === 'auth') {
      const isAuthTarget = catB === 'auth';
      return {
        color: customColor || '#a86fdf', // Security Purple
        duration: '1.2s', 
        strokeWidth: 2,
        dashArray: '10, 10',
        reqDir: (isAuthTarget ? 'forward' : 'backward') as 'forward' | 'backward',
        reqColor: customColor || '#a86fdf',
        reqRadius: 3.2,
        resColor: customColor ? '#ec4899' : '#ec4899', // Hot pink for auth handshake response
        resRadius: 2.8,
        hasResponse: true,
      };
    }

    // 4. Default connection flow matches source node color
    const srcColor = customColor || (sourceNode.data as any)?.color || '#9a9895';
    const tgtColor = customColor ? '#FFFFFF' : ((targetNode.data as any)?.color || '#e8e6e1');
    return {
      color: srcColor,
      duration: '1.5s',
      strokeWidth: 1.5,
      dashArray: '6, 8',
      reqDir: 'forward' as const,
      reqColor: srcColor,
      reqRadius: 3,
      resColor: tgtColor,
      resRadius: 2,
      hasResponse: true,
    };
  };

  const flow = getFlowSettings();

  return (
    <>
      {/* Glow Underlay for premium look */}
      <path
        d={edgePath}
        fill="none"
        stroke={flow.color}
        strokeWidth={selected ? 6 : 4}
        opacity={0.15}
        style={{ pointerEvents: 'none' }}
      />

      {/* Flowing Pulse Line (CSS offset shift) */}
      <path
        d={edgePath}
        fill="none"
        stroke={flow.color}
        strokeWidth={flow.strokeWidth}
        strokeDasharray={flow.dashArray}
        opacity={0.6}
        style={{
          pointerEvents: 'none',
          animation: `edge-flow ${flow.duration} linear infinite`,
          animationDirection: flow.reqDir === 'forward' ? 'normal' : 'reverse',
        }}
      />

      {/* Main Base Line (Conduit structure) */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: selected ? flow.color : (style.stroke || '#e8e6e1'),
          strokeWidth: selected ? 2 : 1,
          opacity: selected ? 1 : 0.7,
        }}
      />

      {/* Forward or Backward Request Packet */}
      <circle r={flow.reqRadius} fill={flow.reqColor} style={{ filter: `drop-shadow(0 0 4px ${flow.reqColor})` }}>
        <animateMotion
          dur={flow.duration}
          repeatCount="indefinite"
          path={edgePath}
          rotate="auto"
          keyPoints={flow.reqDir === 'backward' ? "1;0" : undefined}
          keyTimes={flow.reqDir === 'backward' ? "0;1" : undefined}
          calcMode={flow.reqDir === 'backward' ? "linear" : undefined}
        />
      </circle>

      {/* Secondary Request Packet (Offset for continuous flow) */}
      <circle r={flow.reqRadius * 0.7} fill={flow.reqColor} opacity={0.5} style={{ filter: `drop-shadow(0 0 2px ${flow.reqColor})` }}>
        <animateMotion
          dur={flow.duration}
          begin={`${parseFloat(flow.duration) / 2}s`}
          repeatCount="indefinite"
          path={edgePath}
          rotate="auto"
          keyPoints={flow.reqDir === 'backward' ? "1;0" : undefined}
          keyTimes={flow.reqDir === 'backward' ? "0;1" : undefined}
          calcMode={flow.reqDir === 'backward' ? "linear" : undefined}
        />
      </circle>

      {/* Response Packet (Moving in opposite direction) */}
      {flow.hasResponse && (
        <circle r={flow.resRadius} fill={flow.resColor} style={{ filter: `drop-shadow(0 0 3px ${flow.resColor})` }}>
          <animateMotion
            dur={flow.duration}
            begin={`${parseFloat(flow.duration) * 0.25}s`}
            repeatCount="indefinite"
            path={edgePath}
            rotate="auto"
            keyPoints={flow.reqDir === 'forward' ? "1;0" : undefined}
            keyTimes={flow.reqDir === 'forward' ? "0;1" : undefined}
            calcMode={flow.reqDir === 'forward' ? "linear" : undefined}
          />
        </circle>
      )}

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex flex-col items-center gap-1.5 z-[1000]"
        >
          {label && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-2.5 py-1 bg-white text-black border-[2px] border-black font-mono font-black text-[9px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest rounded-none"
            >
              {label}
            </motion.div>
          )}

          {selected && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 5 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 p-1 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"
            >
              {[
                { value: 'dynamic', colorClass: 'bg-slate-100 border-black text-[8px] font-black text-black flex items-center justify-center rounded-none' },
                { value: '#ff6f3c', colorClass: 'bg-[#ff6f3c] border-[#000] rounded-none' },
                { value: '#F25C54', colorClass: 'bg-[#F25C54] border-[#000] rounded-none' },
                { value: '#3A86C8', colorClass: 'bg-[#3A86C8] border-[#000] rounded-none' },
                { value: '#4f98a3', colorClass: 'bg-[#4f98a3] border-[#000] rounded-none' },
                { value: '#a86fdf', colorClass: 'bg-[#a86fdf] border-[#000] rounded-none' },
                { value: '#10b981', colorClass: 'bg-[#10b981] border-[#000] rounded-none' },
              ].map((preset) => {
                const isSelected = preset.value === 'dynamic' ? !customColor : customColor === preset.value;
                return (
                  <button
                    key={preset.value}
                    onClick={() => {
                      updateEdgeColor(preset.value === 'dynamic' ? undefined : preset.value);
                    }}
                    className={cn(
                      "w-4.5 h-4.5 border-2 cursor-pointer hover:scale-110 hover:shadow-[1px_1px_0px_0px_#000] transition-all",
                      preset.colorClass,
                      isSelected ? "ring-2 ring-brand-yellow scale-105 shadow-[1px_1px_0px_0px_#000]" : "opacity-90"
                    )}
                    title={preset.value === 'dynamic' ? 'Auto Dynamic' : preset.value}
                  >
                    {preset.value === 'dynamic' && "↺"}
                  </button>
                );
              })}

              <div className="w-[2px] h-4 bg-black mx-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteEdge();
                }}
                className="w-5 h-5 rounded-none bg-red-100 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                title="Delete Connection"
              >
                <Trash2 size={10} className="text-black hover:text-white" />
              </button>
            </motion.div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
