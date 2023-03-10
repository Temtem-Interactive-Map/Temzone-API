import { Hono } from "hono";
import { auth } from "middlewares/auth";
import { zValidator } from "middlewares/validator";
import { noContent, ok } from "responses";
import { MarkerService } from "services/markers";
import {
  condition,
  coordinates,
  id,
  subtitle,
  title,
  type,
  types,
} from "utils";
import { z } from "zod";

export const route = new Hono();

route.get(
  "/",
  auth(true),
  zValidator("query", z.object({ types })),
  async (ctx) => {
    const { types } = ctx.req.valid("query");
    const result = await MarkerService.getMarkers(ctx, types);

    return ok(ctx, result);
  }
);

route.post(
  "/",
  auth(true),
  zValidator(
    "json",
    z.array(
      z.object({
        id,
        type,
        title,
        subtitle,
      })
    )
  ),
  async (ctx) => {
    const markers = ctx.req.valid("json");
    await MarkerService.createMarkers(ctx, markers);

    return noContent(ctx);
  }
);

route.put(
  "/spawns/:id",
  auth(true),
  zValidator(
    "json",
    z.object({
      subtitle,
      condition,
      coordinates,
    })
  ),
  async (ctx) => {
    const { id } = ctx.req.param();
    const spawn = ctx.req.valid("json");

    await MarkerService.updateSpawnMarker(ctx, id, spawn);

    return noContent(ctx);
  }
);
