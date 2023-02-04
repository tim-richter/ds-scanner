import React from 'react';

import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { Home } from './pages/Home.js';
import { Error } from './pages/Error.js';
import { Components } from './pages/Components.js';
import { Default } from './layouts/Default.js';

export const routes: RouteObject[] = [
  {
    element: <Default />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/components',
        element: <Components />,
      },
    ],
  },
];

export const browserRouter = createBrowserRouter(routes);
