import { Hono } from "hono";
import { t } from "locales";

const app = new Hono();

app.get("/markers", (ctx) => {
  const type = ctx.req.query("type");

  return ctx.json(
    [
      {
        id: 1,
        type,
        message: t("error.missing", { param: "type" }),
      },
    ],
    200
  );
});

export default app;
