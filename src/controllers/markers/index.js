import { Hono } from "hono";
import { auth } from "middlewares/auth";
import { zValidator } from "middlewares/validator";
import { noContent, ok } from "responses";
import { MarkerService } from "services/markers";
import { type, types } from "utils";
import { z } from "zod";

export const route = new Hono();

route.post(
  "/",
  auth(true),
  zValidator(
    "json",
    z.array(
      z.object({
        id: z.string().uuid(),
        type,
        title: z.string().max(40),
        subtitle: z.string().max(40),
      })
    )
  ),
  async (ctx) => {
    const markers = ctx.req.valid("json");
    await MarkerService.createMarkers(ctx, markers);

    return noContent(ctx);
  }
);

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
