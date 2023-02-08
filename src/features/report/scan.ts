import { fdir, PathsOutput } from 'fdir';

const DEFAULT_GLOBS = ['**/!(*.test|*.spec).@(js|ts)?(x)'];

export const scan = (crawlFrom: string) => {
  const globs = DEFAULT_GLOBS;

  const files = new fdir()
    .glob(...globs)
    .withFullPaths()
    .crawl(crawlFrom)
    .sync() as PathsOutput;

  if (files.length === 0) {
    throw new Error('No files found to scan');
  }

  return files;
};
