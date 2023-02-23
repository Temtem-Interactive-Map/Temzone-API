import { readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DB_PATH = join(process.cwd(), "database");
const STATIC_PATH = join(process.cwd(), "assets", "static");

export async function writeDBFile(fileName, data) {
  const path = join(DB_PATH, fileName + ".json");

  return await writeFile(path, JSON.stringify(data, null, 2));
}

export async function readDBFile(fileName) {
  const path = join(DB_PATH, fileName + ".json");

  return await readFile(path).then((data) => JSON.parse(data));
}

export async function removeDBContent(directory) {
  const path = join(STATIC_PATH, directory);
  const files = await readdir(path);

  return await Promise.all(files.map((file) => unlink(join(path, file))));
}

export async function writeDBImage(fileName, buffer) {
  const path = join(STATIC_PATH, fileName);

  return await writeFile(path, buffer);
}
