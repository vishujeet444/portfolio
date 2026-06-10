import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ResponsiveProvider } from './context/ResponsiveProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ResponsiveProvider>
      <App />
    </ResponsiveProvider>
  </React.StrictMode>
);
