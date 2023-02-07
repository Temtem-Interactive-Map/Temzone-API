import { scrapeTable } from "./utils/index.js";

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
  return scrapeTable(
    $,
    "table.wikitable > tbody > tr:not(:first-child)",
    TRAIT_SELECTORS
  );
}
