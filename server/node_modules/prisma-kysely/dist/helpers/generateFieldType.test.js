"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const generateFieldType_1 = require("./generateFieldType");
(0, vitest_1.test)("it respects overrides when generating field types", () => {
    const overrides = {
        stringTypeOverride: "stringOverride",
        bigIntTypeOverride: "smallInt",
        booleanTypeOverride: "bootilt",
        bytesTypeOverride: "bits",
        dateTimeTypeOverride: "aloneTime",
        decimalTypeOverride: "octal",
        floatTypeOverride: "sink",
        intTypeOverride: "lol",
        jsonTypeOverride: "freddy",
        unsupportedTypeOverride: "valid",
    };
    const config = {
        ...overrides,
        databaseProvider: "postgresql",
        fileName: "types.ts",
        enumFileName: "types.ts",
        camelCase: false,
        readOnlyIds: false,
    };
    const sourceTypes = [
        "String",
        "BigInt",
        "Boolean",
        "Bytes",
        "DateTime",
        "Decimal",
        "Float",
        "Int",
        "Json",
        "Unsupported",
    ];
    (0, vitest_1.expect)(sourceTypes.map((source) => (0, generateFieldType_1.generateFieldType)(source, config))).toEqual(Object.values(overrides));
});
(0, vitest_1.test)("it respects overrides when generating field types", () => {
    const node = (0, generateFieldType_1.generateFieldType)("String", {
        databaseProvider: "mysql",
        fileName: "types.ts",
        enumFileName: "types.ts",
        stringTypeOverride: "cheese",
        camelCase: false,
        readOnlyIds: false,
    });
    (0, vitest_1.expect)(node).toEqual("cheese");
});
(0, vitest_1.test)("it respects differences between database engines", () => {
    const postgresBooleanType = (0, generateFieldType_1.generateFieldType)("Boolean", {
        databaseProvider: "postgresql",
        fileName: "types.ts",
        enumFileName: "types.ts",
        camelCase: false,
        readOnlyIds: false,
    });
    const mysqlBooleanType = (0, generateFieldType_1.generateFieldType)("Boolean", {
        databaseProvider: "mysql",
        fileName: "types.ts",
        enumFileName: "types.ts",
        camelCase: false,
        readOnlyIds: false,
    });
    const sqliteBooleanType = (0, generateFieldType_1.generateFieldType)("Boolean", {
        databaseProvider: "sqlite",
        fileName: "types.ts",
        enumFileName: "types.ts",
        camelCase: false,
        readOnlyIds: false,
    });
    (0, vitest_1.expect)(postgresBooleanType).toEqual("boolean");
    (0, vitest_1.expect)(mysqlBooleanType).toEqual("number");
    (0, vitest_1.expect)(sqliteBooleanType).toEqual("number");
});
(0, vitest_1.test)("it throws an error when unsupported type is encountered", () => {
    (0, vitest_1.expect)(() => (0, generateFieldType_1.generateFieldType)("Json", {
        databaseProvider: "sqlite",
        fileName: "types.ts",
        enumFileName: "types.ts",
        camelCase: false,
        readOnlyIds: false,
    })).toThrowError(new Error("Unsupported type Json for database sqlite"));
});
//# sourceMappingURL=generateFieldType.test.js.map