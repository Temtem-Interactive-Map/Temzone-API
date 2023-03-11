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
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["POST", "GET", "PUT", "DELETE"],
    exposeHeaders: ["Content-Type"],
    maxAge: 600,
  })
);

app.notFound((ctx) => notFound(ctx, "route"));

app.onError((error, ctx) => {
  if (error instanceof NotFoundError) {
    return notFound(ctx, error.request);
  } else {
    console.error(error);

    return internalServerError(ctx);
  }
});

controllers.forEach((controller) => {
  app.route(controller.path, controller.route);
});

export default app;
