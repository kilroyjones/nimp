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
var engineTypeToBinaryType_exports = {};
__export(engineTypeToBinaryType_exports, {
  engineTypeToBinaryType: () => engineTypeToBinaryType
});
module.exports = __toCommonJS(engineTypeToBinaryType_exports);
var import_fetch_engine = require("@prisma/fetch-engine");
function engineTypeToBinaryType(engineType) {
  if (engineType === "schemaEngine") {
    return import_fetch_engine.BinaryType.SchemaEngineBinary;
  }
  if (engineType === "queryEngine") {
    return import_fetch_engine.BinaryType.QueryEngineBinary;
  }
  if (engineType === "libqueryEngine") {
    return import_fetch_engine.BinaryType.QueryEngineLibrary;
  }
  throw new Error(`Could not convert engine type ${engineType}`);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  engineTypeToBinaryType
});
