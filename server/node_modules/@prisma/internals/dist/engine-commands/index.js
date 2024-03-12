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
var engine_commands_exports = {};
__export(engine_commands_exports, {
  formatSchema: () => import_formatSchema.formatSchema,
  getConfig: () => import_getConfig.getConfig,
  getDMMF: () => import_getDmmf.getDMMF,
  getDirectUrl: () => import_getConfig.getDirectUrl,
  getEffectiveUrl: () => import_getConfig.getEffectiveUrl,
  getEngineVersion: () => import_getEngineVersion.getEngineVersion,
  getEnginesMetaInfo: () => import_getEnginesMetaInfo.getEnginesMetaInfo,
  getLintWarningsAsText: () => import_lintSchema.getLintWarningsAsText,
  handleLintPanic: () => import_lintSchema.handleLintPanic,
  lintSchema: () => import_lintSchema.lintSchema,
  validate: () => import_validate.validate
});
module.exports = __toCommonJS(engine_commands_exports);
var import_formatSchema = require("./formatSchema");
var import_getConfig = require("./getConfig");
var import_getDmmf = require("./getDmmf");
var import_getEnginesMetaInfo = require("./getEnginesMetaInfo");
var import_getEngineVersion = require("./getEngineVersion");
var import_lintSchema = require("./lintSchema");
var import_validate = require("./validate");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatSchema,
  getConfig,
  getDMMF,
  getDirectUrl,
  getEffectiveUrl,
  getEngineVersion,
  getEnginesMetaInfo,
  getLintWarningsAsText,
  handleLintPanic,
  lintSchema,
  validate
});
