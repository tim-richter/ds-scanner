import { afterEach, expect, it, vi, describe } from 'vitest';
import mock from 'mock-fs';
import fs from 'fs-extra';
import path from 'path';
import { getConfig } from '.';

afterEach(() => {
  mock.restore();
});

it('should throw an error if the config file does not exist', () => {
  mock({
    'nonexistent.json': JSON.stringify({}),
  });

  expect(() => getConfig('test.json')).toThrowError(
    'No config file found. Please add one or check if you put the correct path.'
  );
});

it('should use a default value for the config path if none was given', () => {
  mock({
    'nonexistent.json': JSON.stringify({}),
  });

  const spy = vi.spyOn(fs, 'existsSync');

  expect(() => getConfig()).toThrowError();
  expect(spy).toHaveBeenCalledWith(
    path.join(__dirname, 'ds-scanner.config.json')
  );
});

describe('should parse the config file and throw errors when structure is incorrect', () => {
  it('should throw an error if the file is empty', () => {
    mock({
      'config.json': '',
    });

    expect(() => getConfig('config.json')).toThrowError(
      'Couldnt parse JSON file. Make sure it has the correct structure'
    );
  });

  it('should throw an error if the file does not include json', () => {
    mock({
      'config.json': 'testString',
    });

    expect(() => getConfig('config.json')).toThrowError(
      'Couldnt parse JSON file. Make sure it has the correct structure'
    );
  });

  it('should throw an error if the file does not have the correct structure', () => {
    mock({
      'config.json': JSON.stringify({ test: 'test' }),
    });

    expect(() => getConfig('config.json')).toThrowErrorMatchingInlineSnapshot(`
      "Invalid config file: {
        \\"crawlFrom\\": [
          \\"Required\\"
        ]
      }"
    `);
  });
});

it('should return data from config file', () => {
  mock({
    'config.json': JSON.stringify({ crawlFrom: '.' }),
  });

  const result = getConfig('config.json');

  expect(result).toEqual({
    crawlFrom: '.',
  });
});
