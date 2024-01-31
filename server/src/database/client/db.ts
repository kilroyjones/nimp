import { DB } from "../types/types";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

/**
 * Database connection for postgres with Kysely.
 *
 * TODO: When Dockerized the .env will be loaded through the compose file and
 * this should be moved that. For now it's no exposing anything aside from my
 * super secret password.
 */
const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: "postgresql://postgres:password@localhost:5432/nimp",
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
