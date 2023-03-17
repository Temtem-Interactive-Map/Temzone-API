import { generateId, lastModifiedDateDBFile } from "./utils/database/index.js";
import { logInfo, logSuccess } from "./utils/log/index.js";
import { cleanText, scrape } from "./utils/scraper/index.js";

export class SaiparkDB {
  static async scrape() {
    logInfo("Scraping [saipark]...");
    this.saipark = {};

    const $ = await scrape("https://temtem.wiki.gg/wiki/Saipark");
    const saiparkTemtemA = new Saipark();
    await saiparkTemtemA.scrape($("table:nth-child(12)"));
    const saiparkTemtemB = new Saipark();
    await saiparkTemtemB.scrape($("table:nth-child(13)"));
    const id = generateId("Saipark");

    this.saipark[id] = {
      title: "Saipark",
      subtitle: "West from Praise Coast",
      temtemA: {
        area: saiparkTemtemA.area,
        rate: saiparkTemtemA.rate,
        lumaRate: saiparkTemtemA.lumaRate,
        minSVs: saiparkTemtemA.minSVs,
        eggMoves: saiparkTemtemA.eggMoves,
        temtemId: generateId(saiparkTemtemA.name),
      },
      temtemB: {
        area: saiparkTemtemB.area,
        rate: saiparkTemtemB.rate,
        lumaRate: saiparkTemtemB.lumaRate,
        minSVs: saiparkTemtemB.minSVs,
        eggMoves: saiparkTemtemB.eggMoves,
        temtemId: generateId(saiparkTemtemB.name),
      },
    };

    logSuccess("[saipark] scraped successfully");

    logInfo("Checking if [saipark] is updated...");
    const currentDate = new Date();
    const lastModifiedDate = lastModifiedDateDBFile("saipark");
    const rawDate = $("h3:nth-child(11) > span.mw-headline").text();
    const date = cleanText(rawDate);
    const dates = date.split("-").map((date) => date.trim());
    const startDate = new Date(dates[0] + dates[1].substring(2));
    const endDate = new Date(dates[1]);

    if (lastModifiedDate < startDate && currentDate < endDate) {
      logInfo("Notifying [saipark] update...");

      logSuccess("[saipark] notification sent successfully");
    }

    return this.saipark;
  }
}

class Saipark {
  async scrape($) {
    this.area = this.area($);
    this.name = this.name($);
    this.rate = this.rate($);
    this.lumaRate = this.lumaRate($);
    this.minSVs = this.minSVs($);
    this.eggMoves = this.eggMoves($);
  }

  area($) {
    const rawArea = $.find("tbody > tr:nth-child(1) > td > div > p").text();
    const area = cleanText(rawArea);

    return area;
  }

  name($) {
    const rawName = $.find(
      "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > p"
    ).text();
    const name = cleanText(rawName);

    return name === "Chromeon"
      ? "Chromeon (Digital)"
      : name === "Koish"
      ? "Koish (Water)"
      : name;
  }

  rate($) {
    const rawRate = $.find(
      "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(3)"
    ).text();
    const cleanRate = cleanText(rawRate);
    const textRate = cleanRate.replace("%", "");
    const rate = parseInt(textRate);

    return rate;
  }

  lumaRate($) {
    const rawLumaRate = $.find(
      "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(3)"
    ).text();
    const cleanLumaRate = cleanText(rawLumaRate);
    const textLumaRate = cleanLumaRate.replace("x", "");
    const lumaRate = parseInt(textLumaRate);

    return lumaRate;
  }

  minSVs($) {
    const rawMinSVs = $.find(
      "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(3)"
    ).text();
    const cleanMinSVs = cleanText(rawMinSVs);
    const minSVs = parseInt(cleanMinSVs);

    return minSVs;
  }

  eggMoves($) {
    const rawEggMoves = $.find(
      "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(4) > td:nth-child(3)"
    ).text();
    const cleanEggMoves = cleanText(rawEggMoves);
    const textEggMoves = cleanEggMoves.replace("%", "");
    const eggMoves = parseInt(textEggMoves);

    return eggMoves;
  }
}
