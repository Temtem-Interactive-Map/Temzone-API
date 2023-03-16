import { Page } from "model/page";
import { SearchEntity } from "repository/search/model/search.entity";

export interface SearchRepository {
  insertMany(markers: SearchEntity[]): Promise<void>;
  update(marker: SearchEntity): Promise<void>;
  search(
    query: string,
    limit: number,
    offset: number
  ): Promise<Page<SearchEntity>>;
}
