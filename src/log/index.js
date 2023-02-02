import pc from "picocolors";

const symbol = {
  info: pc.blue("ℹ"),
  success: pc.green("✔"),
  warning: pc.yellow("⚠"),
  error: pc.red("✖"),
};

export function logInfo(...args) {
  console.log(symbol.info + " " + pc.blue(...args));
}

export function logError(...args) {
  console.log(symbol.error + " " + pc.red(...args));
}

export function logSuccess(...args) {
  console.log(symbol.success + " " + pc.green(...args));
}

export function logWarning(...args) {
  console.log(symbol.warning + " " + pc.yellow(...args));
}
