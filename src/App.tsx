import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import { useAuthStore } from '@/stores/authStore';
import { initAutoSync } from '@/services/dataSyncService';
import './styles/globals.css';

function App() {
  const theme = useAuthStore((s) => s.theme);
  const initializeAuthListener = useAuthStore((s) => s.initializeAuthListener);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    initializeAuthListener();
    const cleanupSync = initAutoSync();
    return () => {
      cleanupSync();
    };
  }, [initializeAuthListener]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

