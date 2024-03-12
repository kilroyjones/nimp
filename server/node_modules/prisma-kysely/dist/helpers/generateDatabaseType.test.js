"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const generateDatabaseType_1 = require("./generateDatabaseType");
const testUtils_1 = require("../utils/testUtils");
(0, vitest_1.test)("it works for plain vanilla type names", () => {
    const node = (0, generateDatabaseType_1.generateDatabaseType)([
        { tableName: "Bookmark", typeName: "Bookmark" },
        { tableName: "Session", typeName: "Session" },
        { tableName: "User", typeName: "User" },
    ], {
        databaseProvider: "postgresql",
        fileName: "",
        enumFileName: "",
        camelCase: false,
        readOnlyIds: false,
    });
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual(`export type DB = {
    Bookmark: Bookmark;
    Session: Session;
    User: User;
};`);
});
(0, vitest_1.test)("it respects camelCase option names", () => {
    const node = (0, generateDatabaseType_1.generateDatabaseType)([
        { tableName: "book_mark", typeName: "Bookmark" },
        { tableName: "session", typeName: "Session" },
        { tableName: "user_table", typeName: "User" },
    ], {
        databaseProvider: "postgresql",
        fileName: "",
        enumFileName: "",
        camelCase: true,
        readOnlyIds: false,
    });
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual(`export type DB = {
    bookMark: Bookmark;
    session: Session;
    userTable: User;
};`);
});
(0, vitest_1.test)("it works for table names with spaces and weird symbols", () => {
    const node = (0, generateDatabaseType_1.generateDatabaseType)([
        { tableName: "Bookmark", typeName: "Bookmark" },
        { tableName: "user session_*table ;D", typeName: "Session" },
        { tableName: "User", typeName: "User" },
    ], {
        databaseProvider: "postgresql",
        fileName: "",
        enumFileName: "",
        camelCase: false,
        readOnlyIds: false,
    });
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual(`export type DB = {
    Bookmark: Bookmark;
    User: User;
    "user session_*table ;D": Session;
};`);
});
//# sourceMappingURL=generateDatabaseType.test.js.map