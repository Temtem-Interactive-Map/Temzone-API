import { load } from "cheerio";
import { readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { join } from "path";
import sharp from "sharp";
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

async function fetchImage(url) {
  const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
  const buffer = Buffer.from(arrayBuffer);

  return buffer;
}

export async function fetchPng(url, size) {
  const buffer = await fetchImage(url);
  const resizedBuffer = await sharp(buffer)
    .resize({
      width: size,
      height: size,
      fit: "inside",
    })
    .toBuffer();

  return resizedBuffer;
}

export async function fetchGif(url, size) {
  const buffer = await fetchImage(url);
  const resizedBuffer = await sharp(buffer, { animated: true })
    .resize({
      width: size,
      height: size,
      fit: "inside",
    })
    .toBuffer();

  return resizedBuffer;
}

export async function generatePortrait(url) {
  const portraitBackgroundPath = join(
    process.cwd(),
    "scraper",
    "utils",
    "assets",
    "portrait_background.png"
  );
  const portraitBorderPath = join(
    process.cwd(),
    "scraper",
    "utils",
    "assets",
    "portrait_border.png"
  );
  const temtemBuffer = await fetchPng(url, 240);
  const temtemPortraitBuffer = await sharp(portraitBackgroundPath)
    .composite([{ input: temtemBuffer, blend: "in" }])
    .toBuffer();
  const portraitBuffer = await sharp(portraitBackgroundPath)
    .composite([{ input: temtemPortraitBuffer }, { input: portraitBorderPath }])
    .toBuffer();

  return portraitBuffer;
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

export async function writeDBFile(fileName, data) {
  const path = join(process.cwd(), "database", fileName + ".json");

  return await writeFile(path, JSON.stringify(data, null, 2));
}

export async function readDBFile(fileName) {
  const path = join(process.cwd(), "database", fileName + ".json");

  return await readFile(path).then((data) => JSON.parse(data));
}

export async function removeDBContent(directory) {
  const path = join(process.cwd(), "assets", "static", directory);
  const files = await readdir(path);

  return await Promise.all(files.map((file) => unlink(join(path, file))));
}

export async function writeDBImage(fileName, buffer) {
  const path = join(process.cwd(), "assets", "static", fileName);

  return await writeFile(path, buffer);
}
