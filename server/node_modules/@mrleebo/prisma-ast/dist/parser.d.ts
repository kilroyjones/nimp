import { CstParser } from 'chevrotain';
export declare class PrismaParser extends CstParser {
    constructor();
    private break;
    private keyedArg;
    private array;
    private func;
    private value;
    private property;
    private assignment;
    private field;
    private block;
    private enum;
    private attribute;
    private attributeArg;
    private component;
    private comment;
    schema: import("chevrotain").ParserMethod<[], import("chevrotain").CstNode>;
}
export declare const parser: PrismaParser;
