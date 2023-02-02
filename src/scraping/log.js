import { blue, green, red, yellow } from "picocolors";

const symbol = {
  info: blue("ℹ"),
  success: green("✔"),
  warning: yellow("⚠"),
  error: red("✖"),
};

export const logInfo = (...args) =>
  console.log(symbol.info + " " + blue(...args));
export const logError = (...args) =>
  console.log(symbol.error + " " + red(...args));
export const logSuccess = (...args) =>
  console.log(symbol.success + " " + green(...args));
export const logWarning = (...args) =>
  console.log(symbol.warning + " " + yellow(...args));
