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
var checkUnsupportedDataProxy_exports = {};
__export(checkUnsupportedDataProxy_exports, {
  checkUnsupportedDataProxy: () => checkUnsupportedDataProxy,
  forbiddenCmdWithDataProxyFlagMessage: () => forbiddenCmdWithDataProxyFlagMessage
});
module.exports = __toCommonJS(checkUnsupportedDataProxy_exports);
var import_fs = __toESM(require("fs"));
var import_colors = require("kleur/colors");
var import__ = require("..");
var import_getConfig = require("../engine-commands/getConfig");
var import_loadEnvFile = require("../utils/loadEnvFile");
const checkedArgs = {
  // Directly contain connection string
  "--url": true,
  "--to-url": true,
  "--from-url": true,
  "--shadow-database-url": true,
  // Contain path to schema file with connection string (directly or via env var)
  "--schema": true,
  "--from-schema-datamodel": true,
  "--to-schema-datamodel": true
};
const forbiddenCmdWithDataProxyFlagMessage = (command) => `
Using an Accelerate URL is not supported for this CLI command ${(0, import_colors.green)(`prisma ${command}`)} yet.
Please use a direct connection to your database via the datasource \`directUrl\` setting.

More information about this limitation: ${(0, import__.link)("https://pris.ly/d/accelerate-limitations")}
`;
async function checkUnsupportedDataProxyMessage(command, args, implicitSchema) {
  if (implicitSchema === true) {
    args["--schema"] = await (0, import__.getSchemaPath)(args["--schema"]) ?? void 0;
  }
  const argList = Object.entries(args);
  for (const [argName, argValue] of argList) {
    if (argName.includes("url") && argValue.includes("prisma://")) {
      return forbiddenCmdWithDataProxyFlagMessage(command);
    }
    if (argName.includes("schema")) {
      (0, import_loadEnvFile.loadEnvFile)(argValue, false);
      const datamodel = await import_fs.default.promises.readFile(argValue, "utf-8");
      const config = await (0, import__.getConfig)({ datamodel, ignoreEnvVarErrors: true });
      const url = (0, import_getConfig.resolveUrl)((0, import__.getEffectiveUrl)(config.datasources[0]));
      if (url?.startsWith("prisma://")) {
        return forbiddenCmdWithDataProxyFlagMessage(command);
      }
    }
  }
  return void 0;
}
async function checkUnsupportedDataProxy(command, args, implicitSchema) {
  const message = await checkUnsupportedDataProxyMessage(command, args, implicitSchema).catch(() => void 0);
  if (message)
    throw new Error(message);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkUnsupportedDataProxy,
  forbiddenCmdWithDataProxyFlagMessage
});
