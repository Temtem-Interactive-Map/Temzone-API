import { Page } from "model/page";
import { SearchEntity } from "repository/search/model/search.entity";

export interface SearchRepository {
  update(marker: SearchEntity): Promise<void>;
  search(
    query: string,
    limit: number,
    offset: number
  ): Promise<Page<SearchEntity>>;
}
