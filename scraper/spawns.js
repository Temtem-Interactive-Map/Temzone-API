import { join } from "node:path";
import { removeDBContent, writeDBImage } from "./db/index.js";
import { logInfo, logSuccess, logWarning } from "./log/index.js";
import { cleanText, getUrlExtension, scrape, shortUrl } from "./utils/index.js";

export class SpawnsDB {
  static async scrape() {
    if (this.spawns) return logWarning("[spawns] already scraped");

    logWarning("Removing [areas] assets...");
    await removeDBContent("areas");
    logSuccess("[areas] assets removed successfully");

    logInfo("Scraping [spawns]...");
    this.spawns = [];

    const urls = new Set();
    const $ = await scrape("https://temtem.wiki.gg/wiki/Temtem_(creatures)");

    for (const el of $("table.wikitable > tbody > tr > td:nth-child(2) > a")) {
      const href = $(el).attr("href");
      const $temtem = await scrape("https://temtem.wiki.gg" + href);

      for (const el of $temtem(
        "table.locationTable > tbody > tr > td:nth-child(1):not(:last-child) > a"
      )) {
        const url = "https://temtem.wiki.gg" + $(el).attr("href");

        if (urls.has(url)) continue;
        urls.add(url);

        const $area = await scrape(url);

        const rawLocation = $area("#firstHeading > span").text();
        const location = cleanText(rawLocation);

        for (const el of $area("table.encounterbox-table > tbody")) {
          const $el = $(el);

          const rawArea = $el.find("tr:nth-child(1) > td > b").text();
          const cleanArea = cleanText(rawArea);
          const area = cleanArea.replace(/\(.*\)/, "").trim();

          if (!area.includes("Area")) continue;

          const rawUrl = $el.find("td.map > div > div > a > img").attr("src");
          const cleanUrl = cleanText(rawUrl);
          const url = shortUrl(cleanUrl);
          const extension = getUrlExtension(url);
          const fileName =
            location
              .replace(/[^a-zA-Z0-9 ]/g, "")
              .replace(/ /g, "-")
              .toLowerCase() +
            "-" +
            area.replace(/ /g, "-").toLowerCase() +
            "." +
            extension;

          logWarning("- Writing [" + fileName + "] to assets...");
          await writeDBImage(
            join("areas", fileName),
            "https://temtem.wiki.gg/" + url
          );

          $el
            .find("td.encounters > table")
            .toArray()
            .forEach((el) => {
              const spawn = new Spawn($(el));

              this.spawns.push({
                location,
                area,
                image: "static/types/" + fileName,
                name: spawn.name,
                rate: spawn.rate,
              });
            });
        }
      }
    }

    logSuccess("[spawns] scraped successfully");

    return this.spawns;
  }
}

class Spawn {
  constructor($) {
    this.$ = $;
  }

  get name() {
    const rawName = this.$.find(
      "tbody > tr:nth-child(1) > td > a > span"
    ).text();
    const name = cleanText(rawName);

    return name === "Chromeon" ? "Chromeon (Digital)" : name;
  }

  get rate() {
    const rawRate = this.$.find("tbody > tr:nth-child(4) > td").text();
    const cleanRate = cleanText(rawRate);
    const textRate = cleanRate.replace("%", "");
    const rate = parseInt(textRate);

    return rate;
  }
}
