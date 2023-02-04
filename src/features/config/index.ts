import path from 'path';
import fs from 'fs-extra';
import { z } from 'zod';

const configSchema = z.object({
  crawlFrom: z.string(),
});

export type ConfigSchema = z.infer<typeof configSchema>;

const readConfig = (configPath?: string): any => {
  const configFilePath =
    configPath || path.join(process.cwd(), 'ds-scanner.config.json');

  if (!fs.existsSync(configFilePath)) {
    throw new Error(
      'No config file found. Please add one or check if you put the correct path.'
    );
  }

  const configFile = fs.readFileSync(configFilePath, 'utf8');

  try {
    return JSON.parse(configFile);
  } catch {
    throw new Error(
      'Couldnt parse JSON file. Make sure it has the correct structure'
    );
  }
};

const parseConfigFile = (config: any) => {
  const data = configSchema.safeParse(config);

  if (!data.success) {
    const formattedError = data.error.flatten();
    throw new Error(
      `Invalid config file: ${JSON.stringify(
        formattedError.fieldErrors,
        undefined,
        2
      )}`
    );
  }

  return data;
};

export const getConfig = (configPath?: string): ConfigSchema => {
  const configFile = readConfig(configPath);
  const data = parseConfigFile(configFile);

  return data.data;
};
