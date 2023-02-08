import { cleanText } from "./utils/index.js";

const TRAIT_SELECTORS = {
  name: "td:nth-child(1)",
  description: "td:nth-child(2)",
};

export async function getAllTraits($) {
  const traits = {};
  const traitSelectorEntries = Object.entries(TRAIT_SELECTORS);
  const $rows = $("table.wikitable > tbody > tr:not(:first-child)");

  $rows.each((_, el) => {
    const $el = $(el);
    const traitEntries = traitSelectorEntries.map(([key, selector]) => {
      const rawValue = $el.find(selector).text();
      const value = cleanText(rawValue);

      return [key, value];
    });

    const trait = Object.fromEntries(traitEntries);

    traits[trait.name] = trait;
  });

  return traits;
}
