"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDatabaseType = void 0;
const typescript_1 = __importDefault(require("typescript"));
const isValidTSIdentifier_1 = __importDefault(require("../utils/isValidTSIdentifier"));
const normalizeCase_1 = require("../utils/normalizeCase");
const sorted_1 = require("../utils/sorted");
const generateDatabaseType = (models, config) => {
    const sortedModels = (0, sorted_1.sorted)(models, (a, b) => a.tableName.localeCompare(b.tableName));
    const properties = sortedModels.map((field) => {
        const caseNormalizedTableName = (0, normalizeCase_1.normalizeCase)(field.tableName, config);
        const nameIdentifier = (0, isValidTSIdentifier_1.default)(caseNormalizedTableName)
            ? typescript_1.default.factory.createIdentifier(caseNormalizedTableName)
            : typescript_1.default.factory.createStringLiteral(caseNormalizedTableName);
        return typescript_1.default.factory.createPropertySignature(undefined, nameIdentifier, undefined, typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier(field.typeName), undefined));
    });
    return typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], typescript_1.default.factory.createIdentifier("DB"), undefined, typescript_1.default.factory.createTypeLiteralNode(properties));
};
exports.generateDatabaseType = generateDatabaseType;
//# sourceMappingURL=generateDatabaseType.js.map