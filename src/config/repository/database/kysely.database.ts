import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { TemzoneDatabase } from "repository/database/sqlite.database";

let db: Kysely<TemzoneDatabase>;

export function initSqliteDatabase(database: D1Database) {
  db = new Kysely({ dialect: new D1Dialect({ database }) });
}

export function getSqliteDatabase(): Kysely<TemzoneDatabase> {
  return db;
}
