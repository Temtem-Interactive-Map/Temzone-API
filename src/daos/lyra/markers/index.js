import { insert, insertBatch, remove, search } from "@lyrasearch/lyra";
import { getDBClient, saveDBClient } from "daos/lyra";

export class LyraMarkerDAO {
  static async insertMany(ctx, markers) {
    const db = await getDBClient(ctx);
    const documents = markers.map((marker) => ({
      id: marker.id,
      title: marker.title,
      subtitle: marker.subtitle,
    }));

    await insertBatch(db, documents);
    await saveDBClient(ctx);
  }

  static async update(ctx, marker) {
    const db = await getDBClient(ctx);

    await remove(db, marker.id);
    await insert(db, {
      id: marker.id,
      title: marker.title,
      subtitle: marker.subtitle,
    });

    await saveDBClient(ctx);
  }

  static async findLikeQuery(ctx, query, limit, offset) {
    const db = await getDBClient(ctx);

    const searchResult = await search(db, {
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

    return {
      items: searchResult.hits.map((hit) => hit.document),
      next:
        offset + searchResult.hits.length < searchResult.count
          ? offset + limit
          : null,
      prev: offset > 0 ? offset - limit : null,
    };
  }
}
