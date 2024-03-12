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
var getGeneratorSuccessMessage_exports = {};
__export(getGeneratorSuccessMessage_exports, {
  getGeneratorSuccessMessage: () => getGeneratorSuccessMessage
});
module.exports = __toCommonJS(getGeneratorSuccessMessage_exports);
var import_colors = require("kleur/colors");
var import_path = __toESM(require("path"));
var import_getClientEngineType = require("../client/getClientEngineType");
var import_formatms = require("../utils/formatms");
var import_parseEnvValue = require("../utils/parseEnvValue");
function getGeneratorSuccessMessage(generator, time) {
  const name = generator.getPrettyName();
  const version = formatVersion(generator);
  const to = formatOutput(generator);
  return `\u2714 Generated ${(0, import_colors.bold)(name)}${version ? ` (${version})` : ""}${to} in ${(0, import_formatms.formatms)(time)}`;
}
function formatVersion(generator) {
  const version = generator.manifest?.version;
  if (generator.getProvider() === "prisma-client-js") {
    const engineType = (0, import_getClientEngineType.getClientEngineType)(generator.config);
    let engineHint = "";
    if (generator.options?.noEngine) {
      engineHint = ", engine=none";
    } else if (engineType === "binary") {
      engineHint = ", engine=binary";
    } else if (engineType === "library") {
      engineHint = "";
    }
    return `v${version ?? "?.?.?"}${engineHint}`;
  }
  return version;
}
function formatOutput(generator) {
  const output = generator.options?.generator.output;
  return output ? (0, import_colors.dim)(` to .${import_path.default.sep}${import_path.default.relative(process.cwd(), (0, import_parseEnvValue.parseEnvValue)(output))}`) : "";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getGeneratorSuccessMessage
});
