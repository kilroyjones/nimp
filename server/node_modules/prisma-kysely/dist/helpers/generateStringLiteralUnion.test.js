"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const vitest_1 = require("vitest");
const generateStringLiteralUnion_1 = require("./generateStringLiteralUnion");
const testUtils_1 = require("../utils/testUtils");
(0, vitest_1.test)("it returns null for 0 items", () => {
    const node = (0, generateStringLiteralUnion_1.generateStringLiteralUnion)([]);
    (0, vitest_1.expect)(node).toBeNull();
});
(0, vitest_1.test)("it generates string literal unions for 1 item", () => {
    const node = (0, generateStringLiteralUnion_1.generateStringLiteralUnion)(["option1"]);
    (0, assert_1.default)(node != null);
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual('"option1"');
});
(0, vitest_1.test)("it generates string literal unions for 2 items", () => {
    const node = (0, generateStringLiteralUnion_1.generateStringLiteralUnion)(["option1", "option2"]);
    (0, assert_1.default)(node != null);
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual('"option1" | "option2"');
});
//# sourceMappingURL=generateStringLiteralUnion.test.js.map