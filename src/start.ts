import { createServer } from 'vite';
import path, { dirname } from 'path';
import { fdir, PathsOutput } from 'fdir';
import fs from 'fs-extra';
import { dset } from 'dset';
import { fileURLToPath } from 'url';
import { ParsedArgs } from './parseArguments';
import { getConfig } from './features/config';
import { scan } from './features/parser';

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

  const report = {};
  files.forEach((file) => {
    const code = fs.readFileSync(file, 'utf8');

    const scannedCode = scan({ code, filePath: file });

    dset(report, file, scannedCode);
  });

  fs.writeJSON(
    path.join(__dirname, 'features/ui/public/scan-data.json'),
    report
  );

  const server = await createServer({
    configFile: path.join(__dirname, 'features/ui/vite.config.ts'),
    root: path.join(__dirname, 'features/ui'),
    server: {
      port: 5020,
      host: '127.0.0.1',
      open: true,
    },
  });
  await server.listen();

  server.printUrls();
};
