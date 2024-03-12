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
var checkYarnVersion_exports = {};
__export(checkYarnVersion_exports, {
  checkYarnVersion: () => checkYarnVersion
});
module.exports = __toCommonJS(checkYarnVersion_exports);
var import_colors = require("kleur/colors");
var import__ = require("../../../..");
var import_semverLt = require("./semverLt");
function checkYarnVersion() {
  if (process.env.npm_config_user_agent) {
    const match = parseUserAgentString(process.env.npm_config_user_agent);
    if (match) {
      const { agent, major, minor, patch } = match;
      if (agent === "yarn" && major === 1) {
        const currentYarnVersion = `${major}.${minor}.${patch}`;
        const minYarnVersion = "1.19.2";
        if ((0, import_semverLt.semverLt)(currentYarnVersion, minYarnVersion)) {
          import__.logger.warn(
            `Your ${(0, import_colors.bold)("yarn")} has version ${currentYarnVersion}, which is outdated. Please update it to ${(0, import_colors.bold)(
              minYarnVersion
            )} or ${(0, import_colors.bold)("newer")} in order to use Prisma.`
          );
        }
      }
    }
  }
}
function parseUserAgentString(str) {
  const userAgentRegex = /(\w+)\/(\d+)\.(\d+)\.(\d+)/;
  const match = userAgentRegex.exec(str);
  if (match) {
    const agent = match[1];
    const major = parseInt(match[2]);
    const minor = parseInt(match[3]);
    const patch = parseInt(match[4]);
    return { agent, major, minor, patch };
  }
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkYarnVersion
});
