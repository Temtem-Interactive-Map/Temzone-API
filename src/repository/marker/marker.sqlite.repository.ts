import { Kysely } from "kysely";
import { TemzoneDatabase } from "repository/database/sqlite.database";
import { MarkerRepository } from "repository/marker/marker.repository";
import { MarkerEntity } from "repository/marker/model/marker.entity";

export class MarkerSqliteRepository implements MarkerRepository {
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
      .where("id", "=", id)
      .where("type", "=", "spawn")
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateSaipark(id: string, x: number, y: number): Promise<MarkerEntity> {
    return await this.db
      .updateTable("markers")
      .set({ x, y })
      .where("id", "=", id)
      .where("type", "=", "saipark")
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

  async findByIds(ids: string[]): Promise<MarkerEntity[]> {
    return await this.db
      .selectFrom("markers")
      .selectAll()
      .where("id", "in", ids)
      .execute();
  }

  async findByTypes(types: string[]): Promise<MarkerEntity[]> {
    return await this.db
      .selectFrom("markers")
      .selectAll()
      .where("type", "in", types)
      .orderBy("title", "asc")
      .orderBy("subtitle", "asc")
      .execute();
  }
}
