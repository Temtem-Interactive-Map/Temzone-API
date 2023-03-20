import { generateId, lastModifiedDateDBFile } from "./utils/database/index.js";
import { logInfo, logSuccess, logWarning } from "./utils/log/index.js";
import { cleanText, scrape } from "./utils/scraper/index.js";

export async function scrapeSaipark() {
  logInfo("Scraping [saipark]...");
  const saipark = {};

  const $ = await scrape("https://temtem.wiki.gg/wiki/Saipark");
  const saipark1 = new Saipark();
  await saipark1.scrape($("table:nth-child(12)"));
  const saipark2 = new Saipark();
  await saipark2.scrape($("table:nth-child(13)"));
  const id = generateId("Saipark");

  saipark[id] = {
    title: "Saipark",
    subtitle: "West from Praise Coast",
    areas: [
      {
        area: saipark1.area,
        rate: saipark1.rate,
        lumaRate: saipark1.lumaRate,
        minSVs: saipark1.minSVs,
        eggMoves: saipark1.eggMoves,
        temtemId: generateId(saipark1.name),
      },
      {
        area: saipark2.area,
        rate: saipark2.rate,
        lumaRate: saipark2.lumaRate,
        minSVs: saipark2.minSVs,
        eggMoves: saipark2.eggMoves,
        temtemId: generateId(saipark2.name),
      },
    ],
  };

  logSuccess("[saipark] scraped successfully");

  const currentDate = new Date();
  const lastModifiedDate = lastModifiedDateDBFile("saipark");
  const rawDate = $("h3:nth-child(11) > span.mw-headline").text();
  const date = cleanText(rawDate);
  const dates = date.split("-").map((date) => date.trim());
  const startDate = new Date(dates[0] + dates[1].substring(2));
  const endDate = new Date(dates[1]);

  if (lastModifiedDate < startDate && currentDate < endDate) {
    logWarning("[saipark] is outdated, notifying update...");

    logSuccess("[saipark] notification sent successfully");
  }

  return saipark;
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
