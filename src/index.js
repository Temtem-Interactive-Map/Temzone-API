import { controllers } from "controllers";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { internalServerError, notFound } from "responses";
import { NotFoundError } from "responses/errors";

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

  switch (error) {
    case error instanceof NotFoundError:
      return notFound(ctx, error.request);
    default:
      return internalServerError(ctx);
  }
});

controllers.forEach((controller) => {
  app.route(controller.path, controller.route);
});

export default app;
