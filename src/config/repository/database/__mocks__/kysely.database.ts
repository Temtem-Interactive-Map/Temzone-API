import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import { TemzoneDatabase } from "repository/database/sqlite.database";

const db = new Kysely<TemzoneDatabase>({
  dialect: new SqliteDialect({
    database: new Database(":memory:"),
  }),
});

await db.schema
  .createTable("markers")
  .addColumn("id", "text", (col) => col.notNull())
  .addColumn("type", "text", (col) => col.notNull())
  .addColumn("title", "text", (col) => col.notNull())
  .addColumn("subtitle", "text", (col) => col.notNull())
  .addColumn("condition", "text")
  .addColumn("x", "integer")
  .addColumn("y", "integer")
  .addPrimaryKeyConstraint("markers_pk", ["id"])
  .execute();

await db.schema
  .createTable("markers_users")
  .addColumn("marker_id", "text", (col) => col.notNull())
  .addColumn("user_id", "text", (col) => col.notNull())
  .addPrimaryKeyConstraint("markers_users_pk", ["marker_id", "user_id"])
  .addForeignKeyConstraint(
    "markers_users_marker_id_fk",
    ["marker_id"],
    "markers",
    ["id"]
  )
  .execute();

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export function initSqliteDatabase(_database: D1Database) {}

export function getSqliteDatabase(): Kysely<TemzoneDatabase> {
  return db;
}
