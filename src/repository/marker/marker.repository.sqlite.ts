import { Kysely } from "kysely";
import { Page } from "model/page";
import { TemzoneDatabase } from "repository/database/sqlite.database";
import { MarkerRepository } from "repository/marker/marker.repository";
import { MarkerEntity } from "repository/marker/model/marker.entity";

export class MarkerRepositorySqlite implements MarkerRepository {
  private readonly db: Kysely<TemzoneDatabase>;

  constructor(db: Kysely<TemzoneDatabase>) {
    this.db = db;
  }

  async insertMany(markers: MarkerEntity[]): Promise<MarkerEntity[]> {
    return await this.db
      .insertInto("markers")
      .values(markers)
      .onConflict((oc) => oc.doNothing())
      .returningAll()
      .execute();
  }

  async updateSpawn(
    id: string,
    subtitle: string,
    condition: string | null,
    x: number,
    y: number
  ): Promise<MarkerEntity> {
    return await this.db
      .updateTable("markers")
      .set({ subtitle, condition, x, y })
      .where(({ cmpr, and }) =>
        and([cmpr("id", "=", id), cmpr("type", "=", "spawn")])
      )
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateSaipark(id: string, x: number, y: number): Promise<MarkerEntity> {
    return await this.db
      .updateTable("markers")
      .set({ x, y })
      .where(({ cmpr, and }) =>
        and([cmpr("id", "=", id), cmpr("type", "=", "saipark")])
      )
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findById(id: string): Promise<MarkerEntity> {
    return await this.db
      .selectFrom("markers")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirstOrThrow();
  }

  async getPage(limit: number, offset: number): Promise<Page<MarkerEntity>> {
    const { count } = (await this.db
      .selectFrom("markers")
      .select(this.db.fn.countAll().as("count"))
      .executeTakeFirstOrThrow()) as { count: number };

    const items = await this.db
      .selectFrom("markers")
      .selectAll()
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

  async getByIds(ids: string[]): Promise<MarkerEntity[]> {
    return await this.db
      .selectFrom("markers")
      .selectAll()
      .where("id", "in", ids)
      .execute();
  }
}
