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
var fs_utils_exports = {};
__export(fs_utils_exports, {
  createDirIfNotExists: () => createDirIfNotExists,
  getFilesInDir: () => getFilesInDir,
  getNestedFoldersInDir: () => getNestedFoldersInDir,
  getTopLevelFoldersInDir: () => getTopLevelFoldersInDir,
  removeEmptyDirs: () => removeEmptyDirs,
  writeFile: () => writeFile
});
module.exports = __toCommonJS(fs_utils_exports);
var import_promises = __toESM(require("fs/promises"));
var import_globby = __toESM(require("globby"));
var import_path = __toESM(require("path"));
var import_path2 = require("./path");
function createDirIfNotExists(dir) {
  return import_promises.default.mkdir(dir, { recursive: true });
}
function writeFile({ path: path2, content }) {
  return import_promises.default.writeFile(path2, content, { encoding: "utf-8" });
}
async function getTopLevelFoldersInDir(dir) {
  const rawFolders = await import_promises.default.readdir(dir, { withFileTypes: true });
  return rawFolders.filter((fileOrFolder) => fileOrFolder.isDirectory()).map((folder) => (0, import_path2.pathToPosix)(import_path.default.join(dir, folder.name)));
}
function getNestedFoldersInDir(dir) {
  const normalizedDir = (0, import_path2.pathToPosix)(import_path.default.join(dir, "**"));
  return (0, import_globby.default)(normalizedDir, { onlyFiles: false, onlyDirectories: true });
}
function getFilesInDir(dir, pattern = "**") {
  const normalizedDir = (0, import_path2.pathToPosix)(import_path.default.join(dir, pattern));
  return (0, import_globby.default)(normalizedDir, { onlyFiles: true, onlyDirectories: false });
}
async function removeEmptyDirs(dir) {
  try {
    const fileStats = await import_promises.default.lstat(dir);
    if (!fileStats.isDirectory()) {
      return;
    }
  } catch (e) {
    return;
  }
  const filenames = await import_promises.default.readdir(dir);
  if (filenames.length > 0) {
    const recursionPromises = filenames.map((filename) => removeEmptyDirs(import_path.default.join(dir, filename)));
    await Promise.all(recursionPromises);
  }
  const filenamesAfterRec = await import_promises.default.readdir(dir);
  if (filenamesAfterRec.length === 0) {
    await import_promises.default.rmdir(dir);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createDirIfNotExists,
  getFilesInDir,
  getNestedFoldersInDir,
  getTopLevelFoldersInDir,
  removeEmptyDirs,
  writeFile
});
