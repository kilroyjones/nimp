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
var findPrismaClientDir_exports = {};
__export(findPrismaClientDir_exports, {
  findPrismaClientDir: () => findPrismaClientDir
});
module.exports = __toCommonJS(findPrismaClientDir_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_resolve = require("../check-dependencies/resolve");
const debug = (0, import_debug.default)("prisma:generator");
const realPath = import_fs.default.promises.realpath;
async function findPrismaClientDir(baseDir) {
  const resolveOpts = { basedir: baseDir, preserveSymlinks: true };
  const CLIDir = await (0, import_resolve.resolvePkg)("prisma", resolveOpts);
  const clientDir = await (0, import_resolve.resolvePkg)("@prisma/client", resolveOpts);
  const resolvedClientDir = clientDir && await realPath(clientDir);
  debug("prismaCLIDir", CLIDir);
  debug("prismaClientDir", clientDir);
  if (CLIDir === void 0)
    return resolvedClientDir;
  if (clientDir === void 0)
    return resolvedClientDir;
  const relDir = import_path.default.relative(CLIDir, clientDir).split(import_path.default.sep);
  if (relDir[0] !== ".." || relDir[1] === "..")
    return void 0;
  return resolvedClientDir;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findPrismaClientDir
});
