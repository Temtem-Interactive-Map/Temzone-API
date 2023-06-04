import { getLyraDatabase } from "config/repository/database/lyra.database";
import { SearchRepository } from "repository/search/search.repository";
import { SearchRepositoryLyra } from "repository/search/search.repository.lyra";

export function getSearchRepository(): SearchRepository {
  const db = getLyraDatabase();
  const searchRepositoryLyra = new SearchRepositoryLyra(db);

  return searchRepositoryLyra;
}
