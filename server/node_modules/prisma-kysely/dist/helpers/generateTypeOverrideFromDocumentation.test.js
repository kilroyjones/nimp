"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const generateTypeOverrideFromDocumentation_1 = require("./generateTypeOverrideFromDocumentation");
(0, vitest_1.test)("finds a type override", () => {
    const docString = "this is some property \n here is the type override @kyselyType('admin' | 'member') ";
    (0, vitest_1.expect)((0, generateTypeOverrideFromDocumentation_1.generateTypeOverrideFromDocumentation)(docString)).toEqual("'admin' | 'member'");
});
(0, vitest_1.test)("supports parentheses in type", () => {
    const docString = "this is some property \n here is the type override @kyselyType(('admin' | 'member')) ";
    (0, vitest_1.expect)((0, generateTypeOverrideFromDocumentation_1.generateTypeOverrideFromDocumentation)(docString)).toEqual("('admin' | 'member')");
});
(0, vitest_1.test)("reacts correctly to unbalanced parens", () => {
    const docString = "this is some property \n here is the type override @kyselyType(('admin' | 'member') ";
    (0, vitest_1.expect)((0, generateTypeOverrideFromDocumentation_1.generateTypeOverrideFromDocumentation)(docString)).toEqual(null);
});
(0, vitest_1.test)("reacts correctly to extra parens", () => {
    const docString = "this is some property \n here is the type override @kyselyType(('admin' | 'member'))) ";
    (0, vitest_1.expect)((0, generateTypeOverrideFromDocumentation_1.generateTypeOverrideFromDocumentation)(docString)).toEqual("('admin' | 'member')");
});
(0, vitest_1.test)("finds type following incomplete one", () => {
    const docString = "this is some property \n here is the type @kyselyType( override @kyselyType('admin' | 'member') ";
    (0, vitest_1.expect)((0, generateTypeOverrideFromDocumentation_1.generateTypeOverrideFromDocumentation)(docString)).toEqual("'admin' | 'member'");
});
(0, vitest_1.test)("doesn't do anything in case of no type", () => {
    const docString = "this is some property with no override";
    (0, vitest_1.expect)((0, generateTypeOverrideFromDocumentation_1.generateTypeOverrideFromDocumentation)(docString)).toEqual(null);
});
(0, vitest_1.test)("bails when we have an at sign and no match", () => {
    const docString = "hit me up at squiggly@goofy.af";
    (0, vitest_1.expect)((0, generateTypeOverrideFromDocumentation_1.generateTypeOverrideFromDocumentation)(docString)).toEqual(null);
});
//# sourceMappingURL=generateTypeOverrideFromDocumentation.test.js.map