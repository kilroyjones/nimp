"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const multiSchemaHelpers_1 = require("./multiSchemaHelpers");
const testDataModel = `generator kysely {
  provider        = "node ./dist/bin.js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider = "postgresql"
  schemas  = ["mammals", "birds"]
  url      = env("TEST_DATABASE_URL")
}

model Elephant {
  id   Int    @id
  name String

  @@map("elephants")
  @@schema("mammals")
}

model Eagle {
  id   Int    @id
  name String

  @@map("eagles")
  @@schema("birds")
}`;
(0, vitest_1.test)("returns a list of models with schemas appended to the table name", () => {
    const initialModels = [
        { typeName: "Elephant", tableName: "elephants" },
        { typeName: "Eagle", tableName: "eagles" },
    ];
    const result = (0, multiSchemaHelpers_1.convertToMultiSchemaModels)(initialModels, testDataModel);
    (0, vitest_1.expect)(result).toEqual([
        { typeName: "Elephant", tableName: "mammals.elephants" },
        { typeName: "Eagle", tableName: "birds.eagles" },
    ]);
});
//# sourceMappingURL=multiSchemaHelpers.test.js.map