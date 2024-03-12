"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const generateModel_1 = require("./generateModel");
const testUtils_1 = require("../utils/testUtils");
(0, vitest_1.test)("it generates a model!", () => {
    const model = (0, generateModel_1.generateModel)({
        name: "User",
        fields: [
            {
                name: "id",
                isId: true,
                isGenerated: true,
                default: { name: "uuid", args: [] },
                kind: "scalar",
                type: "String",
                hasDefaultValue: true,
                isList: false,
                isReadOnly: false,
                isRequired: true,
                isUnique: false,
            },
            {
                name: "id2",
                isId: false,
                isGenerated: false,
                default: { name: "dbgenerated", args: ["uuid()"] },
                kind: "scalar",
                type: "String",
                hasDefaultValue: true,
                isList: false,
                isReadOnly: false,
                isRequired: true,
                isUnique: false,
            },
            {
                name: "name",
                isId: false,
                isGenerated: false,
                kind: "scalar",
                type: "String",
                hasDefaultValue: false,
                isList: false,
                isReadOnly: false,
                isRequired: false,
                isUnique: false,
            },
            {
                name: "unsupportedField",
                isId: false,
                isGenerated: false,
                kind: "unsupported",
                type: "String",
                hasDefaultValue: false,
                isList: false,
                isReadOnly: false,
                isRequired: false,
                isUnique: false,
            },
            {
                name: "objectField",
                isId: false,
                isGenerated: false,
                kind: "object",
                type: "SomeOtherObject",
                hasDefaultValue: false,
                isList: false,
                isReadOnly: false,
                isRequired: false,
                isUnique: false,
            },
            {
                name: "enumField",
                isId: false,
                isGenerated: false,
                kind: "enum",
                type: "CoolEnum",
                hasDefaultValue: false,
                isList: false,
                isReadOnly: false,
                isRequired: true,
                isUnique: false,
            },
        ],
        primaryKey: null,
        uniqueFields: [],
        uniqueIndexes: [],
        dbName: null,
    }, {
        databaseProvider: "sqlite",
        fileName: "",
        enumFileName: "",
        camelCase: false,
        readOnlyIds: false,
    });
    (0, vitest_1.expect)(model.tableName).toEqual("User");
    (0, vitest_1.expect)(model.typeName).toEqual("User");
    const source = (0, testUtils_1.stringifyTsNode)(model.definition);
    (0, vitest_1.expect)(source).toEqual(`export type User = {
    id: string;
    id2: Generated<string>;
    name: string | null;
    enumField: CoolEnum;
};`);
});
(0, vitest_1.test)("it respects camelCase option", () => {
    const model = (0, generateModel_1.generateModel)({
        name: "User",
        fields: [
            {
                name: "id",
                isId: true,
                isGenerated: true,
                default: { name: "uuid", args: [] },
                kind: "scalar",
                type: "String",
                hasDefaultValue: true,
                isList: false,
                isReadOnly: false,
                isRequired: true,
                isUnique: false,
            },
            {
                name: "user_name",
                isId: false,
                isGenerated: false,
                kind: "scalar",
                type: "String",
                hasDefaultValue: false,
                isList: false,
                isReadOnly: false,
                isRequired: false,
                isUnique: false,
            },
        ],
        primaryKey: null,
        uniqueFields: [],
        uniqueIndexes: [],
        dbName: null,
    }, {
        databaseProvider: "sqlite",
        fileName: "",
        enumFileName: "",
        camelCase: true,
        readOnlyIds: false,
    });
    (0, vitest_1.expect)(model.tableName).toEqual("User");
    (0, vitest_1.expect)(model.typeName).toEqual("User");
    const source = (0, testUtils_1.stringifyTsNode)(model.definition);
    (0, vitest_1.expect)(source).toEqual(`export type User = {
    id: string;
    userName: string | null;
};`);
});
//# sourceMappingURL=generateModel.test.js.map