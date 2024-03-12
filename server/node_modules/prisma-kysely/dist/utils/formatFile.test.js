"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const formatFile_1 = require("./formatFile");
(0, vitest_1.afterEach)(() => {
    vitest_1.vi.clearAllMocks();
});
(0, vitest_1.test)("formats a file!", () => {
    (0, vitest_1.expect)(() => {
        (0, formatFile_1.formatFile)("");
    }).not.toThrow();
});
//# sourceMappingURL=formatFile.test.js.map