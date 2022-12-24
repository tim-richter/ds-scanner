import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { QueryProvider } from './context/Query.js';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>
);
