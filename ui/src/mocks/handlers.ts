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
  'Drawer',
  'Input',
]
  .map((name) => ({
    name,
    count: faker.random.numeric(3).toString(),
  }))
  .sort((a, b) => {
    const countA = Number(a.count);
    const countB = Number(b.count);

    if (countA < countB) return 1;
    if (countA > countB) return -1;

    return 0;
  });

export const handlers: RestHandler<any>[] = [
  rest.get(
    'http://localhost:5416/trpc/uniqueComponents',
    async (req, res, ctx) => {
      const inputParams = req.url.searchParams.get('input');

      if (inputParams) {
        const parsedParams: { 0: { limit: number } } = JSON.parse(inputParams);

        return res(
          ctx.json(
            jsonRpcSuccessResponse(
              uniqueComponents.splice(-parsedParams[0].limit)
            )
          )
        );
      }

      return res(ctx.json(jsonRpcSuccessResponse(uniqueComponents)));
    }
  ),
];
