import { removeDBContent } from "./db/index.js";
import { logInfo, logSuccess, logWarning } from "./log/index.js";
import { scrape } from "./utils/index.js";

export class AreasDB {
  static async scrape() {
    if (this.areas) return logWarning("[areas] already scraped");

    logWarning("Removing [areas] assets...");
    await removeDBContent("areas");
    logSuccess("[areas] assets removed successfully");

    logInfo("Scraping [areas]...");
    this.areas = [];

    const $ = await scrape("https://temtem.wiki.gg/wiki/Temtem_(creatures)");

    for (const el of $("table.wikitable > tbody > tr > td:nth-child(2) > a")) {
      const href = $(el).attr("href");
      const $temtem = await scrape("https://temtem.wiki.gg" + href);

      for (const el of $temtem(
        "table.locationTable > tbody > tr > td:nth-child(1):not(:last-child) > a"
      )) {
        const $el = $(el);

        this.areas.push("https://temtem.wiki.gg" + $el.attr("href"));
      }
    }

    logSuccess("[areas] scraped successfully");

    return [...new Set(this.areas)];
  }
}
