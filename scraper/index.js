import { SaiparkDB } from "./saipark.js";
import { SpawnsDB } from "./spawns.js";
import { TemtemDB } from "./temtem.js";
import { TraitsDB } from "./traits.js";
import { TypesDB } from "./types.js";
import { writeDBFile } from "./utils/database/index.js";
import { logError, logInfo, logSuccess } from "./utils/log/index.js";

const SCRAPERS = {
  types: TypesDB,
  traits: TraitsDB,
  temtem: TemtemDB,
  spawns: SpawnsDB,
  saipark: SaiparkDB,
};

async function scrapeAndSave(name, asset) {
  const scraper = SCRAPERS[name];
  const content = await scraper.scrape(asset);

  logInfo("Writing [" + name + "] to database...");
  await writeDBFile(name, content);
  logSuccess("[" + name + "] written successfully");
}

let assets = false;
if (process.argv.length === 4) {
  assets = process.argv.pop() === "assets";
}

const name = process.argv.pop();
const start = performance.now();

try {
  if (SCRAPERS[name]) {
    logInfo("Scraping [" + name + "] data from the Official Temtem Wiki...");
  } else {
    logInfo("Scraping all data from the Official Temtem Wiki...");
  }

  if (assets) {
    logInfo("Scraping assets from the Official Temtem Wiki...");
  }

  if (SCRAPERS[name]) {
    await scrapeAndSave(name, assets);
  } else {
    for (const name of Object.keys(SCRAPERS)) {
      await scrapeAndSave(name, assets);
    }
  }
} catch (error) {
  logError("Error scraping [" + name + "]");
  logError(error);
} finally {
  const end = performance.now();
  const seconds = Math.round((end - start) / 10) / 100;

  if (SCRAPERS[name]) {
    logInfo("[" + name + "] scraped in " + seconds + " seconds");
  } else {
    logInfo("All data scraped in " + seconds + " seconds");
  }
}
