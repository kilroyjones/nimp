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
var theme_exports = {};
__export(theme_exports, {
  theme: () => theme
});
module.exports = __toCommonJS(theme_exports);
var import_colors = require("kleur/colors");
const theme = {
  keyword: import_colors.cyan,
  entity: import_colors.cyan,
  value: (s) => (0, import_colors.bold)((0, import_colors.blue)(s)),
  punctuation: import_colors.blue,
  directive: import_colors.cyan,
  function: import_colors.cyan,
  variable: (s) => (0, import_colors.bold)((0, import_colors.blue)(s)),
  string: (s) => (0, import_colors.bold)((0, import_colors.green)(s)),
  boolean: import_colors.yellow,
  number: import_colors.cyan,
  comment: import_colors.gray
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  theme
});
