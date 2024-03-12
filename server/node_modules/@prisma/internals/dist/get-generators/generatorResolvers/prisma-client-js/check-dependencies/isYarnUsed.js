"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var isYarnUsed_exports = {};
__export(isYarnUsed_exports, {
  isYarnUsed: () => isYarnUsed
});
module.exports = __toCommonJS(isYarnUsed_exports);
var import_ni = require("@antfu/ni");
async function isYarnUsed(baseDir) {
  const packageManager = await (0, import_ni.detect)({ cwd: baseDir, autoInstall: false, programmatic: true });
  return packageManager === "yarn" || packageManager === "yarn@berry";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isYarnUsed
});
