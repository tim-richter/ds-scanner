import { beforeEach, vi } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../src/prisma.js';

vi.mock('../src/prisma', () => ({
  prisma: mockDeep<PrismaClient>(),
}));

vi.mock('../src/features/server', () => ({
  startServer: () => null,
}));

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
