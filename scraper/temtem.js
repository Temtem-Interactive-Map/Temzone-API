import { cleanText, scrape } from "./utils/index.js";

export async function getAllTemtem($) {
  const results = [];
  const $rows = $("table.wikitable > tbody > tr > td:nth-child(2) > a");

  for (const el of $rows) {
    const $el = $(el);
    const href = $el.attr("href");
    const $temtem = await scrape("https://temtem.wiki.gg" + href);
    const temtem = new Temtem($temtem);

    results.push({
      id: temtem.id,
      name: temtem.name,
      description: temtem.description,
      types: temtem.types,
    });
  }

  return results;
}

class Temtem {
  constructor($) {
    this.$ = $;
  }

  get id() {
    const rawId = this.$(
      "div.infobox.temtem > table > tbody > tr:nth-child(4) > td"
    ).text();
    const cleanId = cleanText(rawId);
    const indexId = cleanId.indexOf("#");
    const textId = cleanId.substring(indexId + 1, indexId + 4);
    const id = parseInt(textId);

    return id;
  }

  get name() {
    const rawName = this.$(
      "div.infobox.temtem > table > tbody > tr:nth-child(1) > th"
    ).text();
    const name = cleanText(rawName);

    return name;
  }

  get description() {
    const rawDescription = this.$("#Tempedia").parent().next().text();
    const description = cleanText(rawDescription);

    return description;
  }

  get types() {
    const types = [];
    this.$(
      "div.infobox.temtem > table > tbody > tr:nth-child(5) > td > a"
    ).each((_, el) => {
      const $el = this.$(el);

      const rawName = $el.attr("title");
      const name = cleanText(rawName);

      const imageSrc = $el
        .find("img")
        .toArray()
        .map((img) => {
          const { attribs } = img;
          const { src } = attribs;

          return src;
        });

      types.push({
        name,
        imageSrc,
      });
    });

    return types;
  }
}
