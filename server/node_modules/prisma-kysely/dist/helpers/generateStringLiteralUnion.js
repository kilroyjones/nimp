"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStringLiteralUnion = void 0;
const typescript_1 = __importDefault(require("typescript"));
const generateStringLiteralUnion = (stringLiterals) => {
    if (stringLiterals.length === 0)
        return null;
    if (stringLiterals.length === 1)
        return typescript_1.default.factory.createLiteralTypeNode(typescript_1.default.factory.createStringLiteral(stringLiterals[0]));
    return typescript_1.default.factory.createUnionTypeNode(stringLiterals.map((literal) => typescript_1.default.factory.createLiteralTypeNode(typescript_1.default.factory.createStringLiteral(literal))));
};
exports.generateStringLiteralUnion = generateStringLiteralUnion;
//# sourceMappingURL=generateStringLiteralUnion.js.map