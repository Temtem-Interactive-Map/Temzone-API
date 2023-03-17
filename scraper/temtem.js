import { join } from "node:path";
import {
  generateFileName,
  generateId,
  readDBFile,
  removeDBContent,
  writeDBImage,
} from "./utils/database/index.js";
import { logInfo, logSuccess, logWarning } from "./utils/log/index.js";
import {
  cleanText,
  fetchGif,
  generatePortrait,
  scrape,
  shortUrl,
} from "./utils/scraper/index.js";

export class TemtemDB {
  static async scrape(assets) {
    if (assets) {
      logWarning("Removing [temtem] assets...");
      await removeDBContent("temtem");
      logSuccess("[temtem] assets removed successfully");
    }

    const typesDB = await readDBFile("types");
    const traitsDB = await readDBFile("traits");

    logInfo("Scraping [temtem]...");
    this.creatures = {};

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

      for (const subtype of types) {
        const temtem = new Temtem(assets, typesDB, traitsDB);
        await temtem.scrape($temtem, subtype);
        const id = generateId(temtem.name);

        this.creatures[id] = {
          tempediaId: temtem.id,
          name: temtem.name,
          description: temtem.description,
          types: temtem.types,
          images: temtem.images,
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
      }
    }

    Object.values(this.creatures).forEach((temtem) => {
      temtem.evolutions = temtem.evolutions.map((evolution) => {
        const temtemEvolution = this.creatures[evolution.id];

        return {
          name: evolution.name,
          condition: evolution.condition,
          image: temtemEvolution.images.default,
          traits: temtemEvolution.traits.map((trait) => trait.name),
        };
      });
    });

    logSuccess("[temtem] scraped successfully");

    return this.creatures;
  }
}

class Temtem {
  constructor(assets, types, traits) {
    this.assets = assets;
    this.types = types;
    this.traits = traits;
  }

  async scrape($, subtype) {
    this.id = this.id($);
    this.name = this.name($, subtype);
    this.description = this.description($);
    this.types = this.types($, subtype);
    this.images = await this.images($, subtype, this.name);
    this.traits = this.traits($);
    this.gender = this.gender($);
    this.catchRate = this.catchRate($);
    this.height = this.height($);
    this.weight = this.weight($);
    this.stats = this.stats($);
    this.tvs = this.tvs($);
    this.evolutions = this.evolutions($, this.id);
  }

  id($) {
    const rawId = $(
      "div.infobox > table > tbody > tr:contains('No.') > td"
    ).text();
    const cleanId = cleanText(rawId);
    const indexId = cleanId.indexOf("#");
    const textId = cleanId.substring(indexId + 1, indexId + 4);
    const id = parseInt(textId);

    return id;
  }

  name($, subtype) {
    const rawName = $(
      "div.infobox > table > tbody > tr:nth-child(1) > th"
    ).text();
    const cleanName = cleanText(rawName);
    const name = subtype === "" ? cleanName : cleanName + " (" + subtype + ")";

    return name;
  }

  description($) {
    const rawDescription = $("#Tempedia").parent().next().text();
    const description = cleanText(rawDescription);

    return description;
  }

  types($, subtype) {
    const typeNames = $(
      "div.infobox > table > tbody > tr:contains('Type') > td > a"
    )
      .toArray()
      .map((el) => {
        const rawType = $(el).attr("title");
        const type = cleanText(rawType);

        return type;
      });

    if (subtype !== "" && !typeNames.includes(subtype + " type")) {
      typeNames.push(subtype + " type");
    }

    const types = typeNames.map((typeName) => {
      const id = generateId(typeName);
      const type = this.types[id];

      return {
        name: type.name,
        image: type.image,
      };
    });

    return types;
  }

  async images($, subtype, name) {
    const pngFileName = generateFileName(name) + ".png";
    const gifFileName = generateFileName(name) + ".gif";

    if (this.assets) {
      logWarning("- Writing [" + pngFileName + "] to assets...");
      const rawPngUrl =
        subtype !== ""
          ? $("#Subspecies_Variations")
              .parent()
              .next()
              .next()
              .find(
                "table.wikitable > tbody > tr:nth-child(2) > td:nth-child(odd) > span > a > img"
              )
              .toArray()
              .map((el) => $(el).attr("src"))
              .find((src) => src.includes(subtype))
          : $(
              "div.infobox > table > tbody > tr:nth-child(2) > td > div > div > section > article:nth-child(1) > span > a > img"
            ).attr("src");
      const cleanPngUrl = cleanText(rawPngUrl);
      const pngUrl = shortUrl(cleanPngUrl);
      const png = await generatePortrait("https://temtem.wiki.gg/" + pngUrl);

      await writeDBImage(join("temtem", pngFileName), png);

      logWarning("- Writing [" + gifFileName + "] to assets...");
      const $renders = $("#Renders")
        .parent()
        .next()
        .find("li:nth-child(2) > div > div > div > a > img");
      const rawGifUrl =
        $renders
          .toArray()
          .map((el) => $(el).attr("src"))
          .find((src) => {
            if (subtype === "") return true;

            return src.includes(subtype);
          }) || $renders.attr("src");
      const cleanGifUrl = cleanText(rawGifUrl);
      const gifUrl = shortUrl(cleanGifUrl);
      const gif = await fetchGif("https://temtem.wiki.gg/" + gifUrl, 480);

      await writeDBImage(join("temtem", gifFileName), gif);
    }

    return {
      png: "static/temtem/" + pngFileName,
      gif: "static/temtem/" + gifFileName,
    };
  }

  traits($) {
    const traits = $(
      "div.infobox > table > tbody > tr:contains('Traits') > td > a"
    )
      .toArray()
      .map((el) => {
        const rawTrait = $(el).text();
        const traitName = cleanText(rawTrait);
        const id = generateId(traitName);
        const trait = this.traits[id];

        return {
          name: trait.name,
          description: trait.description,
        };
      });

    return traits;
  }

  gender($) {
    const rawGender = $(
      "div.infobox > table > tbody > tr:contains('Gender Ratio') > td"
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

  catchRate($) {
    const rawCatchRate = $(
      "div.infobox > table > tbody > tr:contains('Catch Rate') > td"
    ).text();
    const cleanCatchRate = cleanText(rawCatchRate);
    const catchRate = parseInt(cleanCatchRate);

    return catchRate;
  }

  height($) {
    const rawHeight = $(
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

  weight($) {
    const rawWeight = $(
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

  stats($) {
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
      const rawValue = $(selector).text();
      const cleanValue = cleanText(rawValue);
      const value = parseInt(cleanValue);

      return [key, value];
    });
    const stats = Object.fromEntries(statsEntries);

    return stats;
  }

  tvs($) {
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
      const rawValue = $(selector).text();
      const cleanValue = cleanText(rawValue);
      const value = parseInt(cleanValue) || 0;

      return [key, value];
    });
    const tvs = Object.fromEntries(tvEntries);

    return tvs;
  }

  evolutions($, id) {
    const conditions = $("div.evobox-container > table.evobox.selected")
      .next()
      .toArray()
      .map((el) => {
        const rawCondition = $(el).text();
        const cleanCondition = cleanText(rawCondition);
        const condition = cleanCondition.replace("levels", "Levels");

        return condition;
      });

    const evolutions = $(
      "div.infobox > table > tbody > tr:contains('Evolves to') > td > a"
    )
      .toArray()
      .map((el, i) => {
        let condition;

        switch (id) {
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

        const rawName = $(el).text();
        const name = cleanText(rawName);

        return {
          id: generateId(name),
          condition,
        };
      });

    return evolutions;
  }
}
