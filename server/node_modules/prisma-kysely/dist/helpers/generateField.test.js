"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importDefault(require("typescript"));
const vitest_1 = require("vitest");
const generateField_1 = require("./generateField");
const testUtils_1 = require("../utils/testUtils");
const stringTypeNode = typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier("string"), undefined);
(0, vitest_1.test)("it creates correct annotation for non-nullable types", () => {
    const node = (0, generateField_1.generateField)({
        name: "name",
        type: stringTypeNode,
        nullable: false,
        generated: false,
        list: false,
        isId: false,
        config: {
            readOnlyIds: false,
        },
    });
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual("name: string;");
});
(0, vitest_1.test)("it creates correct annotation for nullable types", () => {
    const node = (0, generateField_1.generateField)({
        name: "name",
        type: stringTypeNode,
        nullable: true,
        generated: false,
        list: false,
        isId: false,
        config: {
            readOnlyIds: false,
        },
    });
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual("name: string | null;");
});
(0, vitest_1.test)("it creates correct annotation for generated types", () => {
    const node = (0, generateField_1.generateField)({
        name: "name",
        type: stringTypeNode,
        nullable: false,
        generated: true,
        list: false,
        isId: false,
        config: {
            readOnlyIds: false,
        },
    });
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual("name: Generated<string>;");
});
(0, vitest_1.test)("it creates correct annotation for list types", () => {
    const node = (0, generateField_1.generateField)({
        name: "name",
        type: stringTypeNode,
        nullable: false,
        generated: false,
        list: true,
        isId: false,
        config: {
            readOnlyIds: false,
        },
    });
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual("name: string[];");
});
(0, vitest_1.test)("it creates correct annotation for generated list types", () => {
    const node = (0, generateField_1.generateField)({
        name: "name",
        type: stringTypeNode,
        nullable: false,
        generated: true,
        list: true,
        isId: false,
        config: {
            readOnlyIds: false,
        },
    });
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual("name: Generated<string[]>;");
});
(0, vitest_1.test)("it creates correct annotation for generated nullable list types (do these exist?)", () => {
    const node = (0, generateField_1.generateField)({
        name: "name",
        type: stringTypeNode,
        nullable: true,
        generated: true,
        list: true,
        isId: false,
        config: {
            readOnlyIds: false,
        },
    });
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual("name: Generated<(string | null)[]>;");
});
(0, vitest_1.test)("it prepends a JSDoc comment if documentation is provided", () => {
    const node = (0, generateField_1.generateField)({
        name: "name",
        type: stringTypeNode,
        nullable: false,
        generated: false,
        list: false,
        isId: false,
        documentation: "This is a comment",
        config: {
            readOnlyIds: false,
        },
    });
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual("/**\n * This is a comment\n */\nname: string;");
});
(0, vitest_1.test)("it uses generated always for ids if config item is specified", () => {
    const node = (0, generateField_1.generateField)({
        name: "id",
        type: stringTypeNode,
        nullable: false,
        generated: true,
        list: false,
        isId: true,
        config: {
            readOnlyIds: true,
        },
    });
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual("id: GeneratedAlways<string>;");
});
//# sourceMappingURL=generateField.test.js.map