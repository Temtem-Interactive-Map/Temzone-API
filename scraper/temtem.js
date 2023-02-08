import { cleanText, scrape } from "./utils/index.js";

const TEMTEM_SELECTORS = {
  id: "div.infobox.temtem > table > tbody > tr:nth-child(4) > td",
  name: "div.infobox.temtem > table > tbody > tr:nth-child(1) > th",
};

export async function getAllTemtem($) {
  const results = [];
  const $rows = $("table.wikitable > tbody > tr > td:nth-child(2) > a");

  $rows.each(async (_, el) => {
    const $el = $(el);
    const href = $el.attr("href");
    const $temtem = await scrape("https://temtem.wiki.gg" + href);
    const content = getTemtem($temtem);

    results.push(content);
  });

  console.log(results.length);

  return results;
}

function getTemtem($) {
  const rawId = $(TEMTEM_SELECTORS.id).text();
  const id = cleanText(rawId);

  const rawName = $(TEMTEM_SELECTORS.name).text();
  const name = cleanText(rawName);

  return {
    id,
    name,
  };
}
