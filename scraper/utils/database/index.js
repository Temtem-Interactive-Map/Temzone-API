import { readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { join } from "path";
import { v5 as uuidv5 } from "uuid";

export function generateFileName(...args) {
  return args
    .join("_")
    .replace(/[^a-zA-Z0-9_ ]/g, "")
    .replace(/ /g, "_")
    .toLowerCase();
}

export function generateId(...args) {
  const id = args.join(" ");

  return uuidv5(id, uuidv5.URL);
}

export async function writeDBFile(fileName, data) {
  const path = join(process.cwd(), "database", fileName + ".json");

  return await writeFile(path, JSON.stringify(data, null, 2));
}

export async function readDBFile(fileName) {
  const path = join(process.cwd(), "database", fileName + ".json");

  return await readFile(path).then((data) => JSON.parse(data));
}

export async function removeDBContent(directory) {
  const path = join(process.cwd(), "assets", "static", directory);
  const files = await readdir(path);

  return await Promise.all(files.map((file) => unlink(join(path, file))));
}

export async function writeDBImage(fileName, buffer) {
  const path = join(process.cwd(), "assets", "static", fileName);

  return await writeFile(path, buffer);
}
