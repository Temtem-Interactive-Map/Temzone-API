import { getLyraDatabase } from "config/repository/database/lyra.database";
import { SearchKvRepository } from "repository/search/search.kv.repository";
import { SearchLyraRepository } from "repository/search/search.lyra.repository";
import { SearchRepository } from "repository/search/search.repository";

export function getSearchRepository(cache: KVNamespace): SearchRepository {
  const db = getLyraDatabase();
  const searchLyraRepository = new SearchLyraRepository(db);
  const searchKvRepository = new SearchKvRepository(
    db,
    cache,
    searchLyraRepository
  );

  return searchKvRepository;
}
