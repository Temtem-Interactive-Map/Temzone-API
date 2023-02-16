import { load } from "cheerio";

export async function scrape(url) {
  const response = await fetch(url);
  const html = await response.text();

  return load(html);
}

export function cleanText(text) {
  return text
    .replace(/\t|\n|\u200a/g, "")
    .replace(/\s\s+/g, " ")
    .trim();
}

export function shortUrl(rawUrl) {
  const url = rawUrl.split(/[#?]/).shift().trim();

  if (!url.includes("/thumb")) return url;

  const index = url.lastIndexOf("/");

  return url.substring(0, index).replace("/thumb", "");
}

export function getUrlExtension(url) {
  return url.split(/[#?]/).shift().split(".").pop().trim();
}
