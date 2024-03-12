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
var Help_exports = {};
__export(Help_exports, {
  HelpError: () => HelpError,
  unknownCommand: () => unknownCommand
});
module.exports = __toCommonJS(Help_exports);
var import_colors = require("kleur/colors");
function unknownCommand(helpTemplate, cmd) {
  return new HelpError(`
${(0, import_colors.bold)((0, import_colors.red)(`!`))} Unknown command "${cmd}"
${helpTemplate}`);
}
class HelpError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "HelpError";
    Object.setPrototypeOf(this, HelpError.prototype);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HelpError,
  unknownCommand
});
