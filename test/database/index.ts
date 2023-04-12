import { Lyra, insertBatch, remove } from "@lyrasearch/lyra";
import { Kysely } from "kysely";
import { SearchSchema } from "repository/database/lyra.database";
import { TemzoneDatabase } from "repository/database/sqlite.database";

export async function populateDatabase(
  sqliteDB: Kysely<TemzoneDatabase>,
  lyraDB: Lyra<SearchSchema>
) {
  await Promise.all([
    sqliteDB
      .insertInto("markers")
      .values([
        {
          id: "5bd4650d-3105-5c0c-8a42-141a33180873",
          type: "spawn",
          title: "Ampling",
          subtitle: "Iwaba, Area 2",
          condition: "Requires Fishing Rod",
        },
        {
          id: "31bf1631-972e-56e1-9838-ded1c799356f",
          type: "saipark",
          title: "Saipark",
          subtitle: "West from Praise Coast",
          x: 100,
          y: 200,
        },
        {
          id: "84181c19-eb7f-58c4-aba0-19e189154df2",
          type: "spawn",
          title: "Scarawatt",
          subtitle: "Iwaba, Area 1",
        },
      ])
      .execute(),
    insertBatch(lyraDB, [
      {
        id: "31bf1631-972e-56e1-9838-ded1c799356f",
        title: "Saipark",
        subtitle: "West from Praise Coast",
      },
    ]),
  ]);
}

export async function restoreDatabase(
  sqliteDB: Kysely<TemzoneDatabase>,
  lyraDB: Lyra<SearchSchema>
) {
  const markerIds = await sqliteDB
    .selectFrom("markers")
    .select(["id"])
    .execute();

  await Promise.all([
    sqliteDB.deleteFrom("markers_users").execute(),
    sqliteDB.deleteFrom("markers").execute(),
    markerIds
      .map((marker) => marker.id)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .forEach((id) => remove(lyraDB, id).catch(() => {})),
  ]);
}
