import { logInfo, logSuccess, logWarning } from "./log/index.js";
import { cleanText, scrape } from "./utils/index.js";

export class TraitsDB {
  static async scrape() {
    if (this.traits) return logWarning("[traits] already scraped");

    logInfo("Scraping [traits]...");
    this.traits = {};

    const $ = await scrape("https://temtem.wiki.gg/wiki/Traits");
    const traitSelectors = {
      name: "td:nth-child(1)",
      description: "td:nth-child(2)",
    };
    const traitSelectorEntries = Object.entries(traitSelectors);

    for (const el of $("table.wikitable > tbody > tr:not(:first-child)")) {
      const $el = $(el);
      const traitEntries = traitSelectorEntries.map(([key, selector]) => {
        const rawValue = $el.find(selector).text();
        const value = cleanText(rawValue);

        return [key, value];
      });
      const trait = Object.fromEntries(traitEntries);

      this.traits[trait.name] = trait;
    }

    logSuccess("[traits] scraped successfully");

    return this.traits;
  }

  static find(name) {
    return this.traits[name];
  }
}
