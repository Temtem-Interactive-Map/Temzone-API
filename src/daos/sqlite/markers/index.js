import { getDBClient } from "daos/sqlite";

export class SQLiteMarkerDAO {
  static async insert(ctx, marker) {
    const db = getDBClient(ctx);

    await db
      .insertInto("markers")
      .values({
        id: marker.id,
        type: marker.type,
        title: marker.title,
        subtitle: marker.subtitle,
      })
      .executeTakeFirstOrThrow();
  }

  static async update(ctx, marker) {
    const db = getDBClient(ctx);

    await db
      .updateTable("markers")
      .set({
        subtitle: marker.subtitle,
        condition: marker.condition,
        x: marker.x,
        y: marker.y,
      })
      .where("id", "=", marker.id)
      .executeTakeFirstOrThrow();
  }

  static async findById(ctx, id) {
    const db = getDBClient(ctx);

    return await db
      .selectFrom("markers")
      .select(["id", "type", "title", "subtitle", "x", "y"])
      .where("id", "=", id)
      .executeTakeFirstOrThrow();
  }

  static async findByType(ctx, types) {
    const db = getDBClient(ctx);

    return await db
      .selectFrom("markers")
      .select(["id", "type", "title", "subtitle", "condition", "x", "y"])
      .where("type", "in", types)
      .execute();
  }
}
