import { Data, Lyra, load, save } from "@lyrasearch/lyra";
import { Page } from "model/page";
import { SearchSchema } from "repository/database/lyra.database";
import { SearchEntity } from "repository/search/model/search.entity";
import { SearchRepository } from "repository/search/search.repository";

export class SearchKvRepository implements SearchRepository {
  private readonly db: Lyra<SearchSchema>;
  private readonly cache: KVNamespace;
  private readonly searchRepository: SearchRepository;

  constructor(
    db: Lyra<SearchSchema>,
    cache: KVNamespace,
    searchRepository: SearchRepository
  ) {
    this.db = db;
    this.cache = cache;
    this.searchRepository = searchRepository;
  }

  async update(marker: SearchEntity): Promise<void> {
    await this.searchRepository.update(marker);
    await this.saveDB();
  }

  async search(
    query: string,
    limit: number,
    offset: number
  ): Promise<Page<SearchEntity>> {
    await this.loadDB();

    return await this.searchRepository.search(query, limit, offset);
  }

  private async saveDB(): Promise<void> {
    const data = await save(this.db);

    await this.cache.put("lyra-markers-db", JSON.stringify(data));
  }

  private async loadDB(): Promise<void> {
    const data: Data<SearchSchema> | null = await this.cache.get(
      "lyra-markers-db",
      "json"
    );

    if (data !== null) {
      await load(this.db, data);
    }
  }
}
