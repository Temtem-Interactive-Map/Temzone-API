import en from "./en.json" assert { type: "json" };

export function t(keys, params) {
  const key = keys.split(".").reduce((o, i) => o[i] ?? keys, en);

  if (!params) {
    return key;
  } else {
    return Object.keys(params).reduce(
      (o, i) => o.replace("@" + i, params[i]),
      key
    );
  }
}
