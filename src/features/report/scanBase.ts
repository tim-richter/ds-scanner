/* eslint-disable no-restricted-syntax */
import fs from 'fs-extra';
import path from 'path';
import { Project } from 'ts-morph';

export const scanBase = (filePath: string, basePath: string) => {
  const fName = path.resolve(filePath);

  if (!fs.existsSync(fName)) {
    throw new Error(`The file ${fName} does not exist`);
  }

  const project = new Project({
    skipFileDependencyResolution: true,
    skipAddingFilesFromTsConfig: true,
  });

  project.addSourceFilesAtPaths(`${basePath}/**/*.{js,jsx,ts,tsx}`);
  const mainFile = project.getSourceFileOrThrow(fName);

  const exps = [];
  for (const [name] of mainFile.getExportedDeclarations()) exps.push(name);

  return exps;
};
