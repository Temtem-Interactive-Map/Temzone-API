import { cleanText, scrape } from "./utils/index.js";

async function getAllTraits() {
  const traits = {};
  const $ = await scrape("https://temtem.wiki.gg/wiki/Traits");
  const traitSelectors = {
    name: "td:nth-child(1)",
    description: "td:nth-child(2)",
  };
  const traitSelectorEntries = Object.entries(traitSelectors);

  $("table.wikitable > tbody > tr:not(:first-child)")
    .toArray()
    .forEach((el) => {
      const traitEntries = traitSelectorEntries.map(([key, selector]) => {
        const rawValue = $(el).find(selector).text();
        const value = cleanText(rawValue);

        return [key, value];
      });
      const trait = Object.fromEntries(traitEntries);

      traits[trait.name] = trait;
    });

  return traits;
}

const traits = Object.freeze(await getAllTraits());

export function findTrait(name) {
  return traits[name];
}
