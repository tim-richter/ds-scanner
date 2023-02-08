import mock from 'mock-fs';
import { it, expect, vi, afterEach } from 'vitest';
import fs from 'fs-extra';
import { DeepMockProxy } from 'vitest-mock-extended';
import { init } from '../../src/index.js';

afterEach(() => {
  vi.clearAllMocks();
  mock.restore();
});

it('should create an empty report if no components were found', async () => {
  process.exit = vi.fn();
  process.argv = [
    '/usr/local/bin/node',
    '/Users/trichter/work/node/ds-scanner.js',
    'start',
  ];
  mock({
    'ds-scanner.config.json': JSON.stringify({ crawlFrom: '.' }),
    'some-project': {
      'Button.tsx': '',
    },
  });
  vi.spyOn(fs, 'writeJSON').mockImplementation(() => null);
  const mockedFs = fs as unknown as DeepMockProxy<typeof fs>;

  await init();

  expect(mockedFs.writeJSON).toHaveBeenCalledTimes(1);
  expect(mockedFs.writeJSON.mock.calls[0]).toMatchInlineSnapshot(`
    [
      "/home/tim/code/personal/ds-scanner-mono/src/scan-data.json",
      [
        {
          "components": [],
        },
      ],
    ]
  `);
});

it('should create a empty report', async () => {
  process.exit = vi.fn();
  process.argv = [
    '/usr/local/bin/node',
    '/Users/trichter/work/node/ds-scanner.js',
    'start',
  ];
  mock({
    'ds-scanner.config.json': JSON.stringify({ crawlFrom: '.' }),
    'some-project': {
      'Button.tsx': `
      import { Button } from 'my-library';
  
      export const CustomButton = () => {
        return <Button variant="blue" />;
      }
    `,
    },
  });
  vi.spyOn(fs, 'writeJSON').mockImplementation(() => null);
  const mockedFs = fs as unknown as DeepMockProxy<typeof fs>;

  await init();

  expect(mockedFs.writeJSON).toHaveBeenCalledTimes(1);
  expect(mockedFs.writeJSON.mock.calls[0]).toMatchInlineSnapshot(`
    [
      "/home/tim/code/personal/ds-scanner-mono/src/scan-data.json",
      [
        {
          "components": [
            {
              "importInfo": {
                "importType": "ImportSpecifier",
                "imported": "Button",
                "local": "Button",
                "moduleName": "my-library",
              },
              "location": {
                "end": {
                  "column": 22,
                  "line": 5,
                },
                "start": {
                  "column": 16,
                  "line": 5,
                },
              },
              "name": "Button",
              "props": [
                {
                  "name": "variant",
                  "value": "blue",
                },
              ],
              "propsSpread": false,
            },
          ],
          "filePath": "/home/tim/code/personal/ds-scanner-mono/some-project/Button.tsx",
        },
      ],
    ]
  `);
});
