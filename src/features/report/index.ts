import { parse, TSESTree } from '@typescript-eslint/typescript-estree';
import { walk } from 'estree-walker';
import { PathsOutput } from 'fdir';
import fs from 'fs-extra';
import { prisma } from '../../prisma.js';
import { isJSXAttribute, isJSXOpeningElement } from './util.js';

interface ImportInfo {
  imported?: string;
  local: string;
  moduleName: string;
  importType:
    | TSESTree.AST_NODE_TYPES.ImportSpecifier
    | TSESTree.AST_NODE_TYPES.ImportDefaultSpecifier
    | TSESTree.AST_NODE_TYPES.ImportNamespaceSpecifier;
}

interface Component {
  name?: string;
  importInfo?: ImportInfo;
  location: {
    end: {
      column: number;
      line: number;
    };
    start: {
      column: number;
      line: number;
    };
  };
  props: Record<string, any>;
  propsSpread: boolean;
}

interface ScanResult {
  filePath?: string;
  components?: Array<Component>;
}

const parseOptions = {
  loc: true,
  jsx: true,
};

interface ImportsMapValue {
  imported?: string;
  local: string;
  moduleName: string;
  importType:
    | TSESTree.AST_NODE_TYPES.ImportSpecifier
    | TSESTree.AST_NODE_TYPES.ImportDefaultSpecifier
    | TSESTree.AST_NODE_TYPES.ImportNamespaceSpecifier;
}
type ImportsMap = Record<string, ImportsMapValue>;

const getComponentNameFromAST = (
  nameObj: TSESTree.JSXTagNameExpression
): string => {
  if (nameObj.type === 'JSXMemberExpression') {
    return `${getComponentNameFromAST(
      nameObj.object
    )}.${getComponentNameFromAST(nameObj.property)}`;
  }

  if (nameObj.type === 'JSXNamespacedName') {
    return `${nameObj.namespace.name}.${nameObj.name.name}`;
  }

  return nameObj.name;
};

function getPropValue(node: TSESTree.JSXExpression | TSESTree.Literal) {
  if (node.type === 'Literal') {
    return node.value;
  }

  if (node.type === 'JSXExpressionContainer') {
    if (node.expression.type === 'Literal') {
      return node.expression.value;
    }

    return `(${node.expression.type})`;
  }
}

interface GetInstanceInfo {
  node: TSESTree.JSXOpeningElement;
  importInfo?: ImportInfo;
}

function getInstanceInfo({ node, importInfo }: GetInstanceInfo): Component {
  const { attributes } = node;

  const result: Component = {
    ...(importInfo !== undefined && { importInfo }),
    props: {},
    propsSpread: false,
    location: {
      start: node.name.loc.start,
      end: node.name.loc.end,
    },
  };

  attributes.forEach((attribute) => {
    if (isJSXAttribute(attribute)) {
      const { name, value } = attribute;

      const propName = name.name;

      const propValue = getPropValue(value as any);

      result.props[propName.toString()] = propValue;
    } else if (attribute.type === 'JSXSpreadAttribute') {
      result.propsSpread = true;
    }
  });

  return result;
}

type ScanArgs = {
  code: string;
  filePath: string;
};

export function scan({ code, filePath }: ScanArgs): ScanResult {
  const report: ScanResult = {
    components: [],
  };

  const ast = parse(code, parseOptions);

  const importsMap: ImportsMap = {};

  walk(ast, {
    enter(node: any) {
      if (node.type === 'ImportDeclaration') {
        const { source, specifiers } = node as TSESTree.ImportDeclaration;

        const moduleName = source.value;

        specifiers.forEach((specifier) => {
          if (specifier.type === 'ImportSpecifier') {
            const imported = specifier.imported.name;
            const local = specifier.local.name;

            importsMap[local] = {
              ...(imported !== null && { imported }),
              local,
              moduleName,
              importType: specifier.type,
            };
          } else if (specifier.type === 'ImportDefaultSpecifier') {
            const local = specifier.local.name;

            importsMap[local] = {
              local,
              moduleName,
              importType: specifier.type,
            };
          } else {
            const local = specifier.local.name;

            importsMap[local] = {
              local,
              moduleName,
              importType: specifier.type,
            };
          }
        });
      }
    },
    leave(node: any) {
      if (isJSXOpeningElement(node)) {
        const { name } = node;

        report.filePath = filePath;

        const nameFromAst = getComponentNameFromAST(name);

        const nameParts = nameFromAst.split('.');

        const [firstPart] = nameParts;

        const info = getInstanceInfo({
          node,
          importInfo: importsMap[firstPart],
        });

        report.components?.push({ name: nameFromAst, ...info });
      }
    },
  });

  return report;
}

export const makeReport = async (files: PathsOutput) => {
  const report: Array<Record<string, any>> = [];

  files.forEach(async (file) => {
    const code = fs.readFileSync(file, 'utf8');

    const scannedCode = scan({ code, filePath: file });

    report.push(scannedCode);

    await prisma.file.create({
      data: {
        path: file,
        components: {
          create: scannedCode.components?.map((component) => ({
            name: component.name,
            propsSpread: component.propsSpread,
            importType: component.importInfo?.importType as string,
            imported: component.importInfo?.imported,
            local: component.importInfo?.local,
            moduleName: component.importInfo?.moduleName,
            locationEndColumn: component.location.end.column,
            locationEndLine: component.location.end.line,
            locationStartColumn: component.location.start.column,
            locationStartLine: component.location.start.line,
          })),
        },
      },
    });
  });

  return report;
};
