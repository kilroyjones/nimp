"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kysely_1 = require("kysely");
const mysql2_1 = require("mysql2");
const common_1 = require("./common");
const main = async () => {
    await (0, common_1.preparePrisma)("mysql");
    const db = new kysely_1.Kysely({
        dialect: new kysely_1.MysqlDialect({
            pool: (0, mysql2_1.createPool)({
                user: "root",
                password: "mysql",
                host: "localhost",
                database: "test",
                port: 22332,
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
//# sourceMappingURL=mysql.js.map