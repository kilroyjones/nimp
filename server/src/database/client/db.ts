import dotenv from "dotenv";

import { DB } from "../types/types";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

dotenv.config({ path: "./.env" });
console.log(process.env.DATABASE_URL_INTERNAL);

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL_INTERNAL,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
