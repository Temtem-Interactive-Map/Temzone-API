import { readDBFile } from "./db/index.js";
import { logInfo, logSuccess } from "./log/index.js";

export class LandmarksDB {
  static async scrape() {
    logInfo("Scraping [landmarks]...");
    this.landmarks = {};

    logSuccess("[landmarks] scraped successfully");

    return this.saipark;
  }

  static async load() {
    this.landmarks = await readDBFile("landmarks");
  }

  static find(id) {
    return this.landmarks[id];
  }
}
