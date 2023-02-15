import { writeDBFile } from "./db/index.js";
import { logError, logInfo, logSuccess } from "./log/index.js";
import { TemtemDB } from "./temtem.js";
import { TraitsDB } from "./traits.js";
import { TypesDB } from "./types.js";

const SCRAPERS = {
  types: TypesDB,
  traits: TraitsDB,
  temtem: TemtemDB,
  saipark: null,
  landmarks: null,
};

async function scrapeAndSave(name) {
  const start = performance.now();

  try {
    const scraper = SCRAPERS[name];
    const content = await scraper.scrape();

    logInfo("Writing [" + name + "] to database...");
    await writeDBFile(name, content);
    logSuccess("[" + name + "] written successfully");
  } catch (error) {
    logError("Error scraping [" + name + "]");
    logError(error);
  } finally {
    const end = performance.now();
    const time = Math.round((end - start) / 10) / 100;
    logInfo("[" + name + "] scraped in " + time + " seconds");
  }
}

const name = process.argv.at(-1);

if (SCRAPERS[name]) {
  logInfo("Scraping [" + name + "] data from the Official Temtem Wiki...");

  await scrapeAndSave(name);
} else {
  logInfo("Scraping all data from the Official Temtem Wiki...");

  for (const infoToScrape of Object.keys(SCRAPERS)) {
    await scrapeAndSave(infoToScrape);
  }
}
