"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const validateConfig_1 = require("./validateConfig");
(0, vitest_1.afterEach)(() => {
    vitest_1.vi.clearAllMocks();
});
(0, vitest_1.test)("should exit with error code when invalid config encountered", () => {
    const mockExitFunction = vitest_1.vi.fn();
    const consoleErrorFunction = vitest_1.vi.fn();
    process.exit = mockExitFunction;
    console.error = consoleErrorFunction;
    (0, validateConfig_1.validateConfig)({
        databaseProvider: "postgers",
        testField: "wrong",
    });
    (0, vitest_1.expect)(mockExitFunction).toHaveBeenCalled();
    (0, vitest_1.expect)(consoleErrorFunction).toHaveBeenCalled();
});
//# sourceMappingURL=validateConfig.test.js.map