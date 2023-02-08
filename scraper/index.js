import { writeDBFile } from "./db/index.js";
import { logError, logInfo, logSuccess } from "./log/index.js";
import { getAllTemtem } from "./temtem.js";
import { getAllTraits } from "./traits.js";
import { scrape } from "./utils/index.js";

const SCRAPINGS = {
  traits: {
    urls: ["https://temtem.wiki.gg/wiki/Traits"],
    scraper: getAllTraits,
  },
  temtem: {
    urls: ["https://temtem.wiki.gg/wiki/Temtem_(creatures)"],
    scraper: getAllTemtem,
  },
  saipark: {
    urls: ["https://temtem.wiki.gg/wiki/Saipark"],
    scraper: null,
  },
  landmarks: {
    urls: [],
    scraper: null,
  },
};

async function scrapeAndSave(name) {
  const start = performance.now();

  try {
    const { urls, scraper } = SCRAPINGS[name];

    logInfo("Scraping [" + name + "]...");
    for (const url of urls) {
      const $ = await scrape(url);
      const content = await scraper($);

      logSuccess("[" + name + "] scraped successfully");

      logInfo("Writing [" + name + "] to database...");
      await writeDBFile(name, content);
      logSuccess("[" + name + "] written successfully");
    }
  } catch (error) {
    logError("Error scraping [" + name + "]");
    logError(error);
  } finally {
    const end = performance.now();
    const time = Math.round((end - start) / 10) / 100;
    logInfo("[" + name + "] scraped in " + time + " seconds");
  }
}

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
