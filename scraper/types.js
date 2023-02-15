import { join } from "node:path";
import { removeDBContent, writeDBFile, writeDBImage } from "./db/index.js";
import { logInfo, logSuccess, logWarning } from "./log/index.js";
import { cleanText, getUrlExtension, scrape } from "./utils/index.js";

export class TypesDB {
  static async scrape() {
    if (this.types) return logWarning("[types] already scraped");

    logWarning("Removing [types] database...");
    await removeDBContent("types");
    logSuccess("[types] database removed successfully");

    logInfo("Scraping [types]...");
    this.types = {};

    const $ = await scrape("https://temtem.wiki.gg/wiki/Temtem_types");

    for (const el of $("ul:nth-child(6) > li > a:nth-child(1)")) {
      const $el = $(el);
      const rawName = $el.attr("title");
      const name = cleanText(rawName);
      const rawUrl = $el.find("img").attr("src");
      const url = cleanText(rawUrl);
      const extension = getUrlExtension(url);
      const fileName = name.replace(" ", "-").toLowerCase() + "." + extension;

      logInfo("- Writing [" + fileName + "] to database...");
      await writeDBImage(
        join("types", fileName),
        "https://temtem.wiki.gg/" + url
      );
      logSuccess("- [" + fileName + "] written successfully");

      this.types[name] = {
        name,
        image: "static/types/" + fileName,
      };
    }

    logSuccess("[types] scraped successfully");
  }

  static async write() {
    logInfo("Writing [types] to database...");
    await writeDBFile("types", this.types);
    logSuccess("[types] written successfully");
  }

  static find(name) {
    return this.types[name];
  }
}
