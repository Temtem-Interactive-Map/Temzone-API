import { getMarkerService } from "config/service/marker.service";
import {
  condition,
  coordinates,
  id,
  limit,
  offset,
  subtitle,
  title,
  type,
} from "controller/validation";
import { Hono } from "hono";
import { auth } from "middleware/auth.middleware";
import { validator } from "middleware/validator.middleware";
import { z } from "zod";

export const route = new Hono();

route.get(
  "/",
  auth(true),
  validator("query", z.object({ limit, offset })),
  async (ctx) => {
    const markerService = getMarkerService(ctx);
    const { limit, offset } = ctx.req.valid("query");
    const result = await markerService.getAll(limit, offset);

    return ctx.json(result, 200);
  }
);

route.post(
  "/",
  auth(true),
  validator(
    "json",
    z
      .array(z.object({ id, type, title, subtitle }))
      .min(1, "array")
      .max(200, "array")
  ),
  async (ctx) => {
    const markerService = getMarkerService(ctx);
    const markers = ctx.req.valid("json");
    const result = await markerService.insertMany(markers);

    return ctx.json(result, 200);
  }
);

route.put(
  "/spawns/:id",
  auth(true),
  validator("json", z.object({ subtitle, condition, coordinates })),
  async (ctx) => {
    const markerService = getMarkerService(ctx);
    const { id } = ctx.req.param();
    const spawn = ctx.req.valid("json");
    await markerService.updateSpawnMarker(id, spawn);

    return ctx.newResponse(null, 204);
  }
);

route.put(
  "/saipark/:id",
  auth(true),
  validator("json", z.object({ coordinates })),
  async (ctx) => {
    const markerService = getMarkerService(ctx);
    const { id } = ctx.req.param();
    const saipark = ctx.req.valid("json");
    await markerService.updateSaiparkMarker(id, saipark);

    return ctx.newResponse(null, 204);
  }
);
