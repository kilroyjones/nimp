"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateField = void 0;
const typescript_1 = __importDefault(require("typescript"));
const applyJSDocWorkaround_1 = require("../utils/applyJSDocWorkaround");
const isValidTSIdentifier_1 = __importDefault(require("../utils/isValidTSIdentifier"));
const generateField = (args) => {
    const { name, type, nullable, generated, list, documentation, isId, config } = args;
    let fieldType = type;
    if (nullable)
        fieldType = typescript_1.default.factory.createUnionTypeNode([
            fieldType,
            typescript_1.default.factory.createLiteralTypeNode(typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.NullKeyword)),
        ]);
    if (list)
        fieldType = typescript_1.default.factory.createArrayTypeNode(fieldType);
    if (generated) {
        if (isId && config.readOnlyIds) {
            fieldType = typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier("GeneratedAlways"), [fieldType]);
        }
        else {
            fieldType = typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier("Generated"), [fieldType]);
        }
    }
    const nameIdentifier = (0, isValidTSIdentifier_1.default)(name)
        ? typescript_1.default.factory.createIdentifier(name)
        : typescript_1.default.factory.createStringLiteral(name);
    const propertySignature = typescript_1.default.factory.createPropertySignature(undefined, nameIdentifier, undefined, fieldType);
    if (documentation) {
        return typescript_1.default.addSyntheticLeadingComment(propertySignature, typescript_1.default.SyntaxKind.MultiLineCommentTrivia, (0, applyJSDocWorkaround_1.applyJSDocWorkaround)(documentation), true);
    }
    return propertySignature;
};
exports.generateField = generateField;
//# sourceMappingURL=generateField.js.map