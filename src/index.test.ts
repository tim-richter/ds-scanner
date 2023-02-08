import mock from 'mock-fs';
import { it, expect, vi, afterEach } from 'vitest';
import fs from 'fs-extra';
import { DeepMockProxy } from 'vitest-mock-extended';
import { init } from './index.js';

afterEach(() => {
  vi.clearAllMocks();
  mock.restore();
});

const mockedFs = fs as unknown as DeepMockProxy<typeof fs>;

it('should notify user if no command was specified', async () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => null);

  await init();

  expect(errorSpy).toHaveBeenCalledWith('No command found.');
});

it('should throw error if no config file could be found', async () => {
  process.exit = vi.fn();
  process.argv = [
    '/usr/local/bin/node',
    '/Users/trichter/work/node/ds-scanner.js',
    'start',
  ];
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => null);

  await init();

  expect(errorSpy).toHaveBeenCalledTimes(1);
  expect(errorSpy).toHaveBeenCalledWith(
    'No config file found. Please add one or check if you put the correct path.'
  );
});

it('should throw error if config file is not json', async () => {
  process.exit = vi.fn();
  process.argv = [
    '/usr/local/bin/node',
    '/Users/trichter/work/node/ds-scanner.js',
    'start',
  ];
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => null);
  mock({
    'ds-scanner.config.json': '',
  });

  await init();

  expect(errorSpy).toHaveBeenCalledTimes(1);
  expect(errorSpy).toHaveBeenCalledWith(
    'Couldnt parse JSON file. Make sure it has the correct structure'
  );
});

it('should throw error if config file has not the correct structure', async () => {
  process.exit = vi.fn();
  process.argv = [
    '/usr/local/bin/node',
    '/Users/trichter/work/node/ds-scanner.js',
    'start',
  ];
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => null);
  mock({
    'ds-scanner.config.json': JSON.stringify({}),
  });

  await init();

  expect(errorSpy).toHaveBeenCalledTimes(1);
  expect(errorSpy.mock.calls[0]).toMatchInlineSnapshot(`
    [
      "Invalid config file: {
      \\"crawlFrom\\": [
        \\"Required\\"
      ]
    }",
    ]
  `);
});

it('should throw error if no files were found to scan', async () => {
  process.exit = vi.fn();
  process.argv = [
    '/usr/local/bin/node',
    '/Users/trichter/work/node/ds-scanner.js',
    'start',
  ];
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => null);
  mock({
    'ds-scanner.config.json': JSON.stringify({ crawlFrom: '.' }),
  });

  await init();

  expect(errorSpy).toHaveBeenCalledTimes(1);
  expect(errorSpy.mock.calls[0]).toMatchInlineSnapshot(`
    [
      "No files found to scan",
    ]
  `);
});

it('should create an empty report if no components', async () => {
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

it('should create an empty report if no components', async () => {
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
