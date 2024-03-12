"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generator_helper_1 = require("@prisma/generator-helper");
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
const generateDatabaseType_1 = require("./helpers/generateDatabaseType");
const generateFiles_1 = require("./helpers/generateFiles");
const generateImplicitManyToManyModels_1 = require("./helpers/generateImplicitManyToManyModels");
const generateModel_1 = require("./helpers/generateModel");
const sorted_1 = require("./utils/sorted");
const validateConfig_1 = require("./utils/validateConfig");
const writeFileSafely_1 = require("./utils/writeFileSafely");
const generateEnumType_1 = require("./helpers/generateEnumType");
const multiSchemaHelpers_1 = require("./helpers/multiSchemaHelpers");
const { version } = require("../package.json");
(0, generator_helper_1.generatorHandler)({
    onManifest() {
        return {
            version,
            defaultOutput: "./generated",
            prettyName: constants_1.GENERATOR_NAME,
        };
    },
    onGenerate: async (options) => {
        var _a;
        const config = (0, validateConfig_1.validateConfig)({
            ...options.generator.config,
            databaseProvider: options.datasources[0].provider,
        });
        const enums = options.dmmf.datamodel.enums.flatMap(({ name, values }) => {
            return (0, generateEnumType_1.generateEnumType)(name, values);
        });
        const implicitManyToManyModels = (0, generateImplicitManyToManyModels_1.generateImplicitManyToManyModels)(options.dmmf.datamodel.models);
        let models = (0, sorted_1.sorted)([...options.dmmf.datamodel.models, ...implicitManyToManyModels], (a, b) => a.name.localeCompare(b.name)).map((m) => (0, generateModel_1.generateModel)(m, config));
        if ((_a = options.generator.previewFeatures) === null || _a === void 0 ? void 0 : _a.includes("multiSchema")) {
            models = (0, multiSchemaHelpers_1.convertToMultiSchemaModels)(models, options.datamodel);
        }
        const databaseType = (0, generateDatabaseType_1.generateDatabaseType)(models.map((m) => ({ tableName: m.tableName, typeName: m.typeName })), config);
        const files = (0, generateFiles_1.generateFiles)({
            databaseType,
            modelDefinitions: models.map((m) => m.definition),
            enumNames: options.dmmf.datamodel.enums.map((e) => e.name),
            enums,
            enumsOutfile: config.enumFileName,
            typesOutfile: config.fileName,
        });
        await Promise.allSettled(files.map(({ filepath, content }) => {
            var _a;
            const writeLocation = path_1.default.join(((_a = options.generator.output) === null || _a === void 0 ? void 0 : _a.value) || "", filepath);
            return (0, writeFileSafely_1.writeFileSafely)(writeLocation, content);
        }));
    },
});
//# sourceMappingURL=generator.js.map