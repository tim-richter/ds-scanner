import { parseArguments } from './features/cli/parseArguments.js';
import { start } from './start.js';

const init = async () => {
  const parsedArgs = await parseArguments();

  if (parsedArgs.command === 'start') {
    await start(parsedArgs.args);
  }
};
init();
