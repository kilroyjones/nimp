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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var src_exports = {};
__export(src_exports, {
  BinaryType: () => import_resolveBinary.BinaryType,
  ClientEngineType: () => import_getClientEngineType.ClientEngineType,
  DEFAULT_CLIENT_ENGINE_TYPE: () => import_getClientEngineType.DEFAULT_CLIENT_ENGINE_TYPE,
  ErrorArea: () => import_panic.ErrorArea,
  Generator: () => import_Generator.Generator,
  HelpError: () => import_Help2.HelpError,
  RustPanic: () => import_panic.RustPanic,
  SchemaEngineExitCode: () => import_schemaEngineCommands2.SchemaEngineExitCode,
  arg: () => import_utils.arg,
  assertNever: () => import_assertNever.assertNever,
  byline: () => import_byline.default,
  callOnceOnSuccess: () => import_callOnce.callOnceOnSuccess,
  canConnectToDatabase: () => import_schemaEngineCommands.canConnectToDatabase,
  canPrompt: () => import_canPrompt.canPrompt,
  checkUnsupportedDataProxy: () => import_checkUnsupportedDataProxy.checkUnsupportedDataProxy,
  chmodPlusX: () => import_chmodPlusX.chmodPlusX,
  createDatabase: () => import_schemaEngineCommands.createDatabase,
  credentialsToUri: () => import_convertCredentials.credentialsToUri,
  drawBox: () => import_drawBox.drawBox,
  dropDatabase: () => import_schemaEngineCommands.dropDatabase,
  engineEnvVarMap: () => import_resolveBinary2.engineEnvVarMap,
  extractPreviewFeatures: () => import_extractPreviewFeatures.extractPreviewFeatures,
  fixBinaryTargets: () => import_fixBinaryTargets.fixBinaryTargets,
  format: () => import_utils.format,
  formatTable: () => import_formatTable.formatTable,
  formatms: () => import_formatms.formatms,
  fsFunctional: () => fsFunctional,
  fsUtils: () => fsUtils,
  getCLIPathHash: () => import_hashes.getCLIPathHash,
  getClientEngineType: () => import_getClientEngineType.getClientEngineType,
  getCommandWithExecutor: () => import_getCommandWithExecutor.getCommandWithExecutor,
  getEnvPaths: () => import_getEnvPaths.getEnvPaths,
  getGenerator: () => import_getGenerators.getGenerator,
  getGeneratorSuccessMessage: () => import_getGeneratorSuccessMessage.getGeneratorSuccessMessage,
  getGenerators: () => import_getGenerators.getGenerators,
  getNodeAPIName: () => import_get_platform.getNodeAPIName,
  getPackedPackage: () => import_getPackedPackage.getPackedPackage,
  getPlatform: () => import_get_platform.getPlatform,
  getPrismaConfigFromPackageJson: () => import_getSchema.getPrismaConfigFromPackageJson,
  getProjectHash: () => import_hashes.getProjectHash,
  getRelativeSchemaPath: () => import_getSchema.getRelativeSchemaPath,
  getSchema: () => import_getSchema.getSchema,
  getSchemaDir: () => import_getSchema.getSchemaDir,
  getSchemaPath: () => import_getSchema.getSchemaPath,
  getSchemaPathFromPackageJson: () => import_getSchema.getSchemaPathFromPackageJson,
  getSchemaPathFromPackageJsonSync: () => import_getSchema.getSchemaPathFromPackageJsonSync,
  getSchemaPathSync: () => import_getSchema.getSchemaPathSync,
  handleLibraryLoadingErrors: () => import_handleEngineLoadingErrors.handleLibraryLoadingErrors,
  handlePanic: () => import_handlePanic.handlePanic,
  hasOwnProperty: () => import_hasOwnProperty.hasOwnProperty,
  highlightDatamodel: () => import_highlight.highlightDatamodel,
  highlightSql: () => import_highlight.highlightSql,
  highlightTS: () => import_highlight.highlightTS,
  isCi: () => import_isCi.isCi,
  isCurrentBinInstalledGlobally: () => import_isCurrentBinInstalledGlobally.isCurrentBinInstalledGlobally,
  isError: () => import_utils.isError,
  isInteractive: () => import_isInteractive.isInteractive,
  isPromiseLike: () => import_isPromiseLike.isPromiseLike,
  isRustPanic: () => import_panic.isRustPanic,
  keyBy: () => import_keyBy.keyBy,
  link: () => import_link.link,
  load: () => import_load.loadLibrary,
  loadEnvFile: () => import_loadEnvFile.loadEnvFile,
  logger: () => logger,
  longestCommonPathPrefix: () => import_path.longestCommonPathPrefix,
  mapObjectValues: () => import_mapObjectValues.mapObjectValues,
  maskSchema: () => import_maskSchema.maskSchema,
  maxBy: () => import_max.maxBy,
  maxWithComparator: () => import_max.maxWithComparator,
  missingGeneratorMessage: () => import_missingGeneratorMessage.missingGeneratorMessage,
  parseBinaryTargetsEnvValue: () => import_parseEnvValue.parseBinaryTargetsEnvValue,
  parseEnvValue: () => import_parseEnvValue.parseEnvValue,
  pathToPosix: () => import_path.pathToPosix,
  pick: () => import_pick.pick,
  platformRegex: () => import_platformRegex.platformRegex,
  printConfigWarnings: () => import_printConfigWarnings.printConfigWarnings,
  printGeneratorConfig: () => import_printGeneratorConfig.printGeneratorConfig,
  protocolToConnectorType: () => import_convertCredentials.protocolToConnectorType,
  resolveBinary: () => import_resolveBinary2.resolveBinary,
  sendPanic: () => import_sendPanic.sendPanic,
  serializeQueryEngineName: () => import_serializeQueryEngineName.serializeQueryEngineName,
  setClassName: () => import_setClassName.setClassName,
  trimBlocksFromSchema: () => import_trimBlocksFromSchema.trimBlocksFromSchema,
  trimNewLine: () => import_trimBlocksFromSchema.trimNewLine,
  tryLoadEnvs: () => import_tryLoadEnvs.tryLoadEnvs,
  unknownCommand: () => import_Help.unknownCommand,
  uriToCredentials: () => import_convertCredentials.uriToCredentials,
  vercelPkgPathRegex: () => import_vercelPkgPathRegex.vercelPkgPathRegex,
  version: () => import_getVersionFromPackageJson.version,
  warnOnce: () => import_warnOnce.warnOnce,
  wasm: () => wasm
});
module.exports = __toCommonJS(src_exports);
var import_checkUnsupportedDataProxy = require("./cli/checkUnsupportedDataProxy");
var import_getGeneratorSuccessMessage = require("./cli/getGeneratorSuccessMessage");
var import_getSchema = require("./cli/getSchema");
var import_hashes = require("./cli/hashes");
var import_Help = require("./cli/Help");
var import_Help2 = require("./cli/Help");
var import_utils = require("./cli/utils");
var import_getClientEngineType = require("./client/getClientEngineType");
var import_convertCredentials = require("./convertCredentials");
__reExport(src_exports, require("./engine-commands"), module.exports);
var import_Generator = require("./Generator");
var import_getGenerators = require("./get-generators/getGenerators");
var import_fixBinaryTargets = require("./get-generators/utils/fixBinaryTargets");
var import_printGeneratorConfig = require("./get-generators/utils/printGeneratorConfig");
var import_getPackedPackage = require("./getPackedPackage");
var import_highlight = require("./highlight/highlight");
var logger = __toESM(require("./logger"));
var import_panic = require("./panic");
var import_resolveBinary = require("./resolveBinary");
var import_resolveBinary2 = require("./resolveBinary");
var import_schemaEngineCommands = require("./schemaEngineCommands");
var import_schemaEngineCommands2 = require("./schemaEngineCommands");
var import_sendPanic = require("./sendPanic");
__reExport(src_exports, require("./tracing/types"), module.exports);
var import_assertNever = require("./utils/assertNever");
var import_byline = __toESM(require("./utils/byline"));
var import_callOnce = require("./utils/callOnce");
var import_canPrompt = require("./utils/canPrompt");
var import_chmodPlusX = require("./utils/chmodPlusX");
var import_drawBox = require("./utils/drawBox");
var import_extractPreviewFeatures = require("./utils/extractPreviewFeatures");
var import_formatms = require("./utils/formatms");
var import_formatTable = require("./utils/formatTable");
var fsFunctional = __toESM(require("./utils/fs-functional"));
var fsUtils = __toESM(require("./utils/fs-utils"));
var import_getCommandWithExecutor = require("./utils/getCommandWithExecutor");
var import_getEnvPaths = require("./utils/getEnvPaths");
var import_getVersionFromPackageJson = require("./utils/getVersionFromPackageJson");
var import_handleEngineLoadingErrors = require("./utils/handleEngineLoadingErrors");
var import_handlePanic = require("./utils/handlePanic");
var import_hasOwnProperty = require("./utils/hasOwnProperty");
var import_isCi = require("./utils/isCi");
var import_isCurrentBinInstalledGlobally = require("./utils/isCurrentBinInstalledGlobally");
var import_isInteractive = require("./utils/isInteractive");
var import_isPromiseLike = require("./utils/isPromiseLike");
var import_keyBy = require("./utils/keyBy");
var import_link = require("./utils/link");
var import_load = require("./utils/load");
var import_loadEnvFile = require("./utils/loadEnvFile");
var import_mapObjectValues = require("./utils/mapObjectValues");
var import_maskSchema = require("./utils/maskSchema");
var import_max = require("./utils/max");
var import_missingGeneratorMessage = require("./utils/missingGeneratorMessage");
var import_parseEnvValue = require("./utils/parseEnvValue");
var import_path = require("./utils/path");
var import_pick = require("./utils/pick");
var import_platformRegex = require("./utils/platformRegex");
var import_printConfigWarnings = require("./utils/printConfigWarnings");
var import_serializeQueryEngineName = require("./utils/serializeQueryEngineName");
var import_setClassName = require("./utils/setClassName");
var import_trimBlocksFromSchema = require("./utils/trimBlocksFromSchema");
var import_tryLoadEnvs = require("./utils/tryLoadEnvs");
var import_vercelPkgPathRegex = require("./utils/vercelPkgPathRegex");
var import_warnOnce = require("./warnOnce");
var wasm = __toESM(require("./wasm"));
var import_get_platform = require("@prisma/get-platform");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BinaryType,
  ClientEngineType,
  DEFAULT_CLIENT_ENGINE_TYPE,
  ErrorArea,
  Generator,
  HelpError,
  RustPanic,
  SchemaEngineExitCode,
  arg,
  assertNever,
  byline,
  callOnceOnSuccess,
  canConnectToDatabase,
  canPrompt,
  checkUnsupportedDataProxy,
  chmodPlusX,
  createDatabase,
  credentialsToUri,
  drawBox,
  dropDatabase,
  engineEnvVarMap,
  extractPreviewFeatures,
  fixBinaryTargets,
  format,
  formatTable,
  formatms,
  fsFunctional,
  fsUtils,
  getCLIPathHash,
  getClientEngineType,
  getCommandWithExecutor,
  getEnvPaths,
  getGenerator,
  getGeneratorSuccessMessage,
  getGenerators,
  getNodeAPIName,
  getPackedPackage,
  getPlatform,
  getPrismaConfigFromPackageJson,
  getProjectHash,
  getRelativeSchemaPath,
  getSchema,
  getSchemaDir,
  getSchemaPath,
  getSchemaPathFromPackageJson,
  getSchemaPathFromPackageJsonSync,
  getSchemaPathSync,
  handleLibraryLoadingErrors,
  handlePanic,
  hasOwnProperty,
  highlightDatamodel,
  highlightSql,
  highlightTS,
  isCi,
  isCurrentBinInstalledGlobally,
  isError,
  isInteractive,
  isPromiseLike,
  isRustPanic,
  keyBy,
  link,
  load,
  loadEnvFile,
  logger,
  longestCommonPathPrefix,
  mapObjectValues,
  maskSchema,
  maxBy,
  maxWithComparator,
  missingGeneratorMessage,
  parseBinaryTargetsEnvValue,
  parseEnvValue,
  pathToPosix,
  pick,
  platformRegex,
  printConfigWarnings,
  printGeneratorConfig,
  protocolToConnectorType,
  resolveBinary,
  sendPanic,
  serializeQueryEngineName,
  setClassName,
  trimBlocksFromSchema,
  trimNewLine,
  tryLoadEnvs,
  unknownCommand,
  uriToCredentials,
  vercelPkgPathRegex,
  version,
  warnOnce,
  wasm,
  ...require("./engine-commands"),
  ...require("./tracing/types")
});
