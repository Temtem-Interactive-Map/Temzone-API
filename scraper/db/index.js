import { readdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function writeDBFile(fileName, data) {
  const path = join(process.cwd(), "scraper", "db", fileName + ".json");

  await writeFile(path, JSON.stringify(data, null, 2));
}

export async function removeDBContent(directory) {
  const path = join(process.cwd(), "assets", "static", directory);

  for (const file of await readdir(path)) {
    await unlink(join(path, file));
  }
}

export async function writeDBImage(fileName, url) {
  const path = join(process.cwd(), "assets", "static", fileName);
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await writeFile(path, buffer);
}
