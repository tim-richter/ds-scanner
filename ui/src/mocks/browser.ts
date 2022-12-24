import { setupWorker, SetupWorkerApi } from 'msw';
import { handlers } from './handlers.js';

export const worker: SetupWorkerApi = setupWorker(...handlers);
