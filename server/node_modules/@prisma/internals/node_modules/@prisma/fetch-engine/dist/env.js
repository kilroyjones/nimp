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
var env_exports = {};
__export(env_exports, {
  allEngineEnvVarsSet: () => allEngineEnvVarsSet,
  deprecatedEnvVarMap: () => deprecatedEnvVarMap,
  engineEnvVarMap: () => engineEnvVarMap,
  getBinaryEnvVarPath: () => getBinaryEnvVarPath
});
module.exports = __toCommonJS(env_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_fs = __toESM(require("fs"));
var import_colors = require("kleur/colors");
var import_path = __toESM(require("path"));
var import_BinaryType = require("./BinaryType");
const debug = (0, import_debug.default)("prisma:fetch-engine:env");
const engineEnvVarMap = {
  [import_BinaryType.BinaryType.QueryEngineBinary]: "PRISMA_QUERY_ENGINE_BINARY",
  [import_BinaryType.BinaryType.QueryEngineLibrary]: "PRISMA_QUERY_ENGINE_LIBRARY",
  [import_BinaryType.BinaryType.SchemaEngineBinary]: "PRISMA_SCHEMA_ENGINE_BINARY"
};
const deprecatedEnvVarMap = {
  [import_BinaryType.BinaryType.SchemaEngineBinary]: "PRISMA_MIGRATION_ENGINE_BINARY"
};
function getBinaryEnvVarPath(binaryName) {
  const envVar = getEnvVarToUse(binaryName);
  if (process.env[envVar]) {
    const envVarPath = import_path.default.resolve(process.cwd(), process.env[envVar]);
    if (!import_fs.default.existsSync(envVarPath)) {
      throw new Error(
        `Env var ${(0, import_colors.bold)(envVar)} is provided but provided path ${(0, import_colors.underline)(process.env[envVar])} can't be resolved.`
      );
    }
    debug(
      `Using env var ${(0, import_colors.bold)(envVar)} for binary ${(0, import_colors.bold)(binaryName)}, which points to ${(0, import_colors.underline)(
        process.env[envVar]
      )}`
    );
    return {
      path: envVarPath,
      fromEnvVar: envVar
    };
  }
  return null;
}
function getEnvVarToUse(binaryType) {
  const envVar = engineEnvVarMap[binaryType];
  const deprecatedEnvVar = deprecatedEnvVarMap[binaryType];
  if (deprecatedEnvVar && process.env[deprecatedEnvVar]) {
    if (process.env[envVar]) {
      console.warn(
        `${(0, import_colors.yellow)("prisma:warn")} Both ${(0, import_colors.bold)(envVar)} and ${(0, import_colors.bold)(deprecatedEnvVar)} are specified, ${(0, import_colors.bold)(
          envVar
        )} takes precedence. ${(0, import_colors.bold)(deprecatedEnvVar)} is deprecated.`
      );
      return envVar;
    } else {
      console.warn(
        `${(0, import_colors.yellow)("prisma:warn")} ${(0, import_colors.bold)(deprecatedEnvVar)} environment variable is deprecated, please use ${(0, import_colors.bold)(
          envVar
        )} instead`
      );
      return deprecatedEnvVar;
    }
  }
  return envVar;
}
function allEngineEnvVarsSet(binaries) {
  for (const binaryType of binaries) {
    if (!getBinaryEnvVarPath(binaryType)) {
      return false;
    }
  }
  return true;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  allEngineEnvVarsSet,
  deprecatedEnvVarMap,
  engineEnvVarMap,
  getBinaryEnvVarPath
});
