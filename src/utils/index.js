import { z } from "zod";

const validMarkerTypes = ["spawn", "saipark"];

export const type = z
  .string()
  .refine((type) => validMarkerTypes.includes(type));

export const types = z
  .preprocess((types) => {
    z.string().parse(types, { path: ["types"] });

    return [...new Set(types.split(/%2C/))];
  }, z.string().array())
  .refine((types) => types.every((type) => validMarkerTypes.includes(type)));

export const limit = z
  .string()
  .default("20")
  .transform(parseInt)
  .refine((limit) => limit >= 0 && limit <= 60);

export const offset = z
  .string()
  .default("0")
  .transform(parseInt)
  .refine((offset) => offset >= 0);

export function getBaseUrl(request) {
  const url = new URL(request);

  return url.protocol + "//" + url.host;
}
