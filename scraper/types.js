import { join } from "node:path";
import {
  generateFileName,
  generateId,
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

export class TypesDB {
  static async scrape(assets) {
    if (assets) {
      logWarning("Removing [types] assets...");
      await removeDBContent("types");
      logSuccess("[types] assets removed successfully");
    }

    logInfo("Scraping [types]...");
    this.types = {};

    const $ = await scrape("https://temtem.wiki.gg/wiki/Temtem_types");

    for (const el of $("ul:nth-child(6) > li > a:nth-child(1)")) {
      const type = new Type(assets);
      await type.scrape($(el));
      const id = generateId(type.name);

      this.types[id] = {
        name: type.name,
        image: type.image,
      };
    }

    logSuccess("[types] scraped successfully");

    return this.types;
  }
}

class Type {
  constructor(assets) {
    this.assets = assets;
  }

  async scrape($) {
    this.name = this.#name($);
    this.image = await this.#image($);
  }

  #name($) {
    const rawName = $.attr("title");
    const name = cleanText(rawName);

    return name;
  }

  async #image($) {
    const fileName = generateFileName(this.name.split(" ").shift()) + ".png";

    if (this.assets) {
      logWarning("- Writing [" + fileName + "] to assets...");
      const rawUrl = $.find("img").attr("src");
      const cleanUrl = cleanText(rawUrl);
      const url = shortUrl(cleanUrl);
      const png = await fetchPng("https://temtem.wiki.gg/" + url, 24);

      await writeDBImage(join("types", fileName), png);
    }

    return "static/types/" + fileName;
  }
}
