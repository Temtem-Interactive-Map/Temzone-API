import { cleanText } from "./utils/index.js";

export async function getAllTraits($) {
  const traitSelectors = {
    name: "td:nth-child(1)",
    description: "td:nth-child(2)",
  };
  const traitSelectorEntries = Object.entries(traitSelectors);
  const traits = $("table.wikitable > tbody > tr:not(:first-child)")
    .toArray()
    .map((el) => {
      const traitEntries = traitSelectorEntries.map(([key, selector]) => {
        const rawValue = $(el).find(selector).text();
        const value = cleanText(rawValue);

        return [key, value];
      });
      const trait = Object.fromEntries(traitEntries);

      return trait;
    });

  return traits;
}
