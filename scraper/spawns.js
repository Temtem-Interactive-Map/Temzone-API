import { join } from "path";
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

const areaAssets = new Set();
const areaAssetsDB = await readDBContent("areas");

export async function scrapeSpawns() {
  logInfo("Scraping [spawns]...");
  const spawns = {};
  const urls = new Set();
  const $ = await scrape("https://temtem.wiki.gg/wiki/Temtem_(creatures)");

  for (const el of $("table.wikitable > tbody > tr > td:nth-child(2) > a")) {
    const temtemHref = $(el).attr("href");
    const $temtem = await scrape("https://temtem.wiki.gg" + temtemHref);

    for (const el of $temtem(
      "table.locationTable > tbody > tr > td:nth-child(1):not(:last-child) > a"
    )) {
      const locationHref = $(el).attr("href");
      const url = "https://temtem.wiki.gg" + locationHref;

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

        // Skip scrape if Temtem is not found in the wild (e.g. through quests)
        if (!area.includes("Area")) continue;

        // Skip duplicate areas
        if (location === "Chini Grotto" && area === "Area 5") continue;

        const filename = generateFileName(location, area) + ".png";
        areaAssets.add(filename);

        if (!areaAssetsDB.includes(filename)) {
          logWarning("- Writing [" + filename + "] to assets...");
          const rawUrl = $el.find("td.map > div > div > a > img").attr("src");
          const cleanUrl = cleanText(rawUrl);
          const url = shortUrl(cleanUrl);
          const png = await fetchPng("https://temtem.wiki.gg/" + url, 480);

          await writeDBImage(join("areas", filename), png);
        }

        $el
          .find("td.encounters > table")
          .toArray()
          .forEach(async (el) => {
            const spawn = new Spawn();
            await spawn.scrape($(el));
            const id = generateId(location, area, spawn.name);

            spawns[id] = {
              title: spawn.name,
              subtitle: location + ", " + area,
              rate: spawn.rate,
              level: spawn.level,
              image: "static/areas/" + filename,
              temtemId: generateId(spawn.name),
            };
          });
      }
    }
  }

  await removeDBContent(
    "areas",
    areaAssetsDB.filter((filename) => !areaAssets.has(filename))
  );
  logSuccess("[spawns] scraped successfully");

  return spawns;
}

class Spawn {
  async scrape($) {
    this.name = this.name($);
    this.rate = this.rate($);
    this.level = this.level($);
  }

  name($) {
    const rawName = $.find("tbody > tr:nth-child(1) > td > a > span").text();
    const cleanName = cleanText(rawName);
    const name =
      cleanName === "Chromeon"
        ? "Chromeon (Digital)"
        : cleanName === "Koish"
        ? "Koish (Water)"
        : cleanName;

    return name;
  }

  rate($) {
    const rawRate = $.find("tbody > tr:nth-child(4) > td").text();
    const cleanRate = cleanText(rawRate);
    const rate = cleanRate.split("/").map((rawRate) => {
      const cleanRate = cleanText(rawRate);
      const textRate = cleanRate.replace("%", "");
      const rate = parseInt(textRate);

      return rate;
    });

    return rate;
  }

  level($) {
    const rawLevels = $.find("tbody > tr:nth-child(5) > td").text();
    const cleanLevels = cleanText(rawLevels);

    if (cleanLevels.includes("-")) {
      const [rawMinLevel, rawMaxLevel] = cleanLevels.split("-");
      const cleanMinLevel = cleanText(rawMinLevel);
      const cleanMaxLevel = cleanText(rawMaxLevel);
      const minLevel = parseInt(cleanMinLevel);
      const maxLevel = parseInt(cleanMaxLevel);

      return {
        min: minLevel,
        max: maxLevel,
      };
    } else {
      const cleanLevel = cleanText(rawLevels);
      const level = parseInt(cleanLevel);

      return {
        min: level,
        max: level,
      };
    }
  }
}
