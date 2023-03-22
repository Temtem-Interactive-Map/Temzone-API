import command from "command-line-args";
import { scrapeSaipark } from "./saipark.js";
import { scrapeSpawns } from "./spawns.js";
import { scrapeTemtem } from "./temtem.js";
import { scrapeTypes } from "./types.js";
import { writeDBFile } from "./utils/database/index.js";
import { logError, logInfo, logSuccess } from "./utils/log/index.js";

const SCRAPERS = {
  types: scrapeTypes,
  temtem: scrapeTemtem,
  spawns: scrapeSpawns,
  saipark: scrapeSaipark,
};

async function scrapeAndSave(name, asset) {
  const scraper = SCRAPERS[name];
  const content = await scraper(asset);

  logInfo("Writing [" + name + "] to database...");
  await writeDBFile(name, content);
  logSuccess("[" + name + "] written successfully");
}

const options = command([
  { name: "scraper", type: String, defaultValue: "all", defaultOption: true },
]);
const name = options.scraper;
const start = performance.now();

try {
  if (SCRAPERS[name]) {
    logInfo("Scraping [" + name + "] data from the Official Temtem Wiki...");

    await scrapeAndSave(name);
  } else {
    logInfo("Scraping all data from the Official Temtem Wiki...");

    for (const name of Object.keys(SCRAPERS)) {
      await scrapeAndSave(name);
    }
  }
} catch (error) {
  logError("Error scraping [" + name + "]");
  logError(error);

  throw error;
} finally {
  const end = performance.now();
  const seconds = Math.round((end - start) / 10) / 100;

  if (SCRAPERS[name]) {
    logInfo("[" + name + "] scraped in " + seconds + " seconds");
  } else {
    logInfo("All data scraped in " + seconds + " seconds");
  }
}
