import { getMarkerService } from "config/service/marker.service";
import { limit, offset, query } from "controller/validation";
import { Hono } from "hono";
import { auth } from "middleware/auth.middleware";
import { validator } from "middleware/validator.middleware";
import { z } from "zod";

export const route = new Hono();

route.get(
  "/",
  auth(),
  validator("query", z.object({ query, limit, offset })),
  async (ctx) => {
    const markerService = getMarkerService(ctx);
    const { query, limit, offset } = ctx.req.valid("query");
    const result = await markerService.searchMarkers(query, limit, offset);

    return ctx.json(result, 200);
  }
);
