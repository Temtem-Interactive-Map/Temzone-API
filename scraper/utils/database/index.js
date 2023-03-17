import { statSync } from "node:fs";
import { readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { join } from "path";
import { v5 as uuid } from "uuid";

export function generateFileName(...args) {
  return args
    .join("_")
    .replace(/[^a-zA-Z0-9_ ]/g, "")
    .replace(/ /g, "_")
    .toLowerCase();
}

export function generateId(...args) {
  const id = args.join(" ");

  return uuid(id, uuid.URL);
}

export function lastModifiedDateDBFile(fileName) {
  const path = join(process.cwd(), "database", fileName + ".json");
  const stats = statSync(path);

  return stats.mtime;
}

export async function writeDBFile(fileName, newData) {
  const path = join(process.cwd(), "database", fileName + ".json");
  const oldData = await readFile(path).then((data) => JSON.parse(data));

  if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
    await writeFile(path, JSON.stringify(newData, null, 2));
  }
}

export async function readDBFile(fileName) {
  const path = join(process.cwd(), "database", fileName + ".json");

  await readFile(path).then((data) => JSON.parse(data));
}

export async function removeDBContent(directory) {
  const path = join(process.cwd(), "assets", "static", directory);
  const files = await readdir(path);

  await Promise.all(files.map((file) => unlink(join(path, file))));
}

export async function writeDBImage(fileName, buffer) {
  const path = join(process.cwd(), "assets", "static", fileName);

  await writeFile(path, buffer);
}
