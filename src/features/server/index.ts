import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { prisma } from '../../prisma.js';

const filename = fileURLToPath(import.meta.url);
const directory = dirname(filename);

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const t = initTRPC.create();

const appRouter = t.router({
  fileById: t.procedure
    .input((val: unknown) => {
      if (typeof val === 'number') return val;

      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query(async (req) => {
      const { input } = req;

      const file = await prisma.file.findUnique({ where: { id: input } });

      return file;
    }),
  allFiles: t.procedure.query(async () => {
    const files = await prisma.file.findMany({
      include: { components: { include: { props: true } } },
    });

    return files;
  }),
  uniqueComponents: t.procedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async (req) => {
      const { input } = req;

      type DistinctCount = Array<{ name: string; count: string }>;

      const userIdCount =
        (await prisma.$queryRaw`SELECT name, COUNT(name) AS count FROM Component GROUP BY name ${
          input?.limit ? `LIMIT ${input.limit}` : ''
        }`) as DistinctCount;

      return userIdCount;
    }),
});

export type AppRouter = typeof appRouter;

const app = express();

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.use(express.static(directory));

export const startServer = () => {
  app.listen(5416);
};
