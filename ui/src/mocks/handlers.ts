import { rest, RestHandler } from 'msw';
import { faker } from '@faker-js/faker';
import { RouterOutput } from '../util/trpc.js';
import { jsonRpcSuccessResponse } from './util.js';

const uniqueComponents: RouterOutput['uniqueComponents'] = [
  'div',
  'Card',
  'Button',
  'Accordion',
  'Drawer',
  'Checkbox',
]
  .map((name) => ({
    name,
    count: faker.random.numeric(2).toString(),
  }))
  .sort((a, b) => {
    const countA = Number(a.count);
    const countB = Number(b.count);

    if (countA < countB) return 1;
    if (countA > countB) return -1;

    return 0;
  });

export const handlers: RestHandler<any>[] = [
  rest.get('http://localhost:5416/trpc/uniqueComponents', (req, res, ctx) =>
    res(ctx.json(jsonRpcSuccessResponse(uniqueComponents)))
  ),
];
