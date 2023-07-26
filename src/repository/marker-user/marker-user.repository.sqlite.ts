import { Kysely } from "kysely";
import { Page } from "model/page";
import { TemzoneDatabase } from "repository/database/sqlite.database";
import { MarkerUserRepository } from "repository/marker-user/marker-user.repository";
import { MarkerUserModel } from "repository/marker-user/model/marker-user.model";

export class MarkerUserRepositorySqlite implements MarkerUserRepository {
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
        })),
      )
      .onConflict((oc) => oc.doNothing())
      .returningAll()
      .execute();

    await this.db
      .deleteFrom("markers_users")
      .where(({ eb, and }) =>
        and([
          eb(
            "marker_id",
            "in",
            markerIds.filter(
              (markerId) => !newMarkers.some((m) => m.marker_id === markerId),
            ),
          ),
          eb("user_id", "=", userId),
        ]),
      )
      .execute();
  }

  async getPage(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<Page<MarkerUserModel>> {
    const { count } = (await this.db
      .selectFrom("markers")
      .select(this.db.fn.countAll().as("count"))
      .where(({ eb, and }) =>
        and([eb("x", "is not", null), eb("y", "is not", null)]),
      )
      .executeTakeFirstOrThrow()) as { count: number };

    const items = await this.db
      .selectFrom("markers")
      .select(["id", "type", "title", "subtitle", "x", "y"])
      .where(({ eb, and }) =>
        and([eb("x", "is not", null), eb("y", "is not", null)]),
      )
      .limit(limit)
      .offset(offset)
      .execute();

    const ids = (
      await this.db
        .selectFrom("markers_users")
        .select(["marker_id"])
        .where("user_id", "=", userId)
        .execute()
    ).map((markerUser) => markerUser.marker_id);

    const next = offset + items.length < count ? offset + limit : null;
    const prev =
      offset > 0 && items.length > 0 && offset - limit >= 0
        ? offset - limit
        : null;

    return {
      items: items.map((item) => {
        return {
          id: item.id,
          type: item.type,
          title: item.title,
          subtitle: item.subtitle,
          x: item.x as number,
          y: item.y as number,
          obtained: ids.includes(item.id),
        };
      }),
      next,
      prev,
    };
  }
}
