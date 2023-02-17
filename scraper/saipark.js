import { logInfo, logSuccess, logWarning } from "./log/index.js";
import { cleanText, scrape } from "./utils/index.js";

export class SaiparkDB {
  static async scrape() {
    if (this.saipark) return logWarning("[saipark] already scraped");

    logInfo("Scraping [saipark]...");
    this.saipark = {};

    const $ = await scrape("https://temtem.wiki.gg/wiki/Saipark");

    const saiparkTemtemA = new Saipark($("table:nth-child(12)"));
    const saiparkTemtemB = new Saipark($("table:nth-child(13)"));

    this.saipark.saipark = {
      title: "Saipark",
      subtitle: "West from Praise Coast",
      temtemA: {
        area: saiparkTemtemA.area,
        name: saiparkTemtemA.name,
        rate: saiparkTemtemA.rate,
        lumaRate: saiparkTemtemA.lumaRate,
        minSVs: saiparkTemtemA.minSVs,
        eggMoves: saiparkTemtemA.eggMoves,
      },
      temtemB: {
        area: saiparkTemtemB.area,
        name: saiparkTemtemB.name,
        rate: saiparkTemtemB.rate,
        lumaRate: saiparkTemtemB.lumaRate,
        minSVs: saiparkTemtemB.minSVs,
        eggMoves: saiparkTemtemB.eggMoves,
      },
    };

    logSuccess("[saipark] scraped successfully");

    return this.saipark;
  }
}

class Saipark {
  constructor($) {
    this.$ = $;
  }

  get area() {
    const rawArea = this.$.find(
      "tbody > tr:nth-child(1) > td > div > p"
    ).text();
    const area = cleanText(rawArea);

    return area;
  }

  get name() {
    const rawName = this.$.find(
      "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > p"
    ).text();
    const name = cleanText(rawName);

    return name === "Chromeon"
      ? "Chromeon (Digital)"
      : name === "Koish"
      ? "Koish (Water)"
      : name;
  }

  get rate() {
    const rawRate = this.$.find(
      "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(3)"
    ).text();
    const cleanRate = cleanText(rawRate);
    const textRate = cleanRate.replace("%", "");
    const rate = parseInt(textRate);

    return rate;
  }

  get lumaRate() {
    const rawLumaRate = this.$.find(
      "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(3)"
    ).text();
    const cleanLumaRate = cleanText(rawLumaRate);
    const textLumaRate = cleanLumaRate.replace("x", "");
    const lumaRate = parseInt(textLumaRate);

    return lumaRate;
  }

  get minSVs() {
    const rawMinSVs = this.$.find(
      "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(3)"
    ).text();
    const cleanMinSVs = cleanText(rawMinSVs);
    const minSVs = parseInt(cleanMinSVs);

    return minSVs;
  }

  get eggMoves() {
    const rawEggMoves = this.$.find(
      "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(4) > td:nth-child(3)"
    ).text();
    const cleanEggMoves = cleanText(rawEggMoves);
    const textEggMoves = cleanEggMoves.replace("%", "");
    const eggMoves = parseInt(textEggMoves);

    return eggMoves;
  }
}
