import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge, Connection, addEdge, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

interface Project {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  type: string;
  nodes: Node[];
  edges: Edge[];
  completionPercent: number;
  createdAt?: string;
  updatedAt: string;
}

interface UserSettings {
  showGrid: boolean;
  snapToGrid: boolean;
  defaultColor: string;
  theme: 'light' | 'dark' | 'amber' | 'emerald' | 'indigo' | 'rose' | 'cobalt' | 'slate';
  animationsEnabled: boolean;
  compactSidebar: boolean;
}

interface ProjectStore {
  projects: Project[];
  activeProject: Project | null;
  settings: UserSettings;
  isLoading: boolean;
  isSaving: boolean;

  fetchProjects: () => Promise<void>;
  setActiveProject: (project: Project | null) => void;
  loadProject: (id: string) => Promise<void>;
  createProject: (projectData: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;

  // Canvas Actions
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNodeData: (nodeId: string, data: any) => void;

  // Persistence Actions
  exportProject: () => void;
  importProject: (jsonData: string) => void;
}

export const useStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProject: {
        _id: 'default',
        name: 'Untitled Project',
        description: '',
        tags: [],
        type: 'whiteboard',
        nodes: [],
        edges: [],
        completionPercent: 0,
        updatedAt: new Date().toISOString()
      },
      settings: {
        showGrid: true,
        snapToGrid: true,
        defaultColor: '#E8C832',
        theme: 'light',
        animationsEnabled: true,
        compactSidebar: false,
      },
      isLoading: false,
      isSaving: false,

      updateSettings: (newSettings) => {
        set((state) => ({ settings: { ...state.settings, ...newSettings } }));
      },

      resetSettings: () => {
        set({
          settings: {
            showGrid: true,
            snapToGrid: true,
            defaultColor: '#E8C832',
            theme: 'light',
            animationsEnabled: true,
            compactSidebar: false,
          }
        });
      },

      exportProject: () => {
        const { activeProject } = get();
        if (!activeProject) return;
        const blob = new Blob([JSON.stringify(activeProject, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${activeProject.name.replace(/\s+/g, '_')}_backup.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },

      importProject: (jsonData: string) => {
        try {
          const project = JSON.parse(jsonData);
          if (!project._id || !project.nodes) throw new Error('Invalid project structure');
          
          set((state) => ({ 
            activeProject: project,
            projects: state.projects.find(p => p._id === project._id) 
              ? state.projects.map(p => p._id === project._id ? project : p)
              : [project, ...state.projects]
          }));
        } catch (error) {
          console.error('Invalid project file', error);
          alert('Failed to import project. Please ensure the file is a valid project JSON backup.');
        }
      },

      fetchProjects: async () => {
        // Handled via local storage persistence
      },

      setActiveProject: (project) => set({ activeProject: project }),

      loadProject: async (id) => {
        const { projects } = get();
        const project = projects.find(p => p._id === id);
        if (project) {
          set({ activeProject: project });
        }
      },

      createProject: async (data) => {
        const newProject = {
          _id: Math.random().toString(36).substr(2, 9),
          name: data.name || 'Untitled Project',
          description: data.description || '',
          tags: data.tags || [],
          type: data.type || 'whiteboard',
          nodes: [],
          edges: [],
          completionPercent: 0,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          ...data
        };
        set((state) => ({ 
          activeProject: newProject as Project,
          projects: [newProject as Project, ...state.projects]
        }));
        return newProject as Project;
      },

      deleteProject: async (id) => {
        set((state) => ({ 
          activeProject: state.activeProject?._id === id ? null : state.activeProject,
          projects: state.projects.filter(p => p._id !== id)
        }));
      },

      updateProject: async (id, data) => {
        const { activeProject } = get();
        if (activeProject) {
          set({ activeProject: { ...activeProject, ...data, updatedAt: new Date().toISOString() } });
        }
      },

      onNodesChange: (changes) => {
        const { activeProject } = get();
        if (!activeProject) return;
        const newNodes = applyNodeChanges(changes, activeProject.nodes);
        set({ activeProject: { ...activeProject, nodes: newNodes } });
      },

      onEdgesChange: (changes) => {
        const { activeProject } = get();
        if (!activeProject) return;
        const newEdges = applyEdgeChanges(changes, activeProject.edges);
        set({ activeProject: { ...activeProject, edges: newEdges } });
      },

      onConnect: (connection) => {
        const { activeProject } = get();
        if (!activeProject) return;
        const newEdges = addEdge(connection, activeProject.edges);
        set({ activeProject: { ...activeProject, edges: newEdges } });
      },

      setNodes: (nodes) => {
        const { activeProject } = get();
        if (!activeProject) return;
        
        // Calculate global completion percent
        let totalProgress = 0;
        let nodesWithTodos = 0;
        
        nodes.forEach((node: any) => {
          const todos = node.data?.todos || [];
          if (todos.length > 0) {
            const done = todos.filter((t: any) => t.done).length;
            totalProgress += (done / todos.length) * 100;
            nodesWithTodos++;
          }
        });
        
        const completionPercent = nodesWithTodos > 0 ? Math.round(totalProgress / nodesWithTodos) : 0;
        
        set({ activeProject: { ...activeProject, nodes, completionPercent } });
      },

      setEdges: (edges) => {
        const { activeProject } = get();
        if (!activeProject) return;
        set({ activeProject: { ...activeProject, edges } });
      },

      addNode: (node) => {
        const { activeProject } = get();
        if (!activeProject) return;
        set({ activeProject: { ...activeProject, nodes: [...activeProject.nodes, node] } });
      },

      updateNodeData: (nodeId, data) => {
        const { activeProject } = get();
        if (!activeProject) return;
        const newNodes = activeProject.nodes.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
        );
        
        // Calculate global completion percent
        let totalProgress = 0;
        let nodesWithTodos = 0;
        
        newNodes.forEach((node: any) => {
          const todos = node.data?.todos || [];
          if (todos.length > 0) {
            const done = todos.filter((t: any) => t.done).length;
            totalProgress += (done / todos.length) * 100;
            nodesWithTodos++;
          }
        });
        
        const completionPercent = nodesWithTodos > 0 ? Math.round(totalProgress / nodesWithTodos) : 0;
        
        set({ activeProject: { ...activeProject, nodes: newNodes, completionPercent } });
      },
    }),
    {
      name: 'whiteboard-storage',
      partialize: (state) => ({ 
        projects: state.projects,
        settings: state.settings
      }),
    }
  )
);
