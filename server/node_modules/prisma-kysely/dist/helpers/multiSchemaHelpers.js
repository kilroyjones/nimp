"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToMultiSchemaModels = void 0;
const prisma_ast_1 = require("@mrleebo/prisma-ast");
const convertToMultiSchemaModels = (models, dataModelStr) => {
    const parsedSchema = (0, prisma_ast_1.getSchema)(dataModelStr);
    const multiSchemaMap = new Map(parsedSchema.list
        .filter((block) => block.type === "model")
        .map((model) => {
        var _a;
        const schemaProperty = model.properties.find((prop) => prop.type === "attribute" && prop.name === "schema");
        const schemaName = (_a = schemaProperty === null || schemaProperty === void 0 ? void 0 : schemaProperty.args) === null || _a === void 0 ? void 0 : _a[0].value;
        if (typeof schemaName !== "string") {
            return [model.name, ""];
        }
        return [model.name, schemaName.replace(/"/g, "")];
    }));
    return models.map((model) => {
        const schemaName = multiSchemaMap.get(model.typeName);
        if (!schemaName) {
            return model;
        }
        return { ...model, tableName: `${schemaName}.${model.tableName}` };
    });
};
exports.convertToMultiSchemaModels = convertToMultiSchemaModels;
//# sourceMappingURL=multiSchemaHelpers.js.map