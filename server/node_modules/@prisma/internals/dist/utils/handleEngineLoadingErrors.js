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
var handleEngineLoadingErrors_exports = {};
__export(handleEngineLoadingErrors_exports, {
  handleLibraryLoadingErrors: () => handleLibraryLoadingErrors
});
module.exports = __toCommonJS(handleEngineLoadingErrors_exports);
var import_get_platform = require("@prisma/get-platform");
var import_colors = require("kleur/colors");
var import_ts_pattern = require("ts-pattern");
function handleLibraryLoadingErrors(args) {
  const error = args.e;
  const systemLibraryNotFound = (library) => `Prisma cannot find the required \`${library}\` system library in your system`;
  const hasLinkingProblem = error.message.includes("cannot open shared object file");
  const referToSystemRequirementsDocs = `Please refer to the documentation about Prisma's system requirements: ${(0, import_get_platform.link)(
    "https://pris.ly/d/system-requirements"
  )}`;
  const errorTitle = `Unable to require(\`${(0, import_colors.dim)(args.id)}\`).`;
  const potentialReasonMessage = (0, import_ts_pattern.match)({ message: error.message, code: error.code }).with({ code: "ENOENT" }, () => `File does not exist.`).when(
    ({ message }) => hasLinkingProblem && message.includes("libz"),
    () => {
      return `${systemLibraryNotFound("libz")}. Please install it and try again.`;
    }
  ).when(
    ({ message }) => hasLinkingProblem && message.includes("libgcc_s"),
    () => {
      return `${systemLibraryNotFound("libgcc_s")}. Please install it and try again.`;
    }
  ).when(
    ({ message }) => hasLinkingProblem && message.includes("libssl"),
    () => {
      const libsslVersion = args.platformInfo.libssl ? `openssl-${args.platformInfo.libssl}` : "openssl";
      return `${systemLibraryNotFound("libssl")}. Please install ${libsslVersion} and try again.`;
    }
  ).when(
    ({ message }) => message.includes("GLIBC"),
    () => {
      return `Prisma has detected an incompatible version of the \`glibc\` C standard library installed in your system. This probably means your system may be too old to run Prisma. ${referToSystemRequirementsDocs}`;
    }
  ).when(
    ({ message }) => args.platformInfo.platform === "linux" && message.includes("symbol not found"),
    () => {
      return `The Prisma engines are not compatible with your system ${args.platformInfo.originalDistro} on (${args.platformInfo.archFromUname}) which uses the \`${args.platformInfo.binaryTarget}\` binaryTarget by default. ${referToSystemRequirementsDocs}`;
    }
  ).otherwise(() => {
    return `The Prisma engines do not seem to be compatible with your system. ${referToSystemRequirementsDocs}`;
  });
  return `${errorTitle}
${potentialReasonMessage}

Details: ${error.message}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleLibraryLoadingErrors
});
