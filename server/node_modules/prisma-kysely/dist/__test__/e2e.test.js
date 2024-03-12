"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const promises_1 = __importDefault(require("fs/promises"));
const util_1 = require("util");
const vitest_1 = require("vitest");
const exec = (0, util_1.promisify)(child_process_1.exec);
(0, vitest_1.beforeEach)(async () => {
    await promises_1.default.rename("./prisma", "./prisma-old").catch(() => { });
});
(0, vitest_1.afterEach)(async () => {
    await promises_1.default
        .rm("./prisma", {
        force: true,
        recursive: true,
    })
        .catch(() => { });
    await promises_1.default.rename("./prisma-old", "./prisma").catch(() => { });
});
(0, vitest_1.test)("End to end test", async () => {
    await exec("yarn prisma init --datasource-provider sqlite");
    await promises_1.default.writeFile("./prisma/schema.prisma", `datasource db {
        provider = "sqlite"
        url      = "file:./dev.db"
    }

    generator kysely {
        provider  = "node ./dist/bin.js"
    }
    
    model TestUser {
        id          String @id
        name        String
        age         Int
        rating      Float
        updatedAt   DateTime
        sprockets   Sprocket[]
    }
    
    model Sprocket {
        id          Int @id
        users       TestUser[]
    }`);
    await exec("yarn prisma generate");
    const generatedSource = await promises_1.default.readFile("./prisma/generated/types.ts", {
        encoding: "utf-8",
    });
    (0, vitest_1.expect)(generatedSource.includes(`export type SprocketToTestUser = {
  A: number;
  B: string;
};`)).toBeTruthy();
    (0, vitest_1.expect)(generatedSource.includes("_SprocketToTestUser: SprocketToTestUser")).toBeTruthy();
}, { timeout: 20000 });
(0, vitest_1.test)("End to end test - with custom type override", async () => {
    await exec("yarn prisma init --datasource-provider sqlite");
    await promises_1.default.writeFile("./prisma/schema.prisma", `datasource db {
        provider = "sqlite"
        url      = "file:./dev.db"
    }

    generator kysely {
        provider  = "node ./dist/bin.js"
    }
    
    model TestUser {
        id          String @id
        name        String

        /// @kyselyType('member' | 'owner')
        role        String
    }`);
    await exec("yarn prisma generate");
    const generatedSource = await promises_1.default.readFile("./prisma/generated/types.ts", {
        encoding: "utf-8",
    });
    (0, vitest_1.expect)(generatedSource.includes(`export type TestUser = {
  id: string;
  name: string;
  /**
   * @kyselyType('member' | 'owner')
   */
  role: "member" | "owner";
};`)).toBeTruthy();
}, { timeout: 20000 });
(0, vitest_1.test)("End to end test - separate entrypoints", async () => {
    await exec("yarn prisma init --datasource-provider mysql");
    await promises_1.default.writeFile("./prisma/schema.prisma", `datasource db {
        provider = "mysql"
        url      = "mysql://root:password@localhost:3306/test"
    }

    generator kysely {
        provider  = "node ./dist/bin.js"
        enumFileName = "enums.ts"
    }

    enum TestEnum {
        A
        B
        C
    }
    
    model TestUser {
        id          String @id
        name        String
        age         Int
        rating      Float
        updatedAt   DateTime
        abc         TestEnum
    }`);
    await exec("yarn prisma generate");
    const typeFile = await promises_1.default.readFile("./prisma/generated/types.ts", {
        encoding: "utf-8",
    });
    (0, vitest_1.expect)(typeFile).not.toContain("export const");
    (0, vitest_1.expect)(typeFile).toContain(`import type { TestEnum } from "./enums";`);
    const enumFile = await promises_1.default.readFile("./prisma/generated/enums.ts", {
        encoding: "utf-8",
    });
    (0, vitest_1.expect)(enumFile).toEqual(`export const TestEnum = {
  A: "A",
  B: "B",
  C: "C",
} as const;
export type TestEnum = (typeof TestEnum)[keyof typeof TestEnum];
`);
}, { timeout: 20000 });
(0, vitest_1.test)("End to end test - separate entrypoints but no enums", async () => {
    await exec("yarn prisma init --datasource-provider sqlite");
    await promises_1.default.writeFile("./prisma/schema.prisma", `datasource db {
        provider = "sqlite"
        url      = "file:./dev.db"
    }

    generator kysely {
        provider  = "node ./dist/bin.js"
        enumFileName = "enums.ts"
    }
    
    model TestUser {
        id          String @id
        name        String
        age         Int
        rating      Float
        updatedAt   DateTime
    }`);
    await exec("yarn prisma db push");
    await exec("yarn prisma generate");
    const typeFile = await promises_1.default.readFile("./prisma/generated/types.ts", {
        encoding: "utf-8",
    });
    (0, vitest_1.expect)(typeFile).not.toContain('from "./enums"');
    (0, vitest_1.expect)(promises_1.default.readFile("./prisma/generated/enums.ts", {
        encoding: "utf-8",
    })).rejects.toThrow();
}, { timeout: 20000 });
(0, vitest_1.test)("End to end test - multi-schema support", async () => {
    await exec("yarn prisma init --datasource-provider postgresql");
    await promises_1.default.writeFile("./prisma/schema.prisma", `generator kysely {
        provider  = "node ./dist/bin.js"
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
    }`);
    await exec("yarn prisma generate");
    const typeFile = await promises_1.default.readFile("./prisma/generated/types.ts", {
        encoding: "utf-8",
    });
    (0, vitest_1.expect)(typeFile).toContain(`export type DB = {
  "birds.eagles": Eagle;
  "mammals.elephants": Elephant;
};`);
}, { timeout: 20000 });
//# sourceMappingURL=e2e.test.js.map