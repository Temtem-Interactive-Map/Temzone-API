import { generateId, readDBFile } from "./utils/database/index.js";
import { sendMessage } from "./utils/firebase/index.js";
import { logInfo, logSuccess, logWarning } from "./utils/log/index.js";
import { cleanText, scrape } from "./utils/scraper/index.js";

export async function scrapeSaipark() {
  logInfo("Scraping [saipark]...");
  const id = generateId("Saipark");
  const saipark = {
    [id]: {
      title: "Saipark",
      subtitle: "West from Praise Coast",
      areas: [],
    },
  };

  const $ = await scrape("https://temtem.wiki.gg/wiki/Saipark");
  const tables = $("table[style*='border-radius']");

  for (const x in [0, 1]) {
    const area = new Area();
    await area.scrape($(tables[x]));
    const temtemId = generateId(area.temtem);

    saipark[id].areas.push({
      name: area.name,
      rate: area.rate,
      lumaRate: area.lumaRate,
      minSVs: area.minSVs,
      eggMoves: area.eggMoves,
      temtemId,
    });
  }

  const currentDate = new Date();
  const rawDate = $("#Temtem").parent().next().find("span.mw-headline").text();
  const date = cleanText(rawDate);
  const dates = date.split("-").map((date) => date.trim());
  const startDate = new Date(dates[0] + dates[1].substring(2));
  const endDate = new Date(dates[1]);

  if (startDate < currentDate && currentDate < endDate) {
    const saiparkDatabase = await readDBFile("saipark");
    const oldTemtem = saiparkDatabase[id].areas.map((area) => area.temtemId);
    const newTemtem = saipark[id].areas.map((area) => area.temtemId);

    if (oldTemtem[0] !== newTemtem[0] || oldTemtem[1] !== newTemtem[1]) {
      logWarning("- Notifying [saipark] update...");
      await sendMessage({
        title: "saipark.title",
        body: "saipark.body",
        id,
      });
    }
  }

  logSuccess("[saipark] scraped successfully");

  return saipark;
}

class Area {
  async scrape($) {
    this.temtem = this.temtem($);
    this.name = this.name($);
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

  name($) {
    const rawName = $.find("tbody > tr:nth-child(1) > td > div > p").text();
    const name = cleanText(rawName);

    return name;
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
