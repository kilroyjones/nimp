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
var drawBox_exports = {};
__export(drawBox_exports, {
  drawBox: () => drawBox
});
module.exports = __toCommonJS(drawBox_exports);
var import_cli_truncate = __toESM(require("cli-truncate"));
var import_colors = require("kleur/colors");
var import_string_width = __toESM(require("string-width"));
const chars = {
  topLeft: "\u250C",
  topRight: "\u2510",
  bottomRight: "\u2518",
  bottomLeft: "\u2514",
  vertical: "\u2502",
  horizontal: "\u2500"
};
function maxLineLength(str) {
  return str.split("\n").reduce((max, curr) => Math.max(max, (0, import_string_width.default)(curr)), 0) + 2;
}
function drawBox({ title, width, height, str, horizontalPadding }) {
  horizontalPadding = horizontalPadding || 0;
  width = width || 0;
  height = height || 0;
  width = Math.max(width, maxLineLength(str) + horizontalPadding * 2);
  const topLine = title ? (0, import_colors.grey)(chars.topLeft + chars.horizontal) + " " + (0, import_colors.reset)((0, import_colors.bold)(title)) + " " + (0, import_colors.grey)(chars.horizontal.repeat(width - title.length - 2 - 3) + chars.topRight) + (0, import_colors.reset)() : (0, import_colors.grey)(chars.topLeft + chars.horizontal) + (0, import_colors.grey)(chars.horizontal.repeat(width - 3) + chars.topRight);
  const bottomLine = chars.bottomLeft + chars.horizontal.repeat(width - 2) + chars.bottomRight;
  const lines = str.split("\n");
  if (lines.length < height) {
    lines.push(...new Array(height - lines.length).fill(""));
  }
  const mappedLines = lines.slice(-height).map((l) => {
    const lineWidth = Math.min((0, import_string_width.default)(l), width);
    const paddingRight = Math.max(width - lineWidth - 2, 0);
    return `${(0, import_colors.grey)(chars.vertical)}${" ".repeat(horizontalPadding)}${(0, import_colors.reset)((0, import_cli_truncate.default)(l, width - 2))}${" ".repeat(
      paddingRight - horizontalPadding
    )}${(0, import_colors.grey)(chars.vertical)}`;
  }).join("\n");
  return (0, import_colors.grey)(topLine + "\n" + mappedLines + "\n" + bottomLine);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  drawBox
});
