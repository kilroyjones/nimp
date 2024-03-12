"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEnumType = void 0;
const typescript_1 = __importDefault(require("typescript"));
const isValidTSIdentifier_1 = __importDefault(require("../utils/isValidTSIdentifier"));
const generateStringLiteralUnion_1 = require("./generateStringLiteralUnion");
const generateTypedReferenceNode_1 = require("./generateTypedReferenceNode");
const generateEnumType = (name, values) => {
    const type = (0, generateStringLiteralUnion_1.generateStringLiteralUnion)(values.map((v) => v.name));
    if (!type)
        return [];
    const objectDeclaration = typescript_1.default.factory.createVariableStatement([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], typescript_1.default.factory.createVariableDeclarationList([
        typescript_1.default.factory.createVariableDeclaration(name, undefined, undefined, typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createObjectLiteralExpression(values.map((v) => {
            const identifier = (0, isValidTSIdentifier_1.default)(v.name)
                ? typescript_1.default.factory.createIdentifier(v.name)
                : typescript_1.default.factory.createStringLiteral(v.name);
            return typescript_1.default.factory.createPropertyAssignment(identifier, typescript_1.default.factory.createStringLiteral(v.dbName || v.name));
        }), true), typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier("const"), undefined))),
    ], typescript_1.default.NodeFlags.Const));
    const typeDeclaration = (0, generateTypedReferenceNode_1.generateTypedReferenceNode)(name);
    return [objectDeclaration, typeDeclaration];
};
exports.generateEnumType = generateEnumType;
//# sourceMappingURL=generateEnumType.js.map