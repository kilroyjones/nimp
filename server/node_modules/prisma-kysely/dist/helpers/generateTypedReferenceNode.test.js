"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const testUtils_1 = require("../utils/testUtils");
const generateTypedReferenceNode_1 = require("./generateTypedReferenceNode");
(0, vitest_1.test)("it generated the typed reference node", () => {
    const node = (0, generateTypedReferenceNode_1.generateTypedReferenceNode)("Name");
    const result = (0, testUtils_1.stringifyTsNode)(node);
    (0, vitest_1.expect)(result).toEqual("export type Name = (typeof Name)[keyof typeof Name];");
});
//# sourceMappingURL=generateTypedReferenceNode.test.js.map