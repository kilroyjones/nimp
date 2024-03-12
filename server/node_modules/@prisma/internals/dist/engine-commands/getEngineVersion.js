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
var getEngineVersion_exports = {};
__export(getEngineVersion_exports, {
  getEngineVersion: () => getEngineVersion,
  safeGetEngineVersion: () => safeGetEngineVersion
});
module.exports = __toCommonJS(getEngineVersion_exports);
var import_engines = require("@prisma/engines");
var import_fetch_engine = require("@prisma/fetch-engine");
var import_get_platform = require("@prisma/get-platform");
var import_execa = __toESM(require("execa"));
var TE = __toESM(require("fp-ts/TaskEither"));
var import_resolveBinary = require("../resolveBinary");
var import_load = require("../utils/load");
async function getEngineVersion(enginePath, binaryName) {
  if (!binaryName) {
    binaryName = (0, import_engines.getCliQueryEngineBinaryType)();
  }
  enginePath = await (0, import_resolveBinary.resolveBinary)(binaryName, enginePath);
  const platformInfo = await (0, import_get_platform.getPlatformInfo)();
  if (binaryName === import_fetch_engine.BinaryType.QueryEngineLibrary) {
    (0, import_get_platform.assertNodeAPISupported)();
    const QE = (0, import_load.loadLibrary)(enginePath, platformInfo);
    return `${import_fetch_engine.BinaryType.QueryEngineLibrary} ${QE.version().commit}`;
  } else {
    const { stdout } = await (0, import_execa.default)(enginePath, ["--version"]);
    return stdout;
  }
}
function safeGetEngineVersion(enginePath, binaryName) {
  return TE.tryCatch(
    () => getEngineVersion(enginePath, binaryName),
    (error) => error
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getEngineVersion,
  safeGetEngineVersion
});
