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
var getEnginesMetaInfo_exports = {};
__export(getEnginesMetaInfo_exports, {
  getEnginesInfo: () => getEnginesInfo,
  getEnginesMetaInfo: () => getEnginesMetaInfo,
  resolveEngine: () => resolveEngine
});
module.exports = __toCommonJS(getEnginesMetaInfo_exports);
var import_engines = require("@prisma/engines");
var import_fetch_engine = require("@prisma/fetch-engine");
var E = __toESM(require("fp-ts/Either"));
var import_function = require("fp-ts/lib/function");
var O = __toESM(require("fp-ts/Option"));
var TE = __toESM(require("fp-ts/TaskEither"));
var import_path = __toESM(require("path"));
var import_ts_pattern = require("ts-pattern");
var import_resolveBinary = require("../resolveBinary");
var import_getEngineVersion = require("./getEngineVersion");
async function getEnginesMetaInfo() {
  const cliQueryEngineBinaryType = (0, import_engines.getCliQueryEngineBinaryType)();
  const engines = [
    {
      name: "query-engine",
      type: cliQueryEngineBinaryType
    },
    {
      name: "schema-engine",
      type: import_fetch_engine.BinaryType.SchemaEngineBinary
    }
  ];
  const enginePromises = engines.map(({ name, type }) => {
    return resolveEngine(type).then((result) => [name, result]);
  });
  const engineMatrix = await Promise.all(enginePromises).then(Object.fromEntries);
  const engineDataAcc = engines.map(({ name }) => {
    const [engineInfo, errors] = getEnginesInfo(engineMatrix[name]);
    return [{ [name]: engineInfo }, errors];
  });
  const engineMetaInfo = engineDataAcc.map((arr) => arr[0]);
  const enginesMetaInfoErrors = engineDataAcc.flatMap((arr) => arr[1]);
  return [engineMetaInfo, enginesMetaInfoErrors];
}
function getEnginesInfo(enginesInfo) {
  const errors = [];
  const resolved = (0, import_ts_pattern.match)(enginesInfo).with({ fromEnvVar: import_ts_pattern.P.when(O.isSome) }, (_engineInfo) => {
    return `, resolved by ${_engineInfo.fromEnvVar.value}`;
  }).otherwise(() => "");
  const absolutePath = (0, import_ts_pattern.match)(enginesInfo).with({ path: import_ts_pattern.P.when(E.isRight) }, (_engineInfo) => {
    return _engineInfo.path.right;
  }).with({ path: import_ts_pattern.P.when(E.isLeft) }, (_engineInfo) => {
    errors.push(_engineInfo.path.left);
    return "E_CANNOT_RESOLVE_PATH";
  }).exhaustive();
  const version = (0, import_ts_pattern.match)(enginesInfo).with({ version: import_ts_pattern.P.when(E.isRight) }, (_engineInfo) => {
    return _engineInfo.version.right;
  }).with({ version: import_ts_pattern.P.when(E.isLeft) }, (_engineInfo) => {
    errors.push(_engineInfo.version.left);
    return "E_CANNOT_RESOLVE_VERSION";
  }).exhaustive();
  const versionMessage = `${version} (at ${import_path.default.relative(process.cwd(), absolutePath)}${resolved})`;
  return [versionMessage, errors];
}
async function resolveEngine(binaryName) {
  const pathFromEnvOption = O.fromNullable((0, import_fetch_engine.getBinaryEnvVarPath)(binaryName));
  const fromEnvVarOption = (0, import_function.pipe)(
    pathFromEnvOption,
    O.map((p) => p.fromEnvVar)
  );
  const enginePathEither = await (0, import_function.pipe)(
    pathFromEnvOption,
    O.fold(
      () => (0, import_resolveBinary.safeResolveBinary)(binaryName),
      (pathFromEnv) => TE.right(pathFromEnv.path)
    )
  )();
  const versionEither = await (0, import_function.pipe)(
    enginePathEither,
    TE.fromEither,
    TE.chain((enginePath) => {
      return (0, import_getEngineVersion.safeGetEngineVersion)(enginePath, binaryName);
    })
  )();
  const engineInfo = {
    path: enginePathEither,
    version: versionEither,
    fromEnvVar: fromEnvVarOption
  };
  return engineInfo;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getEnginesInfo,
  getEnginesMetaInfo,
  resolveEngine
});
