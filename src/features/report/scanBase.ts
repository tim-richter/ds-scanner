import ts from 'typescript';
import fs from 'fs-extra';
import path from 'path';
import { Project } from 'ts-morph';

export const scanBase = (filePath: string) => {
  const fName = path.resolve(filePath);

  if (!fs.existsSync(fName)) {
    throw new Error(`The file ${fName} does not exist`);
  }

  const project = new Project();

  project.addSourceFilesAtPaths('**/*.ts');
  const mainFile = project.getSourceFileOrThrow(filePath);

  const program = ts.createProgram([fName], { allowJs: true });
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(fName);

  if (!sourceFile) return [];

  const exportSymbol = checker.getSymbolAtLocation(sourceFile?.getChildAt(0));

  // @ts-ignore see: https://stackoverflow.com/questions/62865648/how-should-i-get-common-js-exports-with-the-typescript-compiler-api
  const exps = checker.getExportsOfModule(
    // @ts-ignore
    exportSymbol || sourceFile.symbol
  );

  return exps;
};
