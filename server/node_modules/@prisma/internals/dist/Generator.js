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
var Generator_exports = {};
__export(Generator_exports, {
  Generator: () => Generator
});
module.exports = __toCommonJS(Generator_exports);
var import_generator_helper = require("@prisma/generator-helper");
var import_parseEnvValue = require("./utils/parseEnvValue");
class Generator {
  constructor(executablePath, config, isNode) {
    this.manifest = null;
    this.config = config;
    this.generatorProcess = new import_generator_helper.GeneratorProcess(executablePath, { isNode });
  }
  async init() {
    await this.generatorProcess.init();
    this.manifest = await this.generatorProcess.getManifest(this.config);
  }
  stop() {
    this.generatorProcess.stop();
  }
  generate() {
    if (!this.options) {
      throw new Error(`Please first run .setOptions() on the Generator to initialize the options`);
    }
    return this.generatorProcess.generate(this.options);
  }
  setOptions(options) {
    this.options = options;
  }
  setBinaryPaths(binaryPaths) {
    if (!this.options) {
      throw new Error(`Please first run .setOptions() on the Generator to initialize the options`);
    }
    this.options.binaryPaths = binaryPaths;
  }
  /**
   * Returns the pretty name of the generator specified in the manifest (e.g.,
   * "Prisma Client"), or, if the former is not defined, the generator's
   * provider name (e.g., "prisma-client-js") as a fallback.
   */
  getPrettyName() {
    return this.manifest?.prettyName ?? this.getProvider();
  }
  /**
   * Returns the provider name, parsed and resolved from environment variable
   * if necessary.
   */
  getProvider() {
    return (0, import_parseEnvValue.parseEnvValue)(this.config.provider);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Generator
});
