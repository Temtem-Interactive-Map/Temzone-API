import { Lyra, getByID, insert, remove, search } from "@lyrasearch/lyra";
import { Page } from "model/page";
import { SearchSchema } from "repository/database/lyra.database";
import { SearchEntity } from "repository/search/model/search.entity";
import { SearchRepository } from "repository/search/search.repository";

export class SearchRepositoryLyra implements SearchRepository {
  private readonly db: Lyra<SearchSchema>;

  constructor(db: Lyra<SearchSchema>) {
    this.db = db;
  }

  async update(marker: SearchEntity): Promise<void> {
    const document = await getByID(this.db, marker.id);

    if (document) {
      await remove(this.db, marker.id);
    }

    await insert(this.db, {
      id: marker.id,
      type: marker.type,
      title: marker.title,
      subtitle: marker.subtitle,
      x: marker.x,
      y: marker.y,
    });
  }

  async search(
    query: string,
    limit: number,
    offset: number,
  ): Promise<Page<SearchEntity>> {
    const result = await search(this.db, {
      term: query,
      properties: ["title", "subtitle"],
      boost: {
        title: 1,
        subtitle: 0.2,
      },
      tolerance: 3,
      limit,
      offset,
    });

    const items = result.hits.map((hit) => hit.document as SearchEntity);
    const next =
      offset + result.hits.length < result.count ? offset + limit : null;
    const prev =
      offset > 0 && result.hits.length > 0 && offset - limit >= 0
        ? offset - limit
        : null;

    return { items, next, prev };
  }
}
