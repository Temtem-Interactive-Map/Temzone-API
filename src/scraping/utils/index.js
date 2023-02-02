import { load } from "cheerio";

export const SCRAPINGS = {
  types: {
    url: "https://temtem.wiki.gg/wiki/Temtem_types",
  },
  traits: {
    url: "https://temtem.wiki.gg/wiki/Traits",
  },
  temtem: {
    url: "https://temtem.wiki.gg/wiki/Temtem_(creatures)",
  },
  saipark: {
    url: "https://temtem.wiki.gg/wiki/Saipark",
  },
};

export async function scrape(url) {
  const response = await fetch(url);
  const html = await response.text();

  return load(html);
}
