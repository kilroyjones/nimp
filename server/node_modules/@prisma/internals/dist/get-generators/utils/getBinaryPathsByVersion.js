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
var getBinaryPathsByVersion_exports = {};
__export(getBinaryPathsByVersion_exports, {
  getBinaryPathsByVersion: () => getBinaryPathsByVersion
});
module.exports = __toCommonJS(getBinaryPathsByVersion_exports);
var import_engines = require("@prisma/engines");
var import_fetch_engine = require("@prisma/fetch-engine");
var import_fs_extra = require("fs-extra");
var import_path = __toESM(require("path"));
var import_mapKeys = require("../../utils/mapKeys");
var import_binaryTypeToEngineType = require("../utils/binaryTypeToEngineType");
var import_engineTypeToBinaryType = require("../utils/engineTypeToBinaryType");
async function getBinaryPathsByVersion({
  neededVersions,
  platform,
  version,
  printDownloadProgress,
  skipDownload,
  binaryPathsOverride
}) {
  const binaryPathsByVersion = /* @__PURE__ */ Object.create(null);
  for (const currentVersion in neededVersions) {
    binaryPathsByVersion[currentVersion] = {};
    const neededVersion = neededVersions[currentVersion];
    if (neededVersion.binaryTargets.length === 0) {
      neededVersion.binaryTargets = [{ fromEnvVar: null, value: platform }];
    }
    if (process.env.NETLIFY && !neededVersion.binaryTargets.find((object) => object.value === "rhel-openssl-1.0.x")) {
      neededVersion.binaryTargets.push({
        fromEnvVar: null,
        value: "rhel-openssl-1.0.x"
      });
    }
    let binaryTargetBaseDir = eval(`require('path').join(__dirname, '..')`);
    if (version !== currentVersion) {
      binaryTargetBaseDir = import_path.default.join(binaryTargetBaseDir, `./engines/${currentVersion}/`);
      await (0, import_fs_extra.ensureDir)(binaryTargetBaseDir).catch((e) => console.error(e));
    }
    const binariesConfig = neededVersion.engines.reduce((acc, curr) => {
      if (!binaryPathsOverride?.[curr]) {
        acc[(0, import_engineTypeToBinaryType.engineTypeToBinaryType)(curr)] = binaryTargetBaseDir;
      }
      return acc;
    }, /* @__PURE__ */ Object.create(null));
    if (Object.values(binariesConfig).length > 0) {
      const platforms = neededVersion.binaryTargets.map(
        (binaryTarget) => binaryTarget.value
      );
      const downloadParams = {
        binaries: binariesConfig,
        binaryTargets: platforms,
        showProgress: typeof printDownloadProgress === "boolean" ? printDownloadProgress : true,
        version: currentVersion && currentVersion !== "latest" ? currentVersion : import_engines.enginesVersion,
        skipDownload
      };
      const binaryPathsWithEngineType = await (0, import_fetch_engine.download)(downloadParams);
      const binaryPaths = (0, import_mapKeys.mapKeys)(binaryPathsWithEngineType, import_binaryTypeToEngineType.binaryTypeToEngineType);
      binaryPathsByVersion[currentVersion] = binaryPaths;
    }
    if (binaryPathsOverride) {
      const overrideEngines = Object.keys(binaryPathsOverride);
      const enginesCoveredByOverride = neededVersion.engines.filter((engine) => overrideEngines.includes(engine));
      if (enginesCoveredByOverride.length > 0) {
        for (const engine of enginesCoveredByOverride) {
          const enginePath = binaryPathsOverride[engine];
          binaryPathsByVersion[currentVersion][engine] = {
            [platform]: enginePath
          };
        }
      }
    }
  }
  return binaryPathsByVersion;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getBinaryPathsByVersion
});
