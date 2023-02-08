import { scrape } from "./utils/index.js";

const TEMTEM_SELECTORS = {
  name: {
    selector: "div.infobox.temtem > table > tbody > tr:nth-child(1) > th",
    typeOf: "string",
  },
};

export async function getTemtem($) {
  const results = [];
  const $rows = $("table.wikitable > tbody > tr > td:nth-child(2) > a");

  $rows.each(async (_, el) => {
    const $el = $(el);
    const href = $el.attr("href");
    const $temtem = await scrape("https://temtem.wiki.gg" + href);
    const content = getTemtemDetails($temtem);

    results.push(content);
  });

  console.log(results.length);

  return results;
}

function getTemtemDetails($) {
  const name = $(TEMTEM_SELECTORS.name.selector).text();

  return {
    name,
  };
}
