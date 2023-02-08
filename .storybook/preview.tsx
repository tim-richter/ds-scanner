import React from 'react';
import { handlers } from '../ui/src/mocks/handlers'
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { QueryProvider } from '../ui/src/context/Query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '../ui/src/Router'
import '../ui/src/main.css';

initialize({
  onUnhandledRequest: ({ method, url }) => {
    if (url.host === 'localhost:6006') return;
    console.error(`Unhandled ${method} request to ${url}.

      This exception has been only logged in the console, however, it's strongly recommended to resolve this error as you don't want unmocked data in Storybook stories.

      If you wish to mock an error response, please refer to this guide: https://mswjs.io/docs/recipes/mocking-error-responses
    `)
  },
})

export const decorators = [
  (Story, { parameters }) => {
    const router = createMemoryRouter(routes, {
      initialEntries: parameters.initialEntries || ['/'],
    });

    return (
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    )
  },
  mswDecorator,
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  msw: handlers,
}
