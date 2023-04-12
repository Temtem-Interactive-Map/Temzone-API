import { Lyra, create } from "@lyrasearch/lyra";
import { SearchSchema } from "repository/database/lyra.database";

const db = await create<SearchSchema>({
  schema: {
    id: "string",
    title: "string",
    subtitle: "string",
  },
  edge: true,
});

export function getLyraDatabase(): Lyra<SearchSchema> {
  return db;
}
