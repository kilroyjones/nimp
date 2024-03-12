"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kysely_1 = require("kysely");
const pg_1 = require("pg");
const common_1 = require("./common");
const main = async () => {
    await (0, common_1.preparePrisma)("postgresql");
    const db = new kysely_1.Kysely({
        dialect: new kysely_1.PostgresDialect({
            pool: new pg_1.Pool({
                connectionString: common_1.POSTGRES_URL,
            }),
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
//# sourceMappingURL=postgresql.js.map