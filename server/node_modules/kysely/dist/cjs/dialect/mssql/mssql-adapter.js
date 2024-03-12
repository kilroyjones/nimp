"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MssqlAdapter = void 0;
const migrator_js_1 = require("../../migration/migrator.js");
const sql_js_1 = require("../../raw-builder/sql.js");
const dialect_adapter_base_js_1 = require("../dialect-adapter-base.js");
class MssqlAdapter extends dialect_adapter_base_js_1.DialectAdapterBase {
    get supportsCreateIfNotExists() {
        return false;
    }
    get supportsTransactionalDdl() {
        return true;
    }
    get supportsReturning() {
        // mssql should support returning with the `output` clause.
        // we need to figure this out when we'll introduce support for it.
        return false;
    }
    async acquireMigrationLock(db) {
        // Acquire a transaction-level exclusive lock on the migrations table.
        // https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-getapplock-transact-sql?view=sql-server-ver16
        await (0, sql_js_1.sql) `exec sp_getapplock @DbPrincipal = ${sql_js_1.sql.lit('dbo')}, @Resource = ${sql_js_1.sql.lit(migrator_js_1.DEFAULT_MIGRATION_TABLE)}, @LockMode = ${sql_js_1.sql.lit('Exclusive')}`.execute(db);
    }
    async releaseMigrationLock() {
        // Nothing to do here. `sp_getapplock` is automatically released at the
        // end of the transaction and since `supportsTransactionalDdl` true, we know
        // the `db` instance passed to acquireMigrationLock is actually a transaction.
    }
}
exports.MssqlAdapter = MssqlAdapter;
