import { parseArguments } from './parseArguments';
import { start } from './start';

const init = async () => {
  const parsedArgs = await parseArguments();

  if (parsedArgs.command === 'start') {
    await start(parsedArgs.args);
  }
};
init();
