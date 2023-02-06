import { load } from "cheerio";
import { logError, logInfo, logSuccess } from "../log/index.js";
import { getTraits } from "../traits.js";
import { getTypes } from "../types.js";

export const SCRAPINGS = {
  types: {
    urls: ["https://temtem.wiki.gg/wiki/Temtem_types"],
    scraper: getTypes,
  },
  traits: {
    urls: ["https://temtem.wiki.gg/wiki/Traits"],
    scraper: getTraits,
  },
  temtem: {
    urls: ["https://temtem.wiki.gg/wiki/Temtem_(creatures)"],
    scraper: null,
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

export function cleanText(text) {
  return text
    .replace(/\t|\n|\s:/g, "")
    .replace(/.*:/g, " ")
    .trim();
}

export async function scrape(url) {
  const response = await fetch(url);
  const html = await response.text();

  return load(html);
}

export async function scrapeAndSave(name) {
  const start = performance.now();

  try {
    const { urls, scraper } = SCRAPINGS[name];

    logInfo("Scraping [" + name + "]...");
    for (const url of urls) {
      const $ = await scrape(url);
      const content = await scraper($);
    }
    logSuccess("[" + name + "] scraped successfully");

    // logInfo("Writing [" + name + "] to database...");
    // await writeDBFile(name, content);
    // logSuccess("[" + name + "] written successfully");
  } catch (error) {
    logError("Error scraping [" + name + "]");
    logError(error);
  } finally {
    const end = performance.now();
    const time = Math.round((end - start) / 10) / 100;
    logInfo("[" + name + "] scraped in " + time + " seconds");
  }
}
