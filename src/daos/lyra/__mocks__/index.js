import { create } from "@lyrasearch/lyra";

const db = await create({
  schema: {
    id: "string",
    title: "string",
    subtitle: "string",
  },
  edge: true,
});

export async function getDBClient(_ctx) {
  return db;
}

export async function saveDBClient(_ctx, _db) {}
