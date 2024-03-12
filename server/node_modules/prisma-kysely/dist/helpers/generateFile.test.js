"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const generateFile_1 = require("./generateFile");
(0, vitest_1.test)("generates a file!", () => {
    const resultwithLeader = (0, generateFile_1.generateFile)([], {
        withEnumImport: false,
        withLeader: true,
    });
    (0, vitest_1.expect)(resultwithLeader).toContain('from "kysely";');
    const resultwithEnumImport = (0, generateFile_1.generateFile)([], {
        withEnumImport: { importPath: "./enums", names: ["Foo", "Bar"] },
        withLeader: false,
    });
    console.log(resultwithEnumImport);
    (0, vitest_1.expect)(resultwithEnumImport).toContain('import type { Foo, Bar } from "./enums";');
    (0, vitest_1.expect)(resultwithEnumImport).not.toContain('from "kysely";');
});
//# sourceMappingURL=generateFile.test.js.map