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
    console.error('No files found to scan');
    process.exit(1);
  }

  return files;
};
