"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyJSDocWorkaround = void 0;
const applyJSDocWorkaround = (comment) => {
    return `*\n * ${comment.split("\n").join("\n * ")}\n `;
};
exports.applyJSDocWorkaround = applyJSDocWorkaround;
//# sourceMappingURL=applyJSDocWorkaround.js.map