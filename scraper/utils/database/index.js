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

export async function writeDBFile(fileName, newData) {
  const path = join(process.cwd(), "database", fileName + ".json");
  const oldData = await readFile(path).then((data) => JSON.parse(data));

  if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
    await writeFile(path, JSON.stringify(newData, null, 2));
  }
}

export async function readDBFile(fileName) {
  const path = join(process.cwd(), "database", fileName + ".json");

  return await readFile(path).then((data) => JSON.parse(data));
}

export async function readDBContent(directory) {
  const path = join(process.cwd(), "assets", "static", directory);
  const files = await readdir(path);

  return files;
}

export async function removeDBContent(directory, files) {
  const path = join(process.cwd(), "assets", "static", directory);

  await Promise.all(files.map((file) => unlink(join(path, file))));
}

export async function writeDBImage(fileName, buffer) {
  const path = join(process.cwd(), "assets", "static", fileName);

  await writeFile(path, buffer);
}
