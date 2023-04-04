import { generateId } from "./utils/database/index.js";
import { logInfo, logSuccess, logWarning } from "./utils/log/index.js";
import { cleanText, scrape } from "./utils/scraper/index.js";

export async function scrapeSaipark() {
  logInfo("Scraping [saipark]...");
  const saipark = {};
  const $ = await scrape("https://temtem.wiki.gg/wiki/Saipark");
  const tables = $("table[style*='border-radius']");
  const saipark1 = new Saipark();
  await saipark1.scrape($(tables[0]));
  const saipark2 = new Saipark();
  await saipark2.scrape($(tables[1]));
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
        temtemId: generateId(saipark1.temtem),
      },
      {
        area: saipark2.area,
        rate: saipark2.rate,
        lumaRate: saipark2.lumaRate,
        minSVs: saipark2.minSVs,
        eggMoves: saipark2.eggMoves,
        temtemId: generateId(saipark2.temtem),
      },
    ],
  };

  const currentDate = new Date();
  const lastModifiedDate = await fetch(
    "https://api.github.com/repos/Temtem-Interactive-Map/Temzone-API/commits?path=database/saipark.json&page=1&per_page=1"
  )
    .then((res) => res.json())
    .then((commits) => new Date(commits[0].commit.committer.date));
  const rawDate = $("#Temtem").parent().next().find("span.mw-headline").text();
  const date = cleanText(rawDate);
  const dates = date.split("-").map((date) => date.trim());
  const startDate = new Date(dates[0] + dates[1].substring(2));
  const endDate = new Date(dates[1]);

  if (lastModifiedDate < startDate && currentDate < endDate) {
    logWarning("- Notifying [saipark] update...");
  }

  logSuccess("[saipark] scraped successfully");

  return saipark;
}

class Saipark {
  async scrape($) {
    this.temtem = this.temtem($);
    this.area = this.area($);
    this.rate = this.rate($);
    this.lumaRate = this.lumaRate($);
    this.minSVs = this.minSVs($);
    this.eggMoves = this.eggMoves($);
  }

  temtem($) {
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

  area($) {
    const rawArea = $.find("tbody > tr:nth-child(1) > td > div > p").text();
    const area = cleanText(rawArea);

    return area;
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
