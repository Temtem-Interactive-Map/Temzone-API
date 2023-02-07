import { load } from "cheerio";

export function cleanText(text) {
  return text
    .replace(/\t|\n|\u200a/g, "")
    .replace(/\s\s+/g, " ")
    .trim();
}

export async function scrape(url) {
  const response = await fetch(url);
  const html = await response.text();

  return load(html);
}
