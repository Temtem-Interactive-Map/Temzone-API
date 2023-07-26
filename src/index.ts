import { controllers } from "controller";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { t } from "locales";
import { NotFoundError } from "service/error/not-found.error";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    exposeHeaders: ["Content-Type"],
    maxAge: 600,
  }),
);

app.notFound((ctx) =>
  ctx.json(
    {
      status: 404,
      message: t("404", { request: "route" }),
    },
    404,
  ),
);

app.onError((error, ctx) => {
  if (error instanceof NotFoundError) {
    return ctx.json(
      {
        status: 404,
        message: t("404", { request: error.request }),
      },
      404,
    );
  } else {
    console.error(error);

    return ctx.json(
      {
        status: 500,
        message: t("500"),
      },
      500,
    );
  }
});

controllers.forEach((controller) => {
  app.route(controller.path, controller.route);
});

export default app;
