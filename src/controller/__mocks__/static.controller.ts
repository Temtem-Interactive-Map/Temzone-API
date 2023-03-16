import { Hono } from "hono";
import { auth } from "middleware/auth.middleware";

export const route = new Hono();

route.get("/*", auth(), (ctx) => ctx.json({}, 200));
