import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CanvasPage from './pages/CanvasPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import { ProjectGuard } from './components/layout/ProjectGuard';
import { useStore } from './store/useStore';
import { MotionConfig } from 'motion/react';

export default function App() {
  const animationsEnabled = useStore((state) => state.settings.animationsEnabled);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  return (
    <MotionConfig transition={animationsEnabled ? undefined : { duration: 0 }}>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
          />

          {/* Protected Routes enclosed under ProjectGuard */}
          <Route 
            path="/*" 
            element={
              <ProjectGuard>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/projects/:id" element={<CanvasPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </ProjectGuard>
            } 
          />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}

