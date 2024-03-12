"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const normalizeCase_1 = require("./normalizeCase");
(0, vitest_1.test)("converts names to camel case when config value is set", () => {
    const originalName = "user_id";
    const newName = (0, normalizeCase_1.normalizeCase)(originalName, {
        camelCase: true,
        databaseProvider: "postgresql",
        fileName: "",
        enumFileName: "",
        readOnlyIds: false,
    });
    (0, vitest_1.expect)(newName).toEqual("userId");
});
(0, vitest_1.test)("doesn't convert names to camel case when config value isn't set", () => {
    const originalName = "user_id";
    const newName = (0, normalizeCase_1.normalizeCase)(originalName, {
        camelCase: false,
        databaseProvider: "postgresql",
        fileName: "",
        enumFileName: "",
        readOnlyIds: false,
    });
    (0, vitest_1.expect)(newName).toEqual("user_id");
});
//# sourceMappingURL=normalizeCase.test.js.map