import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../src/features/server/index.js';

export const trpc = createTRPCReact<AppRouter>();
