/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CanvasPage from './pages/CanvasPage';
import SettingsPage from './pages/SettingsPage';
import { ProjectGuard } from './components/layout/ProjectGuard';
import { useStore } from './store/useStore';
import { MotionConfig } from 'motion/react';

export default function App() {
  const animationsEnabled = useStore((state) => state.settings.animationsEnabled);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      const message = 'CRITICAL: Ensure you have exported your project backup! Unsaved changes will be lost as soon as you close this tab.';
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <MotionConfig transition={animationsEnabled ? undefined : { duration: 0 }}>
      <BrowserRouter>
        <ProjectGuard>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects/:id" element={<CanvasPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </ProjectGuard>
      </BrowserRouter>
    </MotionConfig>
  );
}
