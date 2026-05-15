import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

export const useAutoSave = () => {
  const activeProject = useStore((state) => state.activeProject);
  
  useEffect(() => {
    if (!activeProject) return;
    
    // In frontend-only mode, Zustand's persist middleware handles localStorage sync.
    // We could add more logic here if needed for cloud syncing in the future.
  }, [activeProject]);
};
