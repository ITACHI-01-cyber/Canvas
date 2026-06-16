import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge, Connection, addEdge, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import axios from 'axios';

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
  isAuthenticated: boolean;
  user: { email: string; name?: string; avatar?: string } | null;

  fetchProjects: () => Promise<void>;
  setActiveProject: (project: Project | null) => void;
  loadProject: (id: string) => Promise<void>;
  createProject: (projectData: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;

  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<{ name: string; avatar: string }>) => void;
  fetchUserProfile: (email: string) => Promise<void>;
  saveUserProfile: () => Promise<void>;

  // Canvas Actions
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNodeData: (nodeId: string, data: any) => void;
}

let saveTimeout: NodeJS.Timeout | null = null;
const triggerAutoSave = (projectId: string, projectData: any) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      await axios.put(`/api/projects/${projectId}`, projectData);
    } catch (error) {
      console.error('Failed to auto-save project changes', error);
    }
  }, 1500);
};

export const useStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProject: null,
      settings: {
        showGrid: true,
        snapToGrid: true,
        defaultColor: '#ff6f3c',
        theme: 'light',
        animationsEnabled: true,
        compactSidebar: false,
      },
      isLoading: false,
      isSaving: false,
      isAuthenticated: false,
      user: null,

      updateSettings: (newSettings) => {
        set((state) => ({ settings: { ...state.settings, ...newSettings } }));
      },

      resetSettings: () => {
        set({
          settings: {
            showGrid: true,
            snapToGrid: true,
            defaultColor: '#ff6f3c',
            theme: 'light',
            animationsEnabled: true,
            compactSidebar: false,
          }
        });
      },

      login: async (email, pass) => {
        const isGuest = email === 'guest_explorer@example.com';
        const name = isGuest ? 'Guest Explorer' : email.split('@')[0];
        const avatar = isGuest 
          ? '' // Empty signifies default guest avatar fallback
          : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`;
        set({ isAuthenticated: true, user: { email, name, avatar } });

        if (!isGuest) {
          try {
            const response = await axios.get(`/api/users/${encodeURIComponent(email)}`);
            if (response.data) {
              set({ user: response.data });
            }
          } catch (error) {
            console.log('Profile not found in DB, using default initial values');
          }
        }
      },
      signup: async (email, pass) => {
        const name = email.split('@')[0];
        const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`;
        set({ isAuthenticated: true, user: { email, name, avatar } });
      },
      logout: () => {
        set({ isAuthenticated: false, user: null, activeProject: null });
      },
      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
      fetchUserProfile: async (email) => {
        try {
          const response = await axios.get(`/api/users/${encodeURIComponent(email)}`);
          if (response.data) {
            set({ user: response.data });
          }
        } catch (error) {
          console.log('User profile not found in DB, using local default');
        }
      },
      saveUserProfile: async () => {
        const { user } = get();
        if (!user || user.email === 'guest_explorer@example.com') return;
        set({ isSaving: true });
        try {
          await axios.post('/api/users', user);
        } catch (error) {
          console.error('Failed to save user profile', error);
          throw error;
        } finally {
          set({ isSaving: false });
        }
      },

      fetchProjects: async () => {
        set({ isLoading: true });
        try {
          const response = await axios.get('/api/projects');
          const projects = response.data.map((p: any) => ({
            ...p,
            edges: p.edges?.map((e: any) => ({ ...e, type: e.type || 'labeledEdge' })) || []
          }));
          set({ projects });
        } catch (error) {
          console.error('Error fetching projects', error);
        } finally {
          set({ isLoading: false });
        }
      },

      setActiveProject: (project) => set({ activeProject: project }),

      loadProject: async (id) => {
        set({ isLoading: true });
        try {
          const response = await axios.get(`/api/projects/${id}`);
          const project = response.data;
          if (project) {
            project.edges = project.edges?.map((e: any) => ({
              ...e,
              type: e.type || 'labeledEdge'
            })) || [];
          }
          set({ activeProject: project });
        } catch (error) {
          console.error(`Error loading project ${id}`, error);
          set({ activeProject: null });
        } finally {
          set({ isLoading: false });
        }
      },

      createProject: async (data) => {
        set({ isSaving: true });
        try {
          const newProject = {
            name: data.name || 'Untitled Project',
            description: data.description || '',
            tags: data.tags || [],
            type: data.type || 'whiteboard',
            nodes: [],
            edges: [],
            completionPercent: 0,
          };
          const response = await axios.post('/api/projects', newProject);
          const created = response.data;
          set((state) => ({ 
            activeProject: created,
            projects: [created, ...state.projects]
          }));
          return created;
        } catch (error) {
          console.error('Error creating project', error);
          throw error;
        } finally {
          set({ isSaving: false });
        }
      },

      deleteProject: async (id) => {
        try {
          await axios.delete(`/api/projects/${id}`);
          set((state) => ({ 
            activeProject: state.activeProject?._id === id ? null : state.activeProject,
            projects: state.projects.filter(p => p._id !== id)
          }));
        } catch (error) {
          console.error(`Error deleting project ${id}`, error);
        }
      },

      updateProject: async (id, data) => {
        const { activeProject } = get();
        if (activeProject && activeProject._id === id) {
          const updated = { ...activeProject, ...data, updatedAt: new Date().toISOString() };
          set({ activeProject: updated });
          triggerAutoSave(id, updated);
        }
      },

      onNodesChange: (changes) => {
        const { activeProject } = get();
        if (!activeProject) return;
        const newNodes = applyNodeChanges(changes, activeProject.nodes);
        const updated = { ...activeProject, nodes: newNodes };
        set({ activeProject: updated });
        triggerAutoSave(activeProject._id, updated);
      },

      onEdgesChange: (changes) => {
        const { activeProject } = get();
        if (!activeProject) return;
        const newEdges = applyEdgeChanges(changes, activeProject.edges);
        const updated = { ...activeProject, edges: newEdges };
        set({ activeProject: updated });
        triggerAutoSave(activeProject._id, updated);
      },

      onConnect: (connection) => {
        const { activeProject } = get();
        if (!activeProject) return;
        const newEdges = addEdge({ ...connection, type: 'labeledEdge' }, activeProject.edges);
        const updated = { ...activeProject, edges: newEdges };
        set({ activeProject: updated });
        triggerAutoSave(activeProject._id, updated);
      },

      setNodes: (nodes) => {
        const { activeProject } = get();
        if (!activeProject) return;
        
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
        const updated = { ...activeProject, nodes, completionPercent };
        set({ activeProject: updated });
        triggerAutoSave(activeProject._id, updated);
      },

      setEdges: (edges) => {
        const { activeProject } = get();
        if (!activeProject) return;
        const updated = { ...activeProject, edges };
        set({ activeProject: updated });
        triggerAutoSave(activeProject._id, updated);
      },

      addNode: (node) => {
        const { activeProject } = get();
        if (!activeProject) return;
        const updated = { ...activeProject, nodes: [...activeProject.nodes, node] };
        set({ activeProject: updated });
        triggerAutoSave(activeProject._id, updated);
      },

      updateNodeData: (nodeId, data) => {
        const { activeProject } = get();
        if (!activeProject) return;
        const newNodes = activeProject.nodes.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
        );
        
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
        const updated = { ...activeProject, nodes: newNodes, completionPercent };
        set({ activeProject: updated });
        triggerAutoSave(activeProject._id, updated);
      },
    }),
    {
      name: 'whiteboard-storage',
      partialize: (state) => ({ 
        settings: state.settings,
        isAuthenticated: state.isAuthenticated,
        user: state.user
      }),
    }
  )
);

// Set dynamic axios base URL based on environment variables for production hosting
const API_URL = (import.meta as any).env?.VITE_API_URL || '';
axios.defaults.baseURL = API_URL;

// Request interceptor to automatically attach the authenticated user's email
axios.interceptors.request.use((config) => {
  const user = useStore.getState().user;
  if (user?.email) {
    config.headers['X-User-Email'] = user.email;
  }
  return config;
});
