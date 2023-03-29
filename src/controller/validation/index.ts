import { z } from "zod";

// Map properties
const ZOOM = 6;
const TILE_SIZE = 256;
const MAP_SIZE = TILE_SIZE * Math.pow(2, ZOOM);

// Marker properties
const MARKER_TYPES = ["spawn", "saipark"];

export const id = z
  .string({ invalid_type_error: "id", required_error: "id" })
  .uuid("id");

export const type = z
  .string({ invalid_type_error: "type", required_error: "type" })
  .refine((type) => MARKER_TYPES.includes(type), "type");

export const title = z
  .string({ invalid_type_error: "title", required_error: "title" })
  .max(40, "title");

export const subtitle = z
  .string({ invalid_type_error: "subtitle", required_error: "subtitle" })
  .max(40, "subtitle");

export const condition = z
  .string({ invalid_type_error: "condition", required_error: "condition" })
  .max(40, "condition")
  .nullable();

export const coordinates = z.object(
  {
    x: z
      .number({
        invalid_type_error: "coordinates.x",
        required_error: "coordinates.x",
      })
      .min(0, "coordinates.x")
      .max(MAP_SIZE, "coordinates.x"),
    y: z
      .number({
        invalid_type_error: "coordinates.y",
        required_error: "coordinates.y",
      })
      .min(0, "coordinates.y")
      .max(MAP_SIZE, "coordinates.y"),
  },
  { invalid_type_error: "coordinates", required_error: "coordinates" }
);

export const query = z.string({
  invalid_type_error: "query",
  required_error: "query",
});

export const limit = z
  .string({
    invalid_type_error: "limit",
    required_error: "limit",
  })
  .default("20")
  .transform((limit) => parseInt(limit))
  .refine((limit) => limit >= 0 && limit <= 200, "limit");

export const offset = z
  .string({
    invalid_type_error: "offset",
    required_error: "offset",
  })
  .default("0")
  .transform((offset) => parseInt(offset))
  .refine((offset) => offset >= 0, "offset");
