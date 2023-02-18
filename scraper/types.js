import { join } from "node:path";
import { readDBFile, removeDBContent, writeDBImage } from "./db/index.js";
import { logInfo, logSuccess, logWarning } from "./log/index.js";
import {
  cleanText,
  generateFileName,
  generateId,
  getUrlExtension,
  scrape,
  shortUrl,
} from "./utils/index.js";

export class TypesDB {
  static async scrape() {
    logWarning("Removing [types] assets...");
    await removeDBContent("types");
    logSuccess("[types] assets removed successfully");

    logInfo("Scraping [types]...");
    this.types = {};

    const $ = await scrape("https://temtem.wiki.gg/wiki/Temtem_types");

    for (const el of $("ul:nth-child(6) > li > a:nth-child(1)")) {
      const type = new Type();
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

  static async load() {
    this.types = await readDBFile("types");
  }

  static find(id) {
    return this.types[id];
  }
}

class Type {
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
    const rawUrl = $.find("img").attr("src");
    const cleanUrl = cleanText(rawUrl);
    const url = shortUrl(cleanUrl);
    const extension = getUrlExtension(url);
    const fileName =
      generateFileName(this.name.split(" ").shift()) + "." + extension;

    logWarning("- Writing [" + fileName + "] to assets...");
    await writeDBImage(
      join("types", fileName),
      "https://temtem.wiki.gg/" + url
    );

    return "static/types/" + fileName;
  }
}
