"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFile = void 0;
const typescript_1 = __importDefault(require("typescript"));
const printer = typescript_1.default.createPrinter({ newLine: typescript_1.default.NewLineKind.LineFeed });
const generateFile = (statements, { withEnumImport, withLeader }) => {
    const file = typescript_1.default.factory.createSourceFile(statements, typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.EndOfFileToken), typescript_1.default.NodeFlags.None);
    const result = printer.printFile(file);
    const leader = `import type { ColumnType${result.includes("GeneratedAlways") ? ", GeneratedAlways" : ""} } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;`;
    if (withEnumImport) {
        const enumImportStatement = `import type { ${withEnumImport.names.join(", ")} } from "${withEnumImport.importPath}";`;
        return withLeader
            ? `${leader}\n\n${enumImportStatement}\n\n${result}`
            : `${enumImportStatement}\n\n${result}`;
    }
    return withLeader ? `${leader}\n\n${result}` : result;
};
exports.generateFile = generateFile;
//# sourceMappingURL=generateFile.js.map