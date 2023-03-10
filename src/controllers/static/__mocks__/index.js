import { Hono } from "hono";
import { auth } from "middlewares/auth";
import { ok } from "responses";

export const route = new Hono();

route.get("/*", auth(), (ctx) => ok(ctx, null));
