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
var checkTypeScriptVersion_exports = {};
__export(checkTypeScriptVersion_exports, {
  checkTypeScriptVersion: () => checkTypeScriptVersion
});
module.exports = __toCommonJS(checkTypeScriptVersion_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_fs = __toESM(require("fs"));
var import_colors = require("kleur/colors");
var import_path = __toESM(require("path"));
var import__ = require("../../../..");
var import_resolve = require("./resolve");
var import_semverLt = require("./semverLt");
const debug = (0, import_debug.default)("prisma:generator");
async function checkTypeScriptVersion() {
  const minVersion = "4.1.0";
  try {
    const typescriptPath = await (0, import_resolve.resolvePkg)("typescript", {
      basedir: process.cwd()
    });
    debug("typescriptPath", typescriptPath);
    const typescriptPkg = typescriptPath && import_path.default.join(typescriptPath, "package.json");
    if (typescriptPkg && import_fs.default.existsSync(typescriptPkg)) {
      const pjson = require(typescriptPkg);
      const currentVersion = pjson.version;
      if ((0, import_semverLt.semverLt)(currentVersion, minVersion)) {
        import__.logger.warn(
          `Prisma detected that your ${(0, import_colors.bold)(
            "TypeScript"
          )} version ${currentVersion} is outdated. If you want to use Prisma Client with TypeScript please update it to version ${(0, import_colors.bold)(
            minVersion
          )} or ${(0, import_colors.bold)("newer")}. ${(0, import_colors.dim)(`TypeScript found in: ${(0, import_colors.bold)(typescriptPath)}`)}`
        );
      }
    }
  } catch (e) {
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkTypeScriptVersion
});
