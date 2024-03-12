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
var getPackageCmd_exports = {};
__export(getPackageCmd_exports, {
  getPackageCmd: () => getPackageCmd
});
module.exports = __toCommonJS(getPackageCmd_exports);
var import_ni = require("@antfu/ni");
async function getPackageCmd(cwd, cmd, ...args) {
  const agent = await (0, import_ni.detect)({ autoInstall: false, cwd, programmatic: true });
  return (0, import_ni.getCommand)(agent ?? "npm", cmd, args);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getPackageCmd
});
