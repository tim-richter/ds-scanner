import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '../util/trpc.js';
import { WithChildren } from '../types/index.js';

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:5416/trpc',
    }),
  ],
});

export const queryClient = new QueryClient();

export const QueryProvider: React.FC<WithChildren> = ({ children }) => (
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </trpc.Provider>
);
