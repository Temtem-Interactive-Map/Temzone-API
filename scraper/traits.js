import { readDBFile } from "./db/index.js";
import { logInfo, logSuccess } from "./log/index.js";
import { cleanText, generateId, scrape } from "./utils/index.js";

export class TraitsDB {
  static async scrape() {
    logInfo("Scraping [traits]...");
    this.traits = {};

    const $ = await scrape("https://temtem.wiki.gg/wiki/Traits");

    for (const el of $("table.wikitable > tbody > tr:not(:first-child)")) {
      const trait = new Trait();
      await trait.scrape($(el));
      const id = generateId(trait.name);

      this.traits[id] = {
        name: trait.name,
        description: trait.description,
      };
    }

    logSuccess("[traits] scraped successfully");

    return this.traits;
  }

  static async load() {
    this.traits = await readDBFile("traits");
  }

  static find(id) {
    return this.traits[id];
  }
}

class Trait {
  async scrape($) {
    this.name = this.#name($);
    this.description = this.#description($);
  }

  #name($) {
    const rawName = $.find("td:nth-child(1)").text();
    const name = cleanText(rawName);

    return name;
  }

  #description($) {
    const rawDescription = $.find("td:nth-child(2)").text();
    const description = cleanText(rawDescription);

    return description;
  }
}
