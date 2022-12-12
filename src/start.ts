import { createServer } from 'vite';
import path from 'path';
import { ParsedArgs } from './parseArguments';
import { getConfig } from './features/config';

export const start = async (args: ParsedArgs) => {
  const config = getConfig(args.config);
  console.log(config);

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
