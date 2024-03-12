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
var semverLt_exports = {};
__export(semverLt_exports, {
  semverLt: () => semverLt
});
module.exports = __toCommonJS(semverLt_exports);
function semverLt(a, b) {
  const [major1, minor1, patch1] = a.split(".");
  const [major2, minor2, patch2] = b.split(".");
  if (major1 < major2) {
    return true;
  }
  if (major1 > major2) {
    return false;
  }
  if (minor1 < minor2) {
    return true;
  }
  if (minor1 > minor2) {
    return false;
  }
  if (patch1 < patch2) {
    return true;
  }
  if (patch1 > patch2) {
    return false;
  }
  return false;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  semverLt
});
