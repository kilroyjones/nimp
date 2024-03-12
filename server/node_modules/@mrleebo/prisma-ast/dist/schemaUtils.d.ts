import type { CstNode, IToken } from 'chevrotain';
import * as schema from './getSchema';
export declare function isSchemaObject(obj: schema.Object): boolean;
export declare function isSchemaField(field: schema.Field): boolean;
export declare function isToken(node: [IToken] | [CstNode]): node is [IToken];
export declare function appendLocationData<T extends Record<string, unknown>>(data: T, ...tokens: IToken[]): T;
