import { parseArguments } from './features/cli/parseArguments.js';
import { start } from './start.js';
import { reportError } from './utils/error.js';

export const init = async () => {
  const parsedArgs = await parseArguments();

  if (parsedArgs.command === 'start') {
    return start(parsedArgs.args);
  }

  reportError({ message: 'No command found.' });
};
