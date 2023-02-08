import mock from 'mock-fs';
import { it, expect, vi, afterEach } from 'vitest';
import { init } from '../../src/index.js';

afterEach(() => {
  vi.clearAllMocks();
  mock.restore();
});

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
