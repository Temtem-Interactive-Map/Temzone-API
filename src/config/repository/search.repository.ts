import { getLyraDatabase } from "config/repository/database/lyra.database";
import { SearchRepository } from "repository/search/search.repository";
import { SearchRepositoryKv } from "repository/search/search.repository.kv";
import { SearchRepositoryLyra } from "repository/search/search.repository.lyra";

export function getSearchRepository(cache: KVNamespace): SearchRepository {
  const db = getLyraDatabase();
  const searchRepositoryLyra = new SearchRepositoryLyra(db);
  const searchRepositoryKv = new SearchRepositoryKv(
    db,
    cache,
    searchRepositoryLyra
  );

  return searchRepositoryKv;
}
