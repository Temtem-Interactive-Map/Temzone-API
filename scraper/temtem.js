import { findTrait } from "./traits.js";
import { cleanText, scrape } from "./utils/index.js";

export async function getAllTemtem() {
  const creatures = {};
  const $ = await scrape("https://temtem.wiki.gg/wiki/Temtem_(creatures)");

  for (const el of $("table.wikitable > tbody > tr > td:nth-child(2) > a")) {
    const href = $(el).attr("href");
    const $temtem = await scrape("https://temtem.wiki.gg" + href);
    let types = [""];

    if (href === "/wiki/Chromeon" || href === "/wiki/Koish") {
      types = [
        "Neutral",
        "Wind",
        "Earth",
        "Water",
        "Fire",
        "Nature",
        "Electric",
        "Mental",
        "Digital",
        "Melee",
        "Crystal",
        "Toxic",
      ];
    }

    types.forEach((subtype) => {
      const temtem = new Temtem($temtem, subtype);

      creatures[temtem.name] = {
        id: temtem.id,
        name: temtem.name,
        description: temtem.description,
        types: temtem.types,
        traits: temtem.traits,
        details: {
          gender: temtem.gender,
          catchRate: temtem.catchRate,
          height: temtem.height,
          weight: temtem.weight,
        },
        stats: temtem.stats,
        tvs: temtem.tvs,
        evolutions: temtem.evolutions,
      };
    });
  }

  return creatures;
}

class Temtem {
  constructor($, subtype) {
    this.$ = $;
    this.subtype = subtype;
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

    return this.subtype === "" ? name : name + " (" + this.subtype + ")";
  }

  get description() {
    const rawDescription = this.$("#Tempedia").parent().next().text();
    const description = cleanText(rawDescription);

    return description;
  }

  get types() {
    const types = this.$(
      "div.infobox.temtem > table > tbody > tr:contains('Type') > td > a"
    )
      .toArray()
      .map((el) => {
        const rawType = this.$(el).attr("title");
        const type = cleanText(rawType);

        return type;
      });

    if (this.subtype !== "" && !types.includes(this.subtype + " type")) {
      types.push(this.subtype + " type");
    }

    return types;
  }

  get traits() {
    const traits = this.$(
      "div.infobox.temtem > table > tbody > tr:contains('Traits') > td > a"
    )
      .toArray()
      .map((el) => {
        const rawTrait = this.$(el).text();
        const trait = cleanText(rawTrait);

        return findTrait(trait);
      });

    return traits;
  }

  get gender() {
    const rawGender = this.$(
      "div.infobox.temtem > table > tbody > tr:contains('Gender Ratio') > td"
    ).text();
    const cleanGender = cleanText(rawGender);

    if (cleanGender === "N/A") {
      return null;
    } else {
      const [rawMale, rawFemale] = cleanGender.split(",");
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

  get evolutions() {
    const conditions = this.$("div.evobox-container > table.evobox.selected")
      .next()
      .toArray()
      .map((el) => {
        const rawCondition = this.$(el).text().replace("levels", "Levels");
        const condition = cleanText(rawCondition);

        return condition;
      });

    const evolutions = this.$(
      "div.infobox.temtem > table > tbody > tr:contains('Evolves to') > td > a"
    )
      .toArray()
      .map((el, i) => {
        const rawName = this.$(el).text();
        const name = cleanText(rawName);
        let condition;

        switch (this.id) {
          case 51:
            condition = conditions[i]
              .replace("Male", " (Male)")
              .replace("Female", " (Female)");
            break;
          case 130:
            condition = conditions[i].replace("at", "at ");
            break;
          case 154:
            condition = conditions[i].replace("Levels", "Levels (") + ")";
            break;
          default:
            condition = conditions[i];
            break;
        }

        return {
          name,
          condition,
        };
      });

    return evolutions;
  }
}
