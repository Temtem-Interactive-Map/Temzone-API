import pc from "picocolors";

const symbol = {
  info: pc.blue("ℹ"),
  success: pc.green("✔"),
  error: pc.red("✖"),
};

export function logInfo(...args) {
  console.log(symbol.info + " " + pc.blue(...args));
}

export function logSuccess(...args) {
  console.log(symbol.success + " " + pc.green(...args));
}

export function logError(...args) {
  console.log(symbol.error + " " + pc.red(...args));
}
