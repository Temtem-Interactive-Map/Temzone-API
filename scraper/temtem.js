import { cleanText, scrape } from "./utils/index.js";

export async function getAllTemtem($) {
  const results = [];
  const $rows = $("table.wikitable > tbody > tr > td:nth-child(2) > a");

  for (const el of $rows) {
    const $el = $(el);
    const href = $el.attr("href");
    const $temtem = await scrape("https://temtem.wiki.gg" + href);
    const temtem = new Temtem($temtem);

    results.push({
      id: temtem.id,
      name: temtem.name,
      description: temtem.description,
      types: temtem.types,
      details: {
        gender: temtem.gender,
        catch_rate: temtem.catchRate,
        height: temtem.height,
        weight: temtem.weight,
      },
      stats: temtem.stats,
      tvs: temtem.tvs,
    });
  }

  return results;
}

class Temtem {
  constructor($) {
    this.$ = $;
  }

  get id() {
    const rawId = this.$(
      "div.infobox.temtem > table > tbody > tr:contains('No.') > td"
    ).text();
    const cleanId = cleanText(rawId);
    const indexId = cleanId.indexOf("#");
    const textId = cleanId.substring(indexId + 1, indexId + 4);
    const id = parseInt(textId);

    return id;
  }

  get name() {
    const rawName = this.$(
      "div.infobox.temtem > table > tbody > tr:nth-child(1) > th"
    ).text();
    const name = cleanText(rawName);

    return name;
  }

  get description() {
    const rawDescription = this.$("#Tempedia").parent().next().text();
    const description = cleanText(rawDescription);

    return description;
  }

  get types() {
    const types = [];
    this.$(
      "div.infobox.temtem > table > tbody > tr:contains('Type') > td > a"
    ).each((_, el) => {
      const $el = this.$(el);
      const rawType = $el.attr("title");
      const type = cleanText(rawType);

      types.push(type);
    });

    return types;
  }

  get gender() {
    const rawGender = this.$(
      "div.infobox.temtem > table > tbody > tr:contains('Gender Ratio') > td"
    ).text();
    const cleanGender = cleanText(rawGender);

    if (cleanGender === "N/A") {
      return null;
    } else {
      const [rawMale, rawFemale] = rawGender.split(",");
      const cleanMale = cleanText(rawMale);
      const cleanFemale = cleanText(rawFemale);
      const textMale = cleanMale.substring(0, 2);
      const textFemale = cleanFemale.substring(0, 2);
      const male = parseInt(textMale);
      const female = parseInt(textFemale);

      return {
        male,
        female,
      };
    }
  }

  get catchRate() {
    const rawCatchRate = this.$(
      "div.infobox.temtem > table > tbody > tr:contains('Catch Rate') > td"
    ).text();
    const cleanCatchRate = cleanText(rawCatchRate);
    const catchRate = parseInt(cleanCatchRate);

    return catchRate;
  }

  get height() {
    const rawHeight = this.$(
      "table.infobox-half-row:contains('Height') > tbody > tr:nth-child(2) > td"
    ).text();
    const [rawCm, rawInches] = rawHeight.split("/");
    const cleanCm = cleanText(rawCm);
    const cleanInches = cleanText(rawInches);
    const textCm = cleanCm.substring(0, cleanCm.length - 2);
    const textInches = cleanInches.substring(0, cleanInches.length - 1);
    const cm = parseInt(textCm);
    const inches = parseFloat(textInches);

    return {
      cm,
      inches,
    };
  }

  get weight() {
    const rawWeight = this.$(
      "table.infobox-half-row:contains('Weight') > tbody > tr:nth-child(2) > td"
    ).text();
    const [rawKg, rawLbs] = rawWeight.split("/");
    const cleanKg = cleanText(rawKg);
    const cleanLbs = cleanText(rawLbs);
    const textKg = cleanKg.substring(0, cleanKg.length - 2);
    const textLbs = cleanLbs.substring(0, cleanLbs.length - 3);
    const kg = parseInt(textKg);
    const lbs = parseFloat(textLbs);

    return {
      kg,
      lbs,
    };
  }

  get stats() {
    const statsSelectors = {
      hp: "table.statbox > tbody > tr:nth-child(3) > th > div:nth-child(2)",
      sta: "table.statbox > tbody > tr:nth-child(4) > th > div:nth-child(2)",
      spd: "table.statbox > tbody > tr:nth-child(5) > th > div:nth-child(2)",
      atk: "table.statbox > tbody > tr:nth-child(6) > th > div:nth-child(2)",
      def: "table.statbox > tbody > tr:nth-child(7) > th > div:nth-child(2)",
      spatk: "table.statbox > tbody > tr:nth-child(8) > th > div:nth-child(2)",
      spdef: "table.statbox > tbody > tr:nth-child(9) > th > div:nth-child(2)",
      total: "table.statbox > tbody > tr:nth-child(10) > th > div:nth-child(2)",
    };
    const statsSelectorEntries = Object.entries(statsSelectors);
    const statsEntries = statsSelectorEntries.map(([key, selector]) => {
      const rawValue = this.$(selector).text();
      const cleanValue = cleanText(rawValue);
      const value = parseInt(cleanValue);

      return [key, value];
    });
    const stats = Object.fromEntries(statsEntries);

    return stats;
  }

  get tvs() {
    const tvSelectors = {
      hp: "table.tv-table > tbody > tr > td:nth-child(1)",
      sta: "table.tv-table > tbody > tr > td:nth-child(2)",
      spd: "table.tv-table > tbody > tr > td:nth-child(3)",
      atk: "table.tv-table > tbody > tr > td:nth-child(4)",
      def: "table.tv-table > tbody > tr > td:nth-child(5)",
      spatk: "table.tv-table > tbody > tr > td:nth-child(6)",
      spdef: "table.tv-table > tbody > tr > td:nth-child(7)",
    };
    const tvSelectorEntries = Object.entries(tvSelectors);
    const tvEntries = tvSelectorEntries.map(([key, selector]) => {
      const rawValue = this.$(selector).text();
      const cleanValue = cleanText(rawValue);
      const value = parseInt(cleanValue) || 0;

      return [key, value];
    });
    const tvs = Object.fromEntries(tvEntries);

    return tvs;
  }
}
