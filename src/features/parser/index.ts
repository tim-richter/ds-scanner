import { parse, TSESTree } from '@typescript-eslint/typescript-estree';
import getObjectPath from 'dlv';
import { dset } from 'dset';
import { walk } from 'estree-walker';
import { isJSXAttribute, isJSXOpeningElement } from './util';

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
  filePath: string;
  importInfo: Record<string, any>;
}
function getInstanceInfo({ node, filePath, importInfo }: GetInstanceInfo) {
  const { attributes } = node;

  const result: Record<string, any> = {
    ...(importInfo !== undefined && { importInfo }),
    props: {},
    propsSpread: false,
    location: {
      file: filePath,
      start: node.name.loc.start,
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

const getComponentName = ({ imported, local }: ImportsMapValue) =>
  imported || local;

type ScanArgs = {
  code: string;
  filePath: string;
};

export function scan({ code, filePath }: ScanArgs) {
  const report = {};

  const ast = parse(code, parseOptions);

  const importsMap: ImportsMap = {};

  walk(ast, {
    enter(node) {
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
    leave(node) {
      if (isJSXOpeningElement(node)) {
        const { name } = node;

        const nameFromAst = getComponentNameFromAST(name);

        const nameParts = nameFromAst.split('.');

        const [firstPart, ...restParts] = nameParts;

        const actualFirstPart = importsMap[firstPart]
          ? getComponentName(importsMap[firstPart])
          : firstPart;

        const componentParts = [actualFirstPart, ...restParts];

        const componentPath = componentParts.join('.components.');
        let componentInfo = getObjectPath(report, componentPath);

        if (!componentInfo) {
          componentInfo = {};
          dset(report, componentPath, componentInfo);
        }

        if (!componentInfo.instances) {
          componentInfo.instances = [];
        }

        const info = getInstanceInfo({
          node,
          filePath,
          importInfo: importsMap[firstPart],
        });

        componentInfo.instances.push(info);
      }
    },
  });

  return report;
}
