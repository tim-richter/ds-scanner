import path, { dirname } from 'path';
import { fdir, PathsOutput } from 'fdir';
import fs from 'fs-extra';
import { dset } from 'dset';
import { fileURLToPath } from 'url';
import serveStatic from 'serve-static';
import http from 'http';
import finalhandler from 'finalhandler';
import { ParsedArgs } from './parseArguments';
import { getConfig } from './features/config';
import { scan } from './features/report';

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

  fs.writeJSON(path.join(__dirname, 'scan-data.json'), report);

  const serve = serveStatic(__dirname, {
    index: ['index.html', 'index.htm'],
  });

  // Create server
  const server = http.createServer((req, res) => {
    serve(req, res, finalhandler(req, res));
  });

  // Listen
  server.listen(3000);
};
