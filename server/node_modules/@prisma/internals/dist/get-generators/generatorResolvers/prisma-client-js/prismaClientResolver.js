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
var prismaClientResolver_exports = {};
__export(prismaClientResolver_exports, {
  debug: () => debug,
  prismaClientResolver: () => prismaClientResolver
});
module.exports = __toCommonJS(prismaClientResolver_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_fs = __toESM(require("fs"));
var import_colors = require("kleur/colors");
var import_path = __toESM(require("path"));
var import_path2 = require("../../../utils/path");
var import_findPrismaClientDir = require("./auto-installation/findPrismaClientDir");
var import_getPackageCmd = require("./auto-installation/getPackageCmd");
var import_runPackageCmd = require("./auto-installation/runPackageCmd");
var import_checkTypeScriptVersion = require("./check-dependencies/checkTypeScriptVersion");
var import_checkYarnVersion = require("./check-dependencies/checkYarnVersion");
var import_isYarnUsed = require("./check-dependencies/isYarnUsed");
var import_resolve = require("./check-dependencies/resolve");
const debug = (0, import_debug.default)("prisma:generator");
async function prismaClientResolver(baseDir, version) {
  let prismaClientDir = await (0, import_findPrismaClientDir.findPrismaClientDir)(baseDir);
  debug("baseDir", baseDir);
  (0, import_checkYarnVersion.checkYarnVersion)();
  await (0, import_checkTypeScriptVersion.checkTypeScriptVersion)();
  if (!prismaClientDir && !process.env.PRISMA_GENERATE_SKIP_AUTOINSTALL) {
    let projectRoot = (0, import_path2.longestCommonPathPrefix)(baseDir, process.cwd());
    debug("projectRoot", projectRoot);
    const warningTag = `${(0, import_colors.bold)("Warning:")} ${(0, import_colors.dim)("[Prisma auto-install on generate]")}`;
    if (projectRoot === void 0) {
      console.warn(
        (0, import_colors.yellow)(
          `${warningTag} The Prisma schema directory ${(0, import_colors.bold)(baseDir)} and the current working directory ${(0, import_colors.bold)(
            process.cwd()
          )} have no common ancestor. The Prisma schema directory will be used as the project root.`
        )
      );
      projectRoot = baseDir;
    }
    if (!import_fs.default.existsSync(import_path.default.join(projectRoot, "package.json"))) {
      console.warn(
        (0, import_colors.yellow)(
          `${warningTag} Prisma could not find a ${(0, import_colors.bold)("package.json")} file in the inferred project root ${(0, import_colors.bold)(
            projectRoot
          )}. During the next step, when an auto-install of Prisma package(s) will be attempted, it will then be created by your package manager on the appropriate level if necessary.`
        )
      );
    }
    const prismaCliDir = await (0, import_resolve.resolvePkg)("prisma", { basedir: baseDir });
    if (process.platform === "win32" && await (0, import_isYarnUsed.isYarnUsed)(baseDir)) {
      const hasCli = (s) => prismaCliDir !== void 0 ? s : "";
      const missingCli = (s) => prismaCliDir === void 0 ? s : "";
      throw new Error(
        `Could not resolve ${missingCli(`${(0, import_colors.bold)("prisma")} and `)}${(0, import_colors.bold)(
          "@prisma/client"
        )} in the current project. Please install ${hasCli("it")}${missingCli("them")} with ${missingCli(
          `${(0, import_colors.bold)((0, import_colors.green)(`${await (0, import_getPackageCmd.getPackageCmd)(baseDir, "add", "prisma", "-D")}`))} and `
        )}${(0, import_colors.bold)((0, import_colors.green)(`${await (0, import_getPackageCmd.getPackageCmd)(baseDir, "add", "@prisma/client")}`))}, and rerun ${(0, import_colors.bold)(
          await (0, import_getPackageCmd.getPackageCmd)(baseDir, "execute", "prisma generate")
        )} \u{1F64F}.`
      );
    }
    if (!prismaCliDir) {
      await (0, import_runPackageCmd.runPackageCmd)(projectRoot, "add", `prisma@${version ?? "latest"}`, "-D");
    }
    await (0, import_runPackageCmd.runPackageCmd)(projectRoot, "add", `@prisma/client@${version ?? "latest"}`);
    prismaClientDir = await (0, import_findPrismaClientDir.findPrismaClientDir)(import_path.default.join(".", baseDir));
    if (!prismaClientDir) {
      throw new Error(
        `Could not resolve @prisma/client despite the installation that we just tried.
Please try to install it by hand with ${(0, import_colors.bold)(
          (0, import_colors.green)(`${await (0, import_getPackageCmd.getPackageCmd)(baseDir, "add", "@prisma/client")}`)
        )} and rerun ${(0, import_colors.bold)(await (0, import_getPackageCmd.getPackageCmd)(baseDir, "execute", "prisma generate"))} \u{1F64F}.`
      );
    }
    console.info(
      `
\u2714 Installed the ${(0, import_colors.bold)((0, import_colors.green)("@prisma/client"))} and ${(0, import_colors.bold)((0, import_colors.green)("prisma"))} packages in your project`
    );
  }
  if (!prismaClientDir) {
    throw new Error(
      `Could not resolve @prisma/client.
Please try to install it with ${(0, import_colors.bold)((0, import_colors.green)("npm install @prisma/client"))} and rerun ${(0, import_colors.bold)(
        await (0, import_getPackageCmd.getPackageCmd)(baseDir, "execute", "prisma generate")
      )} \u{1F64F}.`
    );
  }
  return {
    outputPath: prismaClientDir,
    generatorPath: import_path.default.resolve(prismaClientDir, "generator-build/index.js"),
    isNode: true
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  debug,
  prismaClientResolver
});
