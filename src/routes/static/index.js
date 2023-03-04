import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { auth } from "middlewares/auth";

export const route = new Hono();

route.get("/*", auth(), serveStatic({ root: "./" }));
