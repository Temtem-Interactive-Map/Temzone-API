import { cleanText, scrape } from "./utils/index.js";

const TEMTEM_SELECTORS = {
  id: "div.infobox.temtem > table > tbody > tr:nth-child(4) > td",
  name: "div.infobox.temtem > table > tbody > tr:nth-child(1) > th",
  description: "#Tempedia",
  types: "div.infobox.temtem > table > tbody > tr:nth-child(5) > td > a",
};

export async function getAllTemtem($) {
  const results = [];
  const $rows = $("table.wikitable > tbody > tr > td:nth-child(2) > a");

  for (const el of $rows) {
    const $el = $(el);
    const href = $el.attr("href");
    const $temtem = await scrape("https://temtem.wiki.gg" + href);
    const temtem = getTemtem($temtem);

    results.push(temtem);
  }

  return results;
}

function getTemtem($) {
  const id = parseId($(TEMTEM_SELECTORS.id));
  const name = parseName($(TEMTEM_SELECTORS.name));
  const description = parseDescription($(TEMTEM_SELECTORS.description));
  const types = [];
  $(TEMTEM_SELECTORS.types).each((_, el) => {
    const $el = $(el);
    const rawType = $el.attr("title");

    types.push({
      name: rawType,
    });
  });

  return {
    id,
    name,
    description,
    types,
  };
}

function parseId(selector) {
  const rawId = selector.text();
  const cleanId = cleanText(rawId);
  const indexId = cleanId.indexOf("#");
  const textId = cleanId.substring(indexId + 1, indexId + 4);
  const id = parseInt(textId);

  return id;
}

function parseName(selector) {
  const rawName = selector.text();
  const name = cleanText(rawName);

  return name;
}

function parseDescription(selector) {
  const rawDescription = selector.parent().next().text();
  const description = cleanText(rawDescription);

  return description;
}

function parseTypes(selector) {
  return {};
}
