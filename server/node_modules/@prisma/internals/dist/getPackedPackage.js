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
var getPackedPackage_exports = {};
__export(getPackedPackage_exports, {
  getPackedPackage: () => getPackedPackage
});
module.exports = __toCommonJS(getPackedPackage_exports);
var import_fs = __toESM(require("fs"));
var import_npm_packlist = __toESM(require("npm-packlist"));
var import_path = __toESM(require("path"));
var import_read_pkg_up = __toESM(require("read-pkg-up"));
var import_tempy = __toESM(require("tempy"));
var import_resolve = require("./get-generators/generatorResolvers/prisma-client-js/check-dependencies/resolve");
async function getPackedPackage(name, target, packageDir) {
  packageDir = packageDir || await (0, import_resolve.resolvePkg)(name, { basedir: process.cwd() }) || await (0, import_resolve.resolvePkg)(name, { basedir: target });
  if (!packageDir) {
    const pkg = import_read_pkg_up.default.sync({
      cwd: target
    });
    if (pkg && pkg.packageJson.name === name) {
      packageDir = import_path.default.dirname(pkg.path);
    }
  }
  if (!packageDir && import_fs.default.existsSync(import_path.default.join(process.cwd(), "package.json"))) {
    packageDir = process.cwd();
  }
  if (!packageDir) {
    throw new Error(`Error in getPackage: Could not resolve package ${name} from ${process.cwd()} target ${target}`);
  }
  const tmpDir = target ?? import_tempy.default.directory();
  const pkgFiles = await (0, import_npm_packlist.default)({ path: packageDir });
  for (const file of pkgFiles) {
    const src = import_path.default.join(packageDir, file);
    const dest = import_path.default.join(tmpDir, file);
    await import_fs.default.promises.mkdir(import_path.default.dirname(dest), { recursive: true });
    await import_fs.default.promises.copyFile(src, dest);
  }
  return import_path.default.join(tmpDir);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getPackedPackage
});
