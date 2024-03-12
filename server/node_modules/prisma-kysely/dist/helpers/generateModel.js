"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateModel = void 0;
const typescript_1 = __importDefault(require("typescript"));
const generateField_1 = require("./generateField");
const generateFieldType_1 = require("./generateFieldType");
const generateTypeOverrideFromDocumentation_1 = require("./generateTypeOverrideFromDocumentation");
const normalizeCase_1 = require("../utils/normalizeCase");
const defaultTypesImplementedInJS = ["cuid", "uuid"];
const generateModel = (model, config) => {
    const properties = model.fields.flatMap((field) => {
        const isGenerated = field.hasDefaultValue &&
            !(typeof field.default === "object" &&
                "name" in field.default &&
                defaultTypesImplementedInJS.includes(field.default.name));
        const typeOverride = field.documentation
            ? (0, generateTypeOverrideFromDocumentation_1.generateTypeOverrideFromDocumentation)(field.documentation)
            : null;
        if (field.kind === "object" || field.kind === "unsupported")
            return [];
        const dbName = typeof field.dbName === "string" ? field.dbName : null;
        if (field.kind === "enum") {
            return (0, generateField_1.generateField)({
                isId: field.isId,
                name: (0, normalizeCase_1.normalizeCase)(dbName || field.name, config),
                type: typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier(field.type), undefined),
                nullable: !field.isRequired,
                generated: isGenerated,
                list: field.isList,
                documentation: field.documentation,
                config,
            });
        }
        return (0, generateField_1.generateField)({
            name: (0, normalizeCase_1.normalizeCase)(dbName || field.name, config),
            type: typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier((0, generateFieldType_1.generateFieldType)(field.type, config, typeOverride)), undefined),
            nullable: !field.isRequired,
            generated: isGenerated,
            list: field.isList,
            documentation: field.documentation,
            isId: field.isId,
            config,
        });
    });
    return {
        typeName: model.name,
        tableName: model.dbName || model.name,
        definition: typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], typescript_1.default.factory.createIdentifier(model.name), undefined, typescript_1.default.factory.createTypeLiteralNode(properties)),
    };
};
exports.generateModel = generateModel;
//# sourceMappingURL=generateModel.js.map