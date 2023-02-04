import path, { dirname } from 'path';
import { fdir, PathsOutput } from 'fdir';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { ParsedArgs } from './features/cli/parseArguments.js';
import { getConfig } from './features/config/index.js';
import { makeReport } from './features/report/index.js';
import { startServer } from './features/server/index.js';

const filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(filename);

const DEFAULT_GLOBS = ['**/!(*.test|*.spec).@(js|ts)?(x)'];

export const start = async (args: ParsedArgs) => {
  const config = getConfig(args.config);

  const globs = DEFAULT_GLOBS;

  const files = new fdir()
    .glob(...globs)
    .withFullPaths()
    .crawl(config.crawlFrom)
    .sync() as PathsOutput;

  if (files.length === 0) {
    console.error('No files found to scan');
    process.exit(1);
  }

  const report = await makeReport(files);
  fs.writeJSON(path.join(__dirname, 'scan-data.json'), report);

  startServer();
};
