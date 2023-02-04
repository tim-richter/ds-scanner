import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from './context/Query.js';
import { browserRouter } from './Router.js';
import './main.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryProvider>
      <RouterProvider router={browserRouter} />
    </QueryProvider>
  </React.StrictMode>
);
