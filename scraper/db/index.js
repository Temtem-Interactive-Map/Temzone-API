import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "scraper", "db");

export function writeDBFile(dbName, data) {
  return writeFile(
    path.join(DB_PATH, dbName + ".json"),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

export function readDBFile(dbName) {
  return readFile(path.join(DB_PATH, dbName + ".json"), "utf-8").then(
    JSON.parse
  );
}
