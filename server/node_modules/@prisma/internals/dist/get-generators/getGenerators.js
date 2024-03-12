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
var getGenerators_exports = {};
__export(getGenerators_exports, {
  getGenerator: () => getGenerator,
  getGenerators: () => getGenerators,
  knownBinaryTargets: () => knownBinaryTargets,
  skipIndex: () => skipIndex
});
module.exports = __toCommonJS(getGenerators_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_engines = require("@prisma/engines");
var import_fetch_engine = require("@prisma/fetch-engine");
var import_get_platform = require("@prisma/get-platform");
var import_fs = __toESM(require("fs"));
var import_colors = require("kleur/colors");
var import_p_map = __toESM(require("p-map"));
var import_path = __toESM(require("path"));
var import__ = require("..");
var import_Generator = require("../Generator");
var import_resolveOutput = require("../resolveOutput");
var import_extractPreviewFeatures = require("../utils/extractPreviewFeatures");
var import_missingDatasource = require("../utils/missingDatasource");
var import_missingGeneratorMessage = require("../utils/missingGeneratorMessage");
var import_parseEnvValue = require("../utils/parseEnvValue");
var import_pick = require("../utils/pick");
var import_printConfigWarnings = require("../utils/printConfigWarnings");
var import_generatorResolvers = require("./generatorResolvers/generatorResolvers");
var import_binaryTypeToEngineType = require("./utils/binaryTypeToEngineType");
var import_checkFeatureFlags = require("./utils/check-feature-flags/checkFeatureFlags");
var import_fixBinaryTargets = require("./utils/fixBinaryTargets");
var import_getBinaryPathsByVersion = require("./utils/getBinaryPathsByVersion");
var import_getEngineVersionForGenerator = require("./utils/getEngineVersionForGenerator");
var import_printGeneratorConfig = require("./utils/printGeneratorConfig");
const debug = (0, import_debug.default)("prisma:getGenerators");
async function getGenerators(options) {
  const {
    schemaPath,
    providerAliases: aliases,
    // do you get the pun?
    version,
    cliVersion,
    printDownloadProgress,
    baseDir = import_path.default.dirname(schemaPath),
    overrideGenerators,
    skipDownload,
    binaryPathsOverride,
    generatorNames = [],
    postinstall,
    noEngine
  } = options;
  if (!schemaPath) {
    throw new Error(`schemaPath for getGenerators got invalid value ${schemaPath}`);
  }
  if (!import_fs.default.existsSync(schemaPath)) {
    throw new Error(`${schemaPath} does not exist`);
  }
  const platform = await (0, import_get_platform.getPlatform)();
  const queryEngineBinaryType = (0, import_engines.getCliQueryEngineBinaryType)();
  const queryEngineType = (0, import_binaryTypeToEngineType.binaryTypeToEngineType)(queryEngineBinaryType);
  let prismaPath = binaryPathsOverride?.[queryEngineType];
  if (version && !prismaPath) {
    const potentialPath = eval(`require('path').join(__dirname, '..')`);
    if (!potentialPath.match(import__.vercelPkgPathRegex)) {
      const downloadParams = {
        binaries: {
          [queryEngineBinaryType]: potentialPath
        },
        binaryTargets: [platform],
        showProgress: false,
        version,
        skipDownload
      };
      const binaryPathsWithEngineType = await (0, import_fetch_engine.download)(downloadParams);
      prismaPath = binaryPathsWithEngineType[queryEngineBinaryType][platform];
    }
  }
  const datamodel = import_fs.default.readFileSync(schemaPath, "utf-8");
  const config = await (0, import__.getConfig)({
    datamodel,
    datamodelPath: schemaPath,
    prismaPath,
    ignoreEnvVarErrors: true
  });
  if (config.datasources.length === 0) {
    throw new Error(import_missingDatasource.missingDatasource);
  }
  (0, import_printConfigWarnings.printConfigWarnings)(config.warnings);
  const previewFeatures = (0, import_extractPreviewFeatures.extractPreviewFeatures)(config);
  const dmmf = await (0, import__.getDMMF)({
    datamodel,
    datamodelPath: schemaPath,
    prismaPath,
    previewFeatures
  });
  if (dmmf.datamodel.models.length === 0) {
    if (config.datasources.some((d) => d.provider === "mongodb")) {
      throw new Error(import_missingGeneratorMessage.missingModelMessageMongoDB);
    }
    throw new Error(import_missingGeneratorMessage.missingModelMessage);
  }
  (0, import_checkFeatureFlags.checkFeatureFlags)(config, options);
  const generatorConfigs = filterGenerators(overrideGenerators || config.generators, generatorNames);
  await validateGenerators(generatorConfigs);
  const runningGenerators = [];
  try {
    const generators = await (0, import_p_map.default)(
      generatorConfigs,
      async (generator, index) => {
        let generatorPath = (0, import_parseEnvValue.parseEnvValue)(generator.provider);
        let paths;
        const providerValue = (0, import_parseEnvValue.parseEnvValue)(generator.provider);
        if (aliases && aliases[providerValue]) {
          generatorPath = aliases[providerValue].generatorPath;
          paths = aliases[providerValue];
        } else if (import_generatorResolvers.generatorResolvers[providerValue]) {
          paths = await import_generatorResolvers.generatorResolvers[providerValue](baseDir, cliVersion);
          generatorPath = paths.generatorPath;
        }
        const generatorInstance = new import_Generator.Generator(generatorPath, generator, paths?.isNode);
        await generatorInstance.init();
        if (generator.output) {
          generator.output = {
            value: import_path.default.resolve(baseDir, (0, import_parseEnvValue.parseEnvValue)(generator.output)),
            fromEnvVar: null
          };
          generator.isCustomOutput = true;
        } else if (paths) {
          generator.output = {
            value: paths.outputPath,
            fromEnvVar: null
          };
        } else {
          if (!generatorInstance.manifest || !generatorInstance.manifest.defaultOutput) {
            throw new Error(
              `Can't resolve output dir for generator ${(0, import_colors.bold)(generator.name)} with provider ${(0, import_colors.bold)(
                generator.provider.value
              )}.
The generator needs to either define the \`defaultOutput\` path in the manifest or you need to define \`output\` in the datamodel.prisma file.`
            );
          }
          generator.output = {
            value: await (0, import_resolveOutput.resolveOutput)({
              defaultOutput: generatorInstance.manifest.defaultOutput,
              baseDir
            }),
            fromEnvVar: "null"
          };
        }
        const options2 = {
          datamodel,
          datasources: config.datasources,
          generator,
          dmmf,
          otherGenerators: skipIndex(generatorConfigs, index),
          schemaPath,
          version: version || import_engines.enginesVersion,
          // this version makes no sense anymore and should be ignored
          postinstall,
          noEngine
        };
        generatorInstance.setOptions(options2);
        runningGenerators.push(generatorInstance);
        return generatorInstance;
      },
      {
        stopOnError: false
        // needed so we can first make sure all generators are created properly, then cleaned up properly
      }
    );
    const generatorProviders = generatorConfigs.map((g) => (0, import_parseEnvValue.parseEnvValue)(g.provider));
    for (const g of generators) {
      if (g.manifest && g.manifest.requiresGenerators && g.manifest.requiresGenerators.length > 0) {
        for (const neededGenerator of g.manifest.requiresGenerators) {
          if (!generatorProviders.includes(neededGenerator)) {
            throw new Error(
              `Generator "${g.manifest.prettyName}" requires generator "${neededGenerator}", but it is missing in your schema.prisma.
Please add it to your schema.prisma:

generator gen {
  provider = "${neededGenerator}"
}
`
            );
          }
        }
      }
    }
    const neededVersions = /* @__PURE__ */ Object.create(null);
    for (const g of generators) {
      if (g.manifest && g.manifest.requiresEngines && Array.isArray(g.manifest.requiresEngines) && g.manifest.requiresEngines.length > 0) {
        const neededVersion = (0, import_getEngineVersionForGenerator.getEngineVersionForGenerator)(g.manifest, version);
        if (!neededVersions[neededVersion]) {
          neededVersions[neededVersion] = { engines: [], binaryTargets: [] };
        }
        for (const engine of g.manifest.requiresEngines) {
          if (!neededVersions[neededVersion].engines.includes(engine)) {
            neededVersions[neededVersion].engines.push(engine);
          }
        }
        const generatorBinaryTargets = g.options?.generator?.binaryTargets;
        if (generatorBinaryTargets && generatorBinaryTargets.length > 0) {
          for (const binaryTarget of generatorBinaryTargets) {
            if (!neededVersions[neededVersion].binaryTargets.find((object) => object.value === binaryTarget.value)) {
              neededVersions[neededVersion].binaryTargets.push(binaryTarget);
            }
          }
        }
      }
    }
    debug("neededVersions", JSON.stringify(neededVersions, null, 2));
    const binaryPathsByVersion = await (0, import_getBinaryPathsByVersion.getBinaryPathsByVersion)({
      neededVersions,
      platform,
      version,
      printDownloadProgress,
      skipDownload,
      binaryPathsOverride
    });
    for (const generator of generators) {
      if (generator.manifest && generator.manifest.requiresEngines) {
        const engineVersion = (0, import_getEngineVersionForGenerator.getEngineVersionForGenerator)(generator.manifest, version);
        const binaryPaths = binaryPathsByVersion[engineVersion];
        const generatorBinaryPaths = (0, import_pick.pick)(binaryPaths, generator.manifest.requiresEngines);
        debug({ generatorBinaryPaths });
        generator.setBinaryPaths(generatorBinaryPaths);
        if (engineVersion !== version && generator.options && generator.manifest.requiresEngines.includes(queryEngineType) && generatorBinaryPaths[queryEngineType] && generatorBinaryPaths[queryEngineType]?.[platform]) {
          const customDmmf = await (0, import__.getDMMF)({
            datamodel,
            datamodelPath: schemaPath,
            prismaPath: generatorBinaryPaths[queryEngineType]?.[platform],
            previewFeatures
          });
          const options2 = { ...generator.options, dmmf: customDmmf };
          debug("generator.manifest.prettyName", generator.manifest.prettyName);
          debug("options", options2);
          debug("options.generator.binaryTargets", options2.generator.binaryTargets);
          generator.setOptions(options2);
        }
      }
    }
    return generators;
  } catch (e) {
    runningGenerators.forEach((g) => g.stop());
    throw e;
  }
}
async function getGenerator(options2) {
  const generators = await getGenerators(options2);
  return generators[0];
}
function skipIndex(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
const knownBinaryTargets = [...import_get_platform.platforms, "native"];
const oldToNewBinaryTargetsMapping = {
  "linux-glibc-libssl1.0.1": "debian-openssl-1.0.x",
  "linux-glibc-libssl1.0.2": "debian-openssl-1.0.x",
  "linux-glibc-libssl1.1.0": "debian-openssl1.1.x"
};
async function validateGenerators(generators) {
  const platform2 = await (0, import_get_platform.getPlatform)();
  for (const generator of generators) {
    if (generator.config.platforms) {
      throw new Error(
        `The \`platforms\` field on the generator definition is deprecated. Please rename it to \`binaryTargets\`.`
      );
    }
    if (generator.config.pinnedBinaryTargets) {
      throw new Error(
        `The \`pinnedBinaryTargets\` field on the generator definition is deprecated.
Please use the PRISMA_QUERY_ENGINE_BINARY env var instead to pin the binary target.`
      );
    }
    if (generator.binaryTargets) {
      const binaryTargets = generator.binaryTargets && generator.binaryTargets.length > 0 ? generator.binaryTargets : [{ fromEnvVar: null, value: "native" }];
      const resolvedBinaryTargets = binaryTargets.flatMap((object) => (0, import_parseEnvValue.parseBinaryTargetsEnvValue)(object)).map((p) => p === "native" ? platform2 : p);
      for (const resolvedBinaryTarget of resolvedBinaryTargets) {
        if (oldToNewBinaryTargetsMapping[resolvedBinaryTarget]) {
          throw new Error(
            `Binary target ${(0, import_colors.red)((0, import_colors.bold)(resolvedBinaryTarget))} is deprecated. Please use ${(0, import_colors.green)(
              (0, import_colors.bold)(oldToNewBinaryTargetsMapping[resolvedBinaryTarget])
            )} instead.`
          );
        }
        if (!knownBinaryTargets.includes(resolvedBinaryTarget)) {
          throw new Error(
            `Unknown binary target ${(0, import_colors.red)(resolvedBinaryTarget)} in generator ${(0, import_colors.bold)(generator.name)}.
Possible binaryTargets: ${(0, import_colors.green)(knownBinaryTargets.join(", "))}`
          );
        }
      }
      if (!resolvedBinaryTargets.includes(platform2)) {
        const originalBinaryTargetsConfig = (0, import_printGeneratorConfig.getOriginalBinaryTargetsValue)(generator.binaryTargets);
        console.log(`${(0, import_colors.yellow)("Warning:")} Your current platform \`${(0, import_colors.bold)(
          platform2
        )}\` is not included in your generator's \`binaryTargets\` configuration ${JSON.stringify(
          originalBinaryTargetsConfig
        )}.
To fix it, use this generator config in your ${(0, import_colors.bold)("schema.prisma")}:
${(0, import_colors.green)(
          (0, import_printGeneratorConfig.printGeneratorConfig)({
            ...generator,
            binaryTargets: (0, import_fixBinaryTargets.fixBinaryTargets)(generator.binaryTargets, platform2)
          })
        )}
${(0, import_colors.gray)(
          `Note, that by providing \`native\`, Prisma Client automatically resolves \`${platform2}\`.
Read more about deploying Prisma Client: ${(0, import_colors.underline)(
            "https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema/generators"
          )}`
        )}
`);
      }
    }
  }
}
function filterGenerators(generators, generatorNames2) {
  if (generatorNames2.length < 1) {
    return generators;
  }
  const filtered = generators.filter((generator) => generatorNames2.includes(generator.name));
  if (filtered.length !== generatorNames2.length) {
    const missings = generatorNames2.filter((name) => filtered.find((generator) => generator.name === name) == null);
    const isSingular = missings.length <= 1;
    throw new Error(
      `The ${isSingular ? "generator" : "generators"} ${(0, import_colors.bold)(missings.join(", "))} specified via ${(0, import_colors.bold)(
        "--generator"
      )} ${isSingular ? "does" : "do"} not exist in your Prisma schema`
    );
  }
  return filtered;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getGenerator,
  getGenerators,
  knownBinaryTargets,
  skipIndex
});
