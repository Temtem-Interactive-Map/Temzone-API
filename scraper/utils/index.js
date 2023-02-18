import { load } from "cheerio";
import { v5 as uuidv5 } from "uuid";

export async function scrape(url) {
  const html = await fetch(url).then((res) => res.text());

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

export function generateFileName(...args) {
  return args
    .join("_")
    .replace(/[^a-zA-Z0-9_ ]/g, "")
    .replace(/ /g, "_")
    .toLowerCase();
}

export function generateId(...args) {
  const id = args.join(" ");

  return uuidv5(id, uuidv5.URL);
}
