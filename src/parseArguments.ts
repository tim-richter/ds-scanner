import yargs, { Arguments } from 'yargs';
import { hideBin } from 'yargs/helpers';

export type ParsedArgs = Arguments<{
  config?: string;
}>;

export const parseArguments = async () => {
  const args = await yargs(hideBin(process.argv))
    .command('start', 'start the scanning process')
    .option('config', {
      alias: 'c',
      description: 'Path to the config file',
      type: 'string',
    }).argv;

  return { command: args._[0], args };
};
