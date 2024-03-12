"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypedAliasDeclaration = void 0;
const typescript_1 = __importDefault(require("typescript"));
const generateTypedAliasDeclaration = (name, type) => {
    return typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], typescript_1.default.factory.createIdentifier(name), undefined, type);
};
exports.generateTypedAliasDeclaration = generateTypedAliasDeclaration;
//# sourceMappingURL=generateTypedAliasDeclaration.js.map