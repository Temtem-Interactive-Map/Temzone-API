import { Lyra, insert, insertBatch, remove, search } from "@lyrasearch/lyra";
import { Page } from "model/page";
import { SearchSchema } from "repository/database/lyra.database";
import { SearchEntity } from "repository/search/model/search.entity";
import { SearchRepository } from "repository/search/search.repository";

export class SearchLyraRepository implements SearchRepository {
  private readonly db: Lyra<SearchSchema>;

  constructor(db: Lyra<SearchSchema>) {
    this.db = db;
  }

  async insertMany(markers: SearchEntity[]): Promise<void> {
    await insertBatch(this.db, markers as SearchSchema[]);
  }

  async update(marker: SearchEntity): Promise<void> {
    await remove(this.db, marker.id);
    await insert(this.db, marker as SearchSchema);
  }

  async search(
    query: string,
    limit: number,
    offset: number
  ): Promise<Page<SearchEntity>> {
    const result = await search(this.db, {
      term: query,
      properties: ["title", "subtitle"],
      boost: {
        title: 2,
        subtitle: 1.5,
      },
      tolerance: 3,
      limit,
      offset,
    });

    const items = result.hits.map((hit) => hit.document as SearchEntity);
    const next =
      offset + result.hits.length < result.count ? offset + limit : null;
    const prev = offset > 0 ? offset - limit : null;

    return { items, next, prev };
  }
}
