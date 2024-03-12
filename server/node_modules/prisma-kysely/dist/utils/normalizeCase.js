"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCase = void 0;
const camelCase_1 = require("./camelCase");
const snakeToCamel = (0, camelCase_1.createCamelCaseMapper)();
const normalizeCase = (name, config) => {
    if (!config.camelCase)
        return name;
    return snakeToCamel(name);
};
exports.normalizeCase = normalizeCase;
//# sourceMappingURL=normalizeCase.js.map