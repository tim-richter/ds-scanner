import path, { dirname } from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { ParsedArgs } from './features/cli/parseArguments.js';
import { getConfig } from './features/config/index.js';
import { makeReport } from './features/report/index.js';
import { startServer } from './features/server/index.js';

const filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(filename);

export const start = async (args: ParsedArgs) => {
  const config = getConfig(args.config);

  const report = await makeReport(config);
  fs.writeJSON(path.join(__dirname, 'scan-data.json'), report);

  startServer();
};
