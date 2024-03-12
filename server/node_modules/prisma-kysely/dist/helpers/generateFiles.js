"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFiles = void 0;
const path_1 = __importDefault(require("path"));
const generateFile_1 = require("./generateFile");
function generateFiles(opts) {
    if (opts.enumsOutfile === opts.typesOutfile || opts.enums.length === 0) {
        const typesFileWithEnums = {
            filepath: opts.typesOutfile,
            content: (0, generateFile_1.generateFile)([...opts.enums, ...opts.modelDefinitions, opts.databaseType], {
                withEnumImport: false,
                withLeader: true,
            }),
        };
        return [typesFileWithEnums];
    }
    const typesFileWithoutEnums = {
        filepath: opts.typesOutfile,
        content: (0, generateFile_1.generateFile)([...opts.modelDefinitions, opts.databaseType], {
            withEnumImport: {
                importPath: `./${path_1.default.parse(opts.enumsOutfile).name}`,
                names: opts.enumNames,
            },
            withLeader: true,
        }),
    };
    if (opts.enums.length === 0)
        return [typesFileWithoutEnums];
    const enumFile = {
        filepath: opts.enumsOutfile,
        content: (0, generateFile_1.generateFile)(opts.enums, {
            withEnumImport: false,
            withLeader: false,
        }),
    };
    return [typesFileWithoutEnums, enumFile];
}
exports.generateFiles = generateFiles;
//# sourceMappingURL=generateFiles.js.map