import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AppErrorBoundary from './components/AppErrorBoundary.jsx';
import { ResponsiveProvider } from './context/ResponsiveProvider';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found in index.html');
}

ReactDOM.createRoot(rootEl).render(
  <AppErrorBoundary>
    <ResponsiveProvider>
      <App />
    </ResponsiveProvider>
  </AppErrorBoundary>
);
