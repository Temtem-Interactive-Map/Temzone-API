import { load } from "cheerio";

export async function scrape(url) {
  const response = await fetch(url);
  const html = await response.text();

  return load(html);
}

export async function scrapeTable($, element, selectors) {
  const table = [];
  const selectorEntries = Object.entries(selectors);
  const $rows = $(element);

  $rows.each((_, el) => {
    const $el = $(el);
    const entries = selectorEntries.map(([key, { selector, typeOf }]) => {
      const rawValue = $el.find(selector).text();
      const cleanedValue = cleanText(rawValue);
      const value = typeOf === "number" ? Number(cleanedValue) : cleanedValue;

      return [key, value];
    });

    const content = Object.fromEntries(entries);

    table.push(content);
  });

  return table;
}

export function cleanText(text) {
  return text
    .replace(/\t|\n|\u200a/g, "")
    .replace(/\s\s+/g, " ")
    .trim();
}
