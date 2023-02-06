import { cleanText } from "./utils/index.js";

const TRAIT_SELECTORS = {
  name: {
    selector: "td:nth-child(1)",
    typeOf: "string",
  },
  description: {
    selector: "td:nth-child(2)",
    typeOf: "string",
  },
};

export function getTraits($) {
  const traits = [];
  const traitSelectorEntries = Object.entries(TRAIT_SELECTORS);
  const $rows = $("table.wikitable > tbody > tr ");

  $rows.each((el) => {
    const $el = $(el);
    const traitEntries = traitSelectorEntries.map(
      ([key, { selector, typeOf }]) => {
        const rawValue = $el.find(selector).text();
        const cleanedValue = cleanText(rawValue);
        const value = typeOf === "number" ? Number(cleanedValue) : cleanedValue;

        return [key, value];
      }
    );

    traits.push({
      ...traitEntries,
    });
  });

  console.log(traits);

  return traits;
}
