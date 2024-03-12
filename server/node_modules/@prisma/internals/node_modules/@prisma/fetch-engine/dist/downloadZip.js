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
var downloadZip_exports = {};
__export(downloadZip_exports, {
  downloadZip: () => downloadZip
});
module.exports = __toCommonJS(downloadZip_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_fs = __toESM(require("fs"));
var import_hasha = __toESM(require("hasha"));
var import_node_fetch = __toESM(require("node-fetch"));
var import_p_retry = __toESM(require("p-retry"));
var import_path = __toESM(require("path"));
var import_rimraf = __toESM(require("rimraf"));
var import_tempy = __toESM(require("tempy"));
var import_util = require("util");
var import_zlib = __toESM(require("zlib"));
var import_getProxyAgent = require("./getProxyAgent");
var import_utils = require("./utils");
const debug = (0, import_debug.default)("prisma:fetch-engine:downloadZip");
const del = (0, import_util.promisify)(import_rimraf.default);
async function fetchChecksum(url) {
  try {
    const checksumUrl = `${url}.sha256`;
    const response = await (0, import_node_fetch.default)(checksumUrl, {
      agent: (0, import_getProxyAgent.getProxyAgent)(url)
    });
    if (!response.ok) {
      let errorMessage = `Failed to fetch sha256 checksum at ${checksumUrl}. ${response.status} ${response.statusText}`;
      if (!process.env.PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING) {
        errorMessage += `

If you need to ignore this error (e.g. in an offline environment), set the PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING environment variable to a truthy value.
Example: PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1`;
      }
      throw new Error(errorMessage);
    }
    const body = await response.text();
    const [checksum] = body.split(/\s+/);
    if (!/^[a-f0-9]{64}$/gi.test(checksum)) {
      throw new Error(`Unable to parse checksum from ${checksumUrl} - response body: ${body}`);
    }
    return checksum;
  } catch (error) {
    if (process.env.PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING) {
      debug(
        `fetchChecksum() failed and was ignored as the PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING environment variable is truthy.
Error: ${error}`
      );
      return null;
    }
    throw error;
  }
}
async function downloadZip(url, target, progressCb) {
  const tmpDir = import_tempy.default.directory();
  const partial = import_path.default.join(tmpDir, "partial");
  const RETRIES_COUNT = 2;
  const [zippedSha256, sha256] = await (0, import_p_retry.default)(
    async () => {
      return await Promise.all([fetchChecksum(url), fetchChecksum(url.slice(0, url.length - 3))]);
    },
    {
      retries: RETRIES_COUNT,
      onFailedAttempt: (err) => debug("An error occurred while downloading the checksums files", err)
    }
  );
  const result = await (0, import_p_retry.default)(
    async () => {
      const response = await (0, import_node_fetch.default)(url, {
        compress: false,
        agent: (0, import_getProxyAgent.getProxyAgent)(url)
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch the engine file at ${url}. ${response.status} ${response.statusText}`);
      }
      const lastModified = response.headers.get("last-modified");
      const size = parseFloat(response.headers.get("content-length"));
      const ws = import_fs.default.createWriteStream(partial);
      return await new Promise(async (resolve, reject) => {
        let bytesRead = 0;
        response.body.on("error", reject).on("data", (chunk) => {
          bytesRead += chunk.length;
          if (size && progressCb) {
            progressCb(bytesRead / size);
          }
        });
        const gunzip = import_zlib.default.createGunzip();
        gunzip.on("error", reject);
        const zipStream = response.body.pipe(gunzip);
        const zippedHashPromise = import_hasha.default.fromStream(response.body, {
          algorithm: "sha256"
        });
        const hashPromise = import_hasha.default.fromStream(zipStream, {
          algorithm: "sha256"
        });
        zipStream.pipe(ws);
        ws.on("error", reject).on("close", () => {
          resolve({ lastModified, sha256, zippedSha256 });
        });
        const hash = await hashPromise;
        const zippedHash = await zippedHashPromise;
        if (zippedSha256 !== null && zippedSha256 !== zippedHash) {
          return reject(new Error(`sha256 checksum of ${url} (zipped) should be ${zippedSha256} but is ${zippedHash}`));
        }
        if (sha256 !== null && sha256 !== hash) {
          return reject(new Error(`sha256 checksum of ${url} (unzipped) should be ${sha256} but is ${hash}`));
        }
      });
    },
    {
      retries: RETRIES_COUNT,
      onFailedAttempt: (err) => debug("An error occurred while downloading the engine file", err)
    }
  );
  await (0, import_utils.overwriteFile)(partial, target);
  try {
    await del(partial);
    await del(tmpDir);
  } catch (e) {
    debug(e);
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  downloadZip
});
