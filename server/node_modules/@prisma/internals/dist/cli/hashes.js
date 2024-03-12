"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var hashes_exports = {};
__export(hashes_exports, {
  getCLIPathHash: () => getCLIPathHash,
  getProjectHash: () => getProjectHash
});
module.exports = __toCommonJS(hashes_exports);
var import_crypto = __toESM(require("crypto"));
var import_getSchema = require("./getSchema");
var import_utils = require("./utils");
async function getProjectHash() {
  const args = (0, import_utils.arg)(process.argv.slice(3), { "--schema": String });
  let projectPath = await (0, import_getSchema.getSchemaPath)(args["--schema"]);
  projectPath = projectPath || process.cwd();
  return import_crypto.default.createHash("sha256").update(projectPath).digest("hex").substring(0, 8);
}
function getCLIPathHash() {
  const cliPath = process.argv[1];
  return import_crypto.default.createHash("sha256").update(cliPath).digest("hex").substring(0, 8);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCLIPathHash,
  getProjectHash
});
