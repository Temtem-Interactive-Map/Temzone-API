import { logInfo, logSuccess } from "./log/index.js";
import { cleanText, scrape } from "./utils/index.js";

export class SaiparkDB {
  static async scrape() {
    logInfo("Scraping [saipark]...");
    this.saipark = [];

    const $ = await scrape("https://temtem.wiki.gg/wiki/Saipark");

    for (const $table of [$("table:nth-child(12)"), $("table:nth-child(13)")]) {
      const rawArea = $table
        .find("tbody > tr:nth-child(1) > td > div > p")
        .text();
      const area = cleanText(rawArea);

      const rawName = $table
        .find(
          "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > p"
        )
        .text();
      const name = cleanText(rawName);

      const rawRate = $table
        .find(
          "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(3)"
        )
        .text();
      const cleanRate = cleanText(rawRate);
      const textRate = cleanRate.replace("%", "");
      const rate = parseInt(textRate);

      const rawLumaRate = $table
        .find(
          "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(3)"
        )
        .text();
      const cleanLumaRate = cleanText(rawLumaRate);
      const textLumaRate = cleanLumaRate.replace("x", "");
      const lumaRate = parseInt(textLumaRate);

      const rawMinSVs = $table
        .find(
          "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(3)"
        )
        .text();
      const cleanMinSVs = cleanText(rawMinSVs);
      const minSVs = parseInt(cleanMinSVs);

      const rawEggMoves = $table
        .find(
          "tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(4) > td:nth-child(3)"
        )
        .text();
      const cleanEggMoves = cleanText(rawEggMoves);
      const textEggMoves = cleanEggMoves.replace("%", "");
      const eggMoves = parseInt(textEggMoves);

      this.saipark.push({
        area,
        name:
          name === "Chromeon"
            ? "Chromeon (Digital)"
            : name === "Koish"
            ? "Koish (Water)"
            : name,
        rate,
        lumaRate,
        minSVs,
        eggMoves,
      });
    }

    logSuccess("[saipark] scraped successfully");

    return this.saipark;
  }
}
