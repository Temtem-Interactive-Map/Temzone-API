import { writeDBImage } from "./db/index.js";
import { cleanText, scrape } from "./utils/index.js";

export async function getAllTypes() {
  const types = {};
  const $ = await scrape("https://temtem.wiki.gg/wiki/Temtem_types");

  $("ul:nth-child(6) > li > a:nth-child(1)")
    .toArray()
    .forEach((el) => {
      const $el = $(el);
      const rawName = $el.attr("title");
      const name = cleanText(rawName);
      const rawUrl = $(el).find("img").attr("src");
      const url = cleanText(rawUrl);

      const image = writeDBImage(
        name.replace(" ", "_").toLowerCase(),
        "https://temtem.wiki.gg/" + url
      );

      types[name] = {
        name,
        image,
      };
    });

  return types;
}

const types = Object.freeze(await getAllTypes());

export function findType(name) {
  return types[name];
}
