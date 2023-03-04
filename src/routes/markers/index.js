import { ok } from "api/responses";
import { Hono } from "hono";
import { auth } from "middlewares/auth";

export const route = new Hono();

route.get("/", auth(), async (ctx) => {
  return ok(ctx, {
    items: [],
  });
});
