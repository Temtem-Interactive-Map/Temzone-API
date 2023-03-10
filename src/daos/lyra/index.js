import { create, load, save } from "@lyrasearch/lyra";

const db = await create({
  schema: {
    id: "string",
    title: "string",
    subtitle: "string",
  },
  edge: true,
});

export async function getDBClient(ctx) {
  const data = await ctx.env.CACHE.get("lyra-markers-db", "json");

  if (data !== null) {
    await load(db, data);
  }

  return db;
}

export async function saveDBClient(ctx) {
  const data = await save(db);

  await ctx.env.CACHE.put("lyra-markers-db", JSON.stringify(data));
}
