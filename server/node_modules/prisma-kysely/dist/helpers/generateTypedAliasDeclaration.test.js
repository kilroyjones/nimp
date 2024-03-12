"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importDefault(require("typescript"));
const vitest_1 = require("vitest");
const generateTypedAliasDeclaration_1 = require("./generateTypedAliasDeclaration");
const testUtils_1 = require("../utils/testUtils");
(0, vitest_1.test)("it creates and exports a type alias :D", () => {
    const node = (0, generateTypedAliasDeclaration_1.generateTypedAliasDeclaration)("typeOne", typescript_1.default.factory.createLiteralTypeNode(typescript_1.default.factory.createNull()));
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual(`export type typeOne = null;`);
});
//# sourceMappingURL=generateTypedAliasDeclaration.test.js.map