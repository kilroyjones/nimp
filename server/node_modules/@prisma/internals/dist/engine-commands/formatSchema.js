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
var formatSchema_exports = {};
__export(formatSchema_exports, {
  formatSchema: () => formatSchema
});
module.exports = __toCommonJS(formatSchema_exports);
var import_fs = __toESM(require("fs"));
var import_ts_pattern = require("ts-pattern");
var import__ = require("..");
var import_panic = require("../panic");
var import_wasm = require("../wasm");
var import_lintSchema = require("./lintSchema");
function isSchemaOnly(schemaParams) {
  return Boolean(schemaParams.schema);
}
function isSchemaPathOnly(schemaParams) {
  return Boolean(schemaParams.schemaPath);
}
async function formatSchema({ schemaPath, schema }, inputFormattingOptions) {
  if (!schema && !schemaPath) {
    throw new Error(`Parameter schema or schemaPath must be passed.`);
  }
  if (process.env.FORCE_PANIC_PRISMA_SCHEMA) {
    handleFormatPanic(
      () => {
        import_wasm.prismaSchemaWasm.debug_panic();
      },
      { schemaPath, schema }
    );
  }
  const schemaContent = (0, import_ts_pattern.match)({ schema, schemaPath }).when(isSchemaOnly, ({ schema: _schema }) => _schema).when(isSchemaPathOnly, ({ schemaPath: _schemaPath }) => {
    if (!import_fs.default.existsSync(_schemaPath)) {
      throw new Error(`Schema at ${schemaPath} does not exist.`);
    }
    const _schema = import_fs.default.readFileSync(_schemaPath, { encoding: "utf8" });
    return _schema;
  }).exhaustive();
  const defaultFormattingOptions = {
    tabSize: 2,
    insertSpaces: true
  };
  const documentFormattingParams = {
    textDocument: { uri: "file:/dev/null" },
    options: {
      ...defaultFormattingOptions,
      ...inputFormattingOptions
    }
  };
  const { formattedSchema, lintDiagnostics } = handleFormatPanic(
    () => {
      const formattedSchema2 = formatWasm(schemaContent, documentFormattingParams);
      const lintDiagnostics2 = (0, import_lintSchema.lintSchema)({ schema: formattedSchema2 });
      return { formattedSchema: formattedSchema2, lintDiagnostics: lintDiagnostics2 };
    },
    { schemaPath, schema }
  );
  const lintWarnings = (0, import_lintSchema.getLintWarningsAsText)(lintDiagnostics);
  if (lintWarnings && import__.logger.should.warn()) {
    console.warn(lintWarnings);
  }
  return Promise.resolve(formattedSchema);
}
function handleFormatPanic(tryCb, { schemaPath, schema }) {
  try {
    return tryCb();
  } catch (e) {
    const { message, stack } = (0, import_panic.getWasmError)(e);
    const panic = new import_panic.RustPanic(
      /* message */
      message,
      /* rustStack */
      stack,
      /* request */
      "@prisma/prisma-schema-wasm format",
      import_panic.ErrorArea.FMT_CLI,
      schemaPath,
      schema
    );
    throw panic;
  }
}
function formatWasm(schema, documentFormattingParams) {
  const formattedSchema = import_wasm.prismaSchemaWasm.format(schema, JSON.stringify(documentFormattingParams));
  return formattedSchema;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatSchema
});
