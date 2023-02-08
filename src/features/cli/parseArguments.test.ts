import { it, expect } from 'vitest';
import { parseArguments } from './parseArguments.js';

it('should parse the start command', async () => {
  process.argv = [
    '/usr/local/bin/node',
    '/Users/trichter/work/node/ds-scanner.js',
    'start',
  ];

  const result = await parseArguments();

  expect(result.command).toEqual('start');
});

it('should parse the start command with the config option', async () => {
  process.argv = [
    '/usr/local/bin/node',
    '/Users/trichter/work/node/ds-scanner.js',
    'start',
    '-c=./path/to/config',
  ];

  const result = await parseArguments();

  expect(result.args.c).toEqual('./path/to/config');
  expect(result.args.config).toEqual('./path/to/config');
});
