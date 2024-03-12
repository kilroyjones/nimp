"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importStar(require("typescript"));
const vitest_1 = require("vitest");
const generateEnumType_1 = require("./generateEnumType");
(0, vitest_1.test)("it generates the enum type", () => {
    const [objectDeclaration, typeDeclaration] = (0, generateEnumType_1.generateEnumType)("Name", [
        { name: "FOO", dbName: "FOO" },
        { name: "BAR", dbName: "BAR" },
    ]);
    const printer = (0, typescript_1.createPrinter)();
    const result = printer.printList(typescript_1.default.ListFormat.MultiLine, typescript_1.default.factory.createNodeArray([objectDeclaration, typeDeclaration]), typescript_1.default.createSourceFile("", "", typescript_1.default.ScriptTarget.Latest));
    (0, vitest_1.expect)(result).toEqual(`export const Name = {
    FOO: "FOO",
    BAR: "BAR"
} as const;
export type Name = (typeof Name)[keyof typeof Name];\n`);
});
//# sourceMappingURL=generateEnumType.test.js.map