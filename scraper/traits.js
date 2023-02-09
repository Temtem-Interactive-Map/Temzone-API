import { cleanText } from "./utils/index.js";

export async function getAllTraits($) {
  const traits = {};
  const traitSelectors = {
    name: "td:nth-child(1)",
    description: "td:nth-child(2)",
  };
  const traitSelectorEntries = Object.entries(traitSelectors);
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
