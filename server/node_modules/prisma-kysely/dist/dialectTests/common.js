"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preparePrisma = exports.generateSchema = exports.MYSQL_URL = exports.POSTGRES_URL = void 0;
const child_process_1 = require("child_process");
const promises_1 = __importDefault(require("fs/promises"));
const util_1 = require("util");
const exec = (0, util_1.promisify)(child_process_1.exec);
exports.POSTGRES_URL = "postgres://postgres:postgres@localhost:22331/postgres";
exports.MYSQL_URL = "mysql://root:mysql@localhost:22332/test";
function generateDatasource(dialect) {
    switch (dialect) {
        case "sqlite":
            return 'provider = "sqlite"\nurl = "file:./dev.db"';
        case "postgresql":
            return `provider = "postgresql"\nurl = "${exports.POSTGRES_URL}"`;
        case "mysql":
            return `provider = "mysql"\nurl = "${exports.MYSQL_URL}"`;
    }
}
const generateSchema = (dialect) => {
    return `datasource db {
        ${generateDatasource(dialect)}
    }
    
    generator kysely {
        provider  = "node ./dist/bin.js"
    }
    
    model Widget {
        int               Int      @id @default(autoincrement())
        dateTime          DateTime @default(now())
        string            String   @default("hello")
        boolean           Boolean  @default(true)
        bytes             Bytes    
        decimal           Decimal  @default(1.0)
        bigInt            BigInt   @default(1)
        float             Float    @default(1.0)
    }`;
};
exports.generateSchema = generateSchema;
const preparePrisma = async (dialect) => {
    console.log("🪄 Deleting old prisma directory");
    await promises_1.default.rm("./prisma", { recursive: true, force: true });
    console.log("🪄 Recreating prisma directory");
    await promises_1.default.mkdir("./prisma");
    console.log("🪄 Writing new schema");
    await promises_1.default.writeFile("./prisma/schema.prisma", (0, exports.generateSchema)(dialect), {
        encoding: "utf-8",
    });
    console.log("🪄 Pushing schema to db");
    await exec("yarn prisma db push --force-reset");
    console.log("🪄 Generating new types");
    await exec("yarn prisma generate");
};
exports.preparePrisma = preparePrisma;
//# sourceMappingURL=common.js.map