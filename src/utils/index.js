import { z } from "zod";

// Map properties
const ZOOM = 6;
const TILE_SIZE = 256;
const MAP_SIZE = TILE_SIZE * Math.pow(2, ZOOM);

// Marker properties
const VALID_MARKER_TYPES = ["spawn", "saipark"];

export const id = z.string().uuid();

export const type = z
  .string()
  .refine((type) => VALID_MARKER_TYPES.includes(type));

export const title = z.string().max(40);

export const subtitle = z.string().max(40);

export const condition = z.string().max(40).nullable().default(null);

export const coordinates = z
  .object({
    x: z.number().min(0).max(MAP_SIZE),
    y: z.number().min(0).max(MAP_SIZE),
  })
  .nullable()
  .default(null);

export const types = z
  .preprocess((types) => {
    z.string().parse(types, { path: ["types"] });

    return [...new Set(types.split(/%2C/))];
  }, z.string().array())
  .refine((types) => types.every((type) => VALID_MARKER_TYPES.includes(type)));

export const query = z.string();

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
