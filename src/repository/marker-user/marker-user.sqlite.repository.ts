import { Kysely } from "kysely";
import { Page } from "model/page";
import { TemzoneDatabase } from "repository/database/sqlite.database";
import { MarkerUserRepository } from "repository/marker-user/marker-user.repository";
import { MarkerUserModel } from "./model/marker-user.model";

export class MarkerUserSqliteRepository implements MarkerUserRepository {
  private readonly db: Kysely<TemzoneDatabase>;

  constructor(db: Kysely<TemzoneDatabase>) {
    this.db = db;
  }

  async updateMany(userId: string, markerIds: string[]): Promise<void> {
    const newMarkers = await this.db
      .insertInto("markers_users")
      .values(
        markerIds.map((markerId) => ({
          marker_id: markerId,
          user_id: userId,
        }))
      )
      .onConflict((oc) => oc.doNothing())
      .returningAll()
      .execute();

    await this.db
      .deleteFrom("markers_users")
      .where(({ cmpr, and }) =>
        and([
          cmpr(
            "marker_id",
            "in",
            markerIds.filter(
              (markerId) => !newMarkers.some((m) => m.marker_id === markerId)
            )
          ),
          cmpr("user_id", "=", userId),
        ])
      )
      .execute();
  }

  async getPage(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Page<MarkerUserModel>> {
    const { count } = (await this.db
      .selectFrom("markers")
      .leftJoin("markers_users", "id", "marker_id")
      .select(this.db.fn.countAll().as("count"))
      .where(({ cmpr, and, or }) =>
        and([
          or([cmpr("user_id", "=", userId), cmpr("user_id", "is", null)]),
          cmpr("x", "is not", null),
          cmpr("y", "is not", null),
        ])
      )
      .executeTakeFirstOrThrow()) as { count: number };

    const items = await this.db
      .selectFrom("markers")
      .leftJoin("markers_users", "id", "marker_id")
      .select(["id", "type", "title", "subtitle", "x", "y", "user_id"])
      .where(({ cmpr, and, or }) =>
        and([
          or([cmpr("user_id", "=", userId), cmpr("user_id", "is", null)]),
          cmpr("x", "is not", null),
          cmpr("y", "is not", null),
        ])
      )
      .limit(limit)
      .offset(offset)
      .execute();

    const next = offset + items.length < count ? offset + limit : null;
    const prev =
      offset > 0 && items.length > 0 && offset - limit >= 0
        ? offset - limit
        : null;

    return { items, next, prev };
  }
}
