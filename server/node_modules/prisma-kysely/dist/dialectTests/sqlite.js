"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const kysely_1 = require("kysely");
const common_1 = require("./common");
const main = async () => {
    await (0, common_1.preparePrisma)("sqlite");
    const db = new kysely_1.Kysely({
        dialect: new kysely_1.SqliteDialect({
            database: new better_sqlite3_1.default("./prisma/dev.db"),
        }),
    });
    await db
        .insertInto("Widget")
        .values({ bytes: Buffer.from([]) })
        .execute();
    const result = await db
        .selectFrom("Widget")
        .selectAll()
        .executeTakeFirstOrThrow();
    const entries = Object.entries(result).map(([key, value]) => ({
        key,
        value,
        typeOf: typeof value,
    }));
    entries.sort((a, b) => a.key.localeCompare(b.key));
    console.table(entries);
    await db.destroy();
};
main();
//# sourceMappingURL=sqlite.js.map