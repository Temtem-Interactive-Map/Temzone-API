import { writeDBFile } from "./db/index.js";
import { logError, logInfo, logSuccess } from "./log/index.js";
import { SaiparkDB } from "./saipark.js";
import { SpawnsDB } from "./spawns.js";
import { TemtemDB } from "./temtem.js";
import { TraitsDB } from "./traits.js";
import { TypesDB } from "./types.js";

const SCRAPERS = {
  types: TypesDB,
  traits: TraitsDB,
  temtem: TemtemDB,
  spawns: SpawnsDB,
  saipark: SaiparkDB,
};

async function scrapeAndSave(name) {
  const scraper = SCRAPERS[name];
  const content = await scraper.scrape();

  logInfo("Writing [" + name + "] to database...");
  await writeDBFile(name, content);
  logSuccess("[" + name + "] written successfully");
}

const name = process.argv.pop();
const start = performance.now();

try {
  if (SCRAPERS[name]) {
    logInfo("Scraping [" + name + "] data from the Official Temtem Wiki...");

    await scrapeAndSave(name);
  } else {
    logInfo("Scraping all data from the Official Temtem Wiki...");

    for (const infoToScrape of Object.keys(SCRAPERS)) {
      await scrapeAndSave(infoToScrape);
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
