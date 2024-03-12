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
var load_exports = {};
__export(load_exports, {
  loadLibrary: () => loadLibrary
});
module.exports = __toCommonJS(load_exports);
var import_handleEngineLoadingErrors = require("./handleEngineLoadingErrors");
function loadLibrary(id, platformInfo) {
  try {
    return require(id);
  } catch (e) {
    const errorMessage = (0, import_handleEngineLoadingErrors.handleLibraryLoadingErrors)({
      e,
      platformInfo,
      id
    });
    throw new Error(errorMessage);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  loadLibrary
});
