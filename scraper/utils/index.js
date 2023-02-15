import { load } from "cheerio";

export async function scrape(url) {
  const response = await fetch(url);
  const html = await response.text();

  return load(html);
}

export function getUrlExtension(url) {
  return url.split(/[#?]/)[0].split(".").pop().trim();
}

export function cleanText(text) {
  return text
    .replace(/\t|\n|\u200a/g, "")
    .replace(/\s\s+/g, " ")
    .trim();
}
