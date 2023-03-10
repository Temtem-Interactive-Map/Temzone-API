import { Hono } from "hono";
import { auth } from "middlewares/auth";
import { zValidator } from "middlewares/validator";
import { ok } from "responses";
import { MarkerService } from "services/markers";
import { limit, offset } from "utils";
import { z } from "zod";

export const route = new Hono();

route.get(
  "/",
  auth(),
  zValidator(
    "query",
    z.object({
      query: z.string(),
      limit,
      offset,
    })
  ),
  async (ctx) => {
    const { query, limit, offset } = ctx.req.valid("query");
    const result = await MarkerService.searchMarkers(ctx, query, limit, offset);

    return ok(ctx, result);
  }
);
