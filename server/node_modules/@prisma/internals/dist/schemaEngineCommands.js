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
var schemaEngineCommands_exports = {};
__export(schemaEngineCommands_exports, {
  SchemaEngineExitCode: () => SchemaEngineExitCode,
  canConnectToDatabase: () => canConnectToDatabase,
  createDatabase: () => createDatabase,
  dropDatabase: () => dropDatabase,
  execaCommand: () => execaCommand
});
module.exports = __toCommonJS(schemaEngineCommands_exports);
var import_fetch_engine = require("@prisma/fetch-engine");
var import_execa = __toESM(require("execa"));
var import_resolveBinary = require("./resolveBinary");
var SchemaEngineExitCode = /* @__PURE__ */ ((SchemaEngineExitCode2) => {
  SchemaEngineExitCode2[SchemaEngineExitCode2["Success"] = 0] = "Success";
  SchemaEngineExitCode2[SchemaEngineExitCode2["Error"] = 1] = "Error";
  SchemaEngineExitCode2[SchemaEngineExitCode2["Panic"] = 101] = "Panic";
  return SchemaEngineExitCode2;
})(SchemaEngineExitCode || {});
function parseJsonFromStderr(stderr) {
  const lines = stderr.split(/\r?\n/).slice(1);
  const logs = [];
  for (const line of lines) {
    const data = String(line);
    try {
      const json = JSON.parse(data);
      logs.push(json);
    } catch (e) {
      throw new Error(`Could not parse schema engine response: ${e}`);
    }
  }
  return logs;
}
async function canConnectToDatabase(connectionString, cwd = process.cwd(), schemaEnginePath) {
  if (!connectionString) {
    throw new Error(
      "Connection url is empty. See https://www.prisma.io/docs/reference/database-reference/connection-urls"
    );
  }
  try {
    await execaCommand({
      connectionString,
      cwd,
      schemaEnginePath,
      engineCommandName: "can-connect-to-database"
    });
  } catch (_e) {
    const e = _e;
    if (e.stderr) {
      const logs = parseJsonFromStderr(e.stderr);
      const error = logs.find((it) => it.level === "ERROR" && it.target === "schema_engine::logger");
      if (error && error.fields.error_code && error.fields.message) {
        return {
          code: error.fields.error_code,
          message: error.fields.message
        };
      } else {
        throw new Error(`Schema engine error:
${logs.map((log) => log.fields.message).join("\n")}`);
      }
    } else {
      throw new Error(`Schema engine exited. ${_e}`);
    }
  }
  return true;
}
async function createDatabase(connectionString, cwd = process.cwd(), schemaEnginePath) {
  const dbExists = await canConnectToDatabase(connectionString, cwd, schemaEnginePath);
  if (dbExists === true) {
    return false;
  }
  try {
    await execaCommand({
      connectionString,
      cwd,
      schemaEnginePath,
      engineCommandName: "create-database"
    });
    return true;
  } catch (_e) {
    const e = _e;
    if (e.stderr) {
      const logs = parseJsonFromStderr(e.stderr);
      const error = logs.find((it) => it.level === "ERROR" && it.target === "schema_engine::logger");
      if (error && error.fields.error_code && error.fields.message) {
        throw new Error(`${error.fields.error_code}: ${error.fields.message}`);
      } else {
        throw new Error(`Schema engine error:
${logs.map((log) => log.fields.message).join("\n")}`);
      }
    } else {
      throw new Error(`Schema engine exited. ${_e}`);
    }
  }
}
async function dropDatabase(connectionString, cwd = process.cwd(), schemaEnginePath) {
  try {
    const result = await execaCommand({
      connectionString,
      cwd,
      schemaEnginePath,
      engineCommandName: "drop-database"
    });
    if (result && result.exitCode === 0 && result.stderr.includes("The database was successfully dropped")) {
      return true;
    } else {
      throw Error(`An error occurred during the drop: ${JSON.stringify(result, void 0, 2)}`);
    }
  } catch (e) {
    if (e.stderr) {
      const logs = parseJsonFromStderr(e.stderr);
      throw new Error(`Schema engine error:
${logs.map((log) => log.fields.message).join("\n")}`);
    } else {
      throw new Error(`Schema engine exited. ${e}`);
    }
  }
}
async function execaCommand({
  connectionString,
  cwd,
  schemaEnginePath,
  engineCommandName
}) {
  schemaEnginePath = schemaEnginePath || await (0, import_resolveBinary.resolveBinary)(import_fetch_engine.BinaryType.SchemaEngineBinary);
  try {
    return await (0, import_execa.default)(schemaEnginePath, ["cli", "--datasource", connectionString, engineCommandName], {
      cwd,
      env: {
        RUST_BACKTRACE: process.env.RUST_BACKTRACE ?? "1",
        RUST_LOG: process.env.RUST_LOG ?? "info"
      }
    });
  } catch (_e) {
    const e = _e;
    if (e.message) {
      e.message = e.message.replace(connectionString, "<REDACTED>");
    }
    if (e.stdout) {
      e.stdout = e.stdout.replace(connectionString, "<REDACTED>");
    }
    if (e.stderr) {
      e.stderr = e.stderr.replace(connectionString, "<REDACTED>");
    }
    throw e;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SchemaEngineExitCode,
  canConnectToDatabase,
  createDatabase,
  dropDatabase,
  execaCommand
});
