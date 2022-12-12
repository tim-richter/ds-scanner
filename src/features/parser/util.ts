import { TSESTree } from '@typescript-eslint/typescript-estree';
import { BaseNode } from 'estree-walker';

export const isJSXOpeningElement = (
  node: BaseNode
): node is TSESTree.JSXOpeningElement => node.type === 'JSXOpeningElement';

export const isJSXAttribute = (node: any): node is TSESTree.JSXAttribute =>
  node.type === 'JSXAttribute';
