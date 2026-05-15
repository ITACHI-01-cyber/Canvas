import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReactFlow, Background, Controls, MiniMap, ConnectionMode, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AppShell } from '../components/layout/AppShell';
import { useStore } from '../store/useStore';
import { useAutoSave } from '../hooks/useAutoSave';
import { StackNode } from '../components/canvas/nodes/StackNode';
import { LabeledEdge } from '../components/canvas/edges/LabeledEdge';
import { CanvasToolbar } from '../components/canvas/CanvasToolbar';
import { TodoPanel } from '../components/todos/TodoPanel';
import { Timeline } from '../components/canvas/Timeline';
import { motion, AnimatePresence } from 'motion/react';
import { Share2 } from 'lucide-react';
import { cn } from '../lib/utils';

const nodeTypes = { stackNode: StackNode };
const edgeTypes = { labeledEdge: LabeledEdge };

export default function CanvasPage() {
  const { id } = useParams();
  const { activeProject, loadProject, onNodesChange, onEdgesChange, onConnect, setNodes, setEdges, updateProject, settings } = useStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useAutoSave();

  useEffect(() => {
    if (id) loadProject(id);
  }, [id]);

  const onNodeClick = useCallback((_: any, node: any) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  if (!activeProject) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        <div className="flex-1 relative min-w-0">
          <ReactFlow
            nodes={activeProject.nodes}
            edges={activeProject.edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionMode={ConnectionMode.Loose}
            snapToGrid={settings.snapToGrid}
            snapGrid={[20, 20]}
            fitView
            className={cn("transition-all", settings.theme === 'dark' ? "dark:bg-[#121212]" : "")}
          >
            {settings.showGrid && <Background color={settings.theme === 'dark' ? "#333" : "#dcd9d5"} variant={"dots" as any} gap={20} />}
            <Controls />
            <MiniMap
              style={{ height: 120, width: 160 }}
              nodeStrokeColor={(n: any) => n.data?.color || '#bab9b4'}
              nodeColor={(n: any) => (n.data?.color ? `${n.data.color}20` : '#f9f8f5')}
              maskColor={settings.theme === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(240, 240, 240, 0.4)'}
            />

            <Panel position="top-right" className="flex items-center gap-2">
              <div className="px-4 py-2 bg-white border border-gray-border rounded-xl shadow-warm flex items-center gap-3">
                <div className="flex items-center gap-2 pr-3 border-r border-gray-border">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold uppercase text-gray-text tracking-widest whitespace-nowrap">Live</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Share link copied!');
                  }}
                  className="text-gray-text hover:text-dark-charcoal transition-colors flex items-center gap-1 text-xs font-bold"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </Panel>

            <CanvasToolbar />
          </ReactFlow>

          <AnimatePresence>
            {selectedNodeId && (
              <TodoPanel
                nodeId={selectedNodeId}
                onClose={() => setSelectedNodeId(null)}
              />
            )}
          </AnimatePresence>
        </div>
        <Timeline />
      </div>
    </AppShell>
  );
}
