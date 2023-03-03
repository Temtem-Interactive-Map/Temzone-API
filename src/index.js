import { internalServerError, notFound } from "api/responses";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { routes } from "routes";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Authorization"],
    allowMethods: ["POST", "GET", "UPDATE", "DELETE"],
    exposeHeaders: ["Content-Type"],
    maxAge: 600,
  })
);

app.notFound((ctx) => notFound(ctx, "route"));

app.onError((error, ctx) => {
  console.error(error);

  return internalServerError(ctx);
});

routes.forEach((route) => {
  app.route(route.path, route.route);
});

export default app;
