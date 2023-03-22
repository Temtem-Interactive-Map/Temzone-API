import { getLyraDatabase } from "config/repository/database/lyra.database";
import { SearchLyraRepository } from "repository/search/search.lyra.repository";
import { SearchRepository } from "repository/search/search.repository";

export function getSearchRepository(): SearchRepository {
  const db = getLyraDatabase();
  const searchLyraRepository = new SearchLyraRepository(db);

  return searchLyraRepository;
}
