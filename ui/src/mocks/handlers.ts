import { rest, RestHandler } from 'msw';

export const handlers: RestHandler<any>[] = [
  rest.get('http://localhost:5416/trpc/allFiles', (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({ id: null, result: { type: 'data', data: {} } })
    )
  ),
];
