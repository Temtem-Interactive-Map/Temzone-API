import { logInfo } from "./log/index.js";
import { SCRAPINGS, scrapeAndSave } from "./utils/index.js";

const scrapeParameter = process.argv.at(-1);

if (SCRAPINGS[scrapeParameter]) {
  logInfo(
    "Scraping [" + scrapeParameter + "] data from the Official Temtem Wiki..."
  );

  await scrapeAndSave(scrapeParameter);
} else {
  logInfo("Scraping all data from the Official Temtem Wiki...");

  for (const infoToScrape of Object.keys(SCRAPINGS)) {
    await scrapeAndSave(infoToScrape);
  }
}
