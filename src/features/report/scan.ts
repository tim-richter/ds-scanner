import { ExcludeFn, fdir, PathsOutput } from 'fdir';

const DEFAULT_GLOBS = ['**/!(*.test|*.spec).@(js|ts)?(x)'];

export const scan = (crawlFrom: string, exclude?: ExcludeFn) => {
  const globs = DEFAULT_GLOBS;

  const files = new fdir()
    .exclude(exclude || (() => false))
    .glob(...globs)
    .withFullPaths()
    .crawl(crawlFrom)
    .sync() as PathsOutput;

  if (files.length === 0) {
    throw new Error('No files found to scan');
  }

  return files;
};
