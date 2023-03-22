import { join } from "node:path";
import {
  generateFileName,
  generateId,
  readDBContent,
  removeDBContent,
  writeDBImage,
} from "./utils/database/index.js";
import { logInfo, logSuccess, logWarning } from "./utils/log/index.js";
import {
  cleanText,
  fetchPng,
  scrape,
  shortUrl,
} from "./utils/scraper/index.js";

const typeAssets = new Set();
const typeAssetsDB = await readDBContent("types");

export async function scrapeTypes() {
  logInfo("Scraping [types]...");
  const types = {};
  const $ = await scrape("https://temtem.wiki.gg/wiki/Temtem_types");

  for (const el of $("ul:nth-child(6) > li > a:nth-child(1)")) {
    const type = new Type();
    await type.scrape($(el));
    const id = generateId(type.name);

    types[id] = {
      name: type.name,
      image: type.image,
    };
  }

  await removeDBContent(
    "types",
    typeAssetsDB.filter((filename) => !typeAssets.has(filename))
  );
  logSuccess("[types] scraped successfully");

  return types;
}

class Type {
  async scrape($) {
    this.name = this.name($);
    this.image = await this.image($);
  }

  name($) {
    const rawName = $.attr("title");
    const name = cleanText(rawName);

    return name;
  }

  async image($) {
    const filename = generateFileName(this.name.split(" ").shift()) + ".png";
    typeAssets.add(filename);

    if (!typeAssetsDB.includes(filename)) {
      logWarning("- Writing [" + filename + "] to assets...");
      const rawUrl = $.find("img").attr("src");
      const cleanUrl = cleanText(rawUrl);
      const url = shortUrl(cleanUrl);
      const png = await fetchPng("https://temtem.wiki.gg/" + url, 24);

      await writeDBImage(join("types", filename), png);
    }

    return "static/types/" + filename;
  }
}
