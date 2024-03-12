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
var fs_functional_exports = {};
__export(fs_functional_exports, {
  createDirIfNotExists: () => createDirIfNotExists,
  getFilesInDir: () => getFilesInDir,
  getNestedFoldersInDir: () => getNestedFoldersInDir,
  removeDir: () => removeDir,
  removeEmptyDirs: () => removeEmptyDirs,
  removeFile: () => removeFile,
  writeFile: () => writeFile
});
module.exports = __toCommonJS(fs_functional_exports);
var import_function = require("fp-ts/lib/function");
var TE = __toESM(require("fp-ts/lib/TaskEither"));
var import_promises = __toESM(require("fs/promises"));
var fsUtils = __toESM(require("./fs-utils"));
const createDirIfNotExists = (dir) => TE.tryCatch(() => fsUtils.createDirIfNotExists(dir), createTaggedSystemError("fs-create-dir", { dir }));
const writeFile = (params) => TE.tryCatch(() => fsUtils.writeFile(params), createTaggedSystemError("fs-write-file", params));
const removeEmptyDirs = (dir) => TE.tryCatch(() => fsUtils.removeEmptyDirs(dir), createTaggedSystemError("fs-remove-empty-dirs", { dir }));
const removeDir = (dir) => (0, import_function.pipe)(TE.tryCatch(() => import_promises.default.rm(dir, { recursive: true }), createTaggedSystemError("fs-remove-dir", { dir })));
const removeFile = (filePath) => (0, import_function.pipe)(TE.tryCatch(() => import_promises.default.unlink(filePath), createTaggedSystemError("fs-remove-file", { filePath })));
const getNestedFoldersInDir = (dir) => () => fsUtils.getNestedFoldersInDir(dir);
const getFilesInDir = (dir, pattern = "**") => () => fsUtils.getFilesInDir(dir, pattern);
function createTaggedSystemError(type, meta) {
  return (e) => ({
    type,
    error: e,
    meta
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createDirIfNotExists,
  getFilesInDir,
  getNestedFoldersInDir,
  removeDir,
  removeEmptyDirs,
  removeFile,
  writeFile
});
