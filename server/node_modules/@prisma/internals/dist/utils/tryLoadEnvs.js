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
var tryLoadEnvs_exports = {};
__export(tryLoadEnvs_exports, {
  exists: () => exists,
  loadEnv: () => loadEnv,
  pathsEqual: () => pathsEqual,
  tryLoadEnvs: () => tryLoadEnvs
});
module.exports = __toCommonJS(tryLoadEnvs_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_dotenv = __toESM(require("dotenv"));
var import_fs = __toESM(require("fs"));
var import_colors = require("kleur/colors");
var import_path = __toESM(require("path"));
var import_dotenvExpand = require("../dotenvExpand");
const debug = (0, import_debug.default)("prisma:tryLoadEnv");
function tryLoadEnvs({
  rootEnvPath,
  schemaEnvPath
}, opts = {
  conflictCheck: "none"
}) {
  const rootEnvInfo = loadEnv(rootEnvPath);
  if (opts.conflictCheck !== "none") {
    checkForConflicts(rootEnvInfo, schemaEnvPath, opts.conflictCheck);
  }
  let schemaEnvInfo = null;
  if (!pathsEqual(rootEnvInfo?.path, schemaEnvPath)) {
    schemaEnvInfo = loadEnv(schemaEnvPath);
  }
  if (!rootEnvInfo && !schemaEnvInfo) {
    debug("No Environment variables loaded");
  }
  if (schemaEnvInfo?.dotenvResult.error) {
    return console.error((0, import_colors.red)((0, import_colors.bold)("Schema Env Error: ")) + schemaEnvInfo.dotenvResult.error);
  }
  const messages = [rootEnvInfo?.message, schemaEnvInfo?.message].filter(Boolean);
  return {
    message: messages.join("\n"),
    parsed: {
      ...rootEnvInfo?.dotenvResult?.parsed,
      ...schemaEnvInfo?.dotenvResult?.parsed
    }
  };
}
function checkForConflicts(rootEnvInfo, envPath, type) {
  const parsedRootEnv = rootEnvInfo?.dotenvResult.parsed;
  const areNotTheSame = !pathsEqual(rootEnvInfo?.path, envPath);
  if (parsedRootEnv && envPath && areNotTheSame && import_fs.default.existsSync(envPath)) {
    const envConfig = import_dotenv.default.parse(import_fs.default.readFileSync(envPath));
    const conflicts = [];
    for (const k in envConfig) {
      if (parsedRootEnv[k] === envConfig[k]) {
        conflicts.push(k);
      }
    }
    if (conflicts.length > 0) {
      const relativeRootEnvPath = import_path.default.relative(process.cwd(), rootEnvInfo.path);
      const relativeEnvPath = import_path.default.relative(process.cwd(), envPath);
      if (type === "error") {
        const message = `There is a conflict between env var${conflicts.length > 1 ? "s" : ""} in ${(0, import_colors.underline)(
          relativeRootEnvPath
        )} and ${(0, import_colors.underline)(relativeEnvPath)}
Conflicting env vars:
${conflicts.map((conflict) => `  ${(0, import_colors.bold)(conflict)}`).join("\n")}

We suggest to move the contents of ${(0, import_colors.underline)(relativeEnvPath)} to ${(0, import_colors.underline)(
          relativeRootEnvPath
        )} to consolidate your env vars.
`;
        throw new Error(message);
      } else if (type === "warn") {
        const message = `Conflict for env var${conflicts.length > 1 ? "s" : ""} ${conflicts.map((c) => (0, import_colors.bold)(c)).join(", ")} in ${(0, import_colors.underline)(relativeRootEnvPath)} and ${(0, import_colors.underline)(relativeEnvPath)}
Env vars from ${(0, import_colors.underline)(relativeEnvPath)} overwrite the ones from ${(0, import_colors.underline)(relativeRootEnvPath)}
      `;
        console.warn(`${(0, import_colors.yellow)("warn(prisma)")} ${message}`);
      }
    }
  }
}
function loadEnv(envPath) {
  if (exists(envPath)) {
    debug(`Environment variables loaded from ${envPath}`);
    return {
      dotenvResult: (0, import_dotenvExpand.dotenvExpand)(
        import_dotenv.default.config({
          path: envPath,
          // Useful to debug dotenv parsing, prints errors & warnings
          // Set to any value to enable
          // Example for empty .env file
          // [dotenv][DEBUG] did not match key and value when parsing line 1:
          //
          // Value needs to be null or undefined, false is truthy
          // https://github.com/motdotla/dotenv/blob/7301ac9be0b2c766f865bbe24280bf82586d25aa/lib/main.js#L89-L91
          debug: process.env.DOTENV_CONFIG_DEBUG ? true : void 0
        })
      ),
      message: (0, import_colors.dim)(`Environment variables loaded from ${import_path.default.relative(process.cwd(), envPath)}`),
      path: envPath
    };
  } else {
    debug(`Environment variables not found at ${envPath}`);
  }
  return null;
}
function pathsEqual(path1, path2) {
  return path1 && path2 && import_path.default.resolve(path1) === import_path.default.resolve(path2);
}
function exists(p) {
  return Boolean(p && import_fs.default.existsSync(p));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  exists,
  loadEnv,
  pathsEqual,
  tryLoadEnvs
});
