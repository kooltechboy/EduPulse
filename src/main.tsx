import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { registerServiceWorker } from './services/notificationService';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found in index.html');

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize PWA Service Worker
registerServiceWorker();
