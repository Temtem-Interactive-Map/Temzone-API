import { Hono } from "hono";
import { badRequest, internalServerError, notFound } from "./errors";

const app = new Hono();

app.get("/markers", (ctx) => {
  const type = ctx.req.query("type");

  if (typeof type !== "string") {
    return badRequest(ctx, "type");
  }

  const types = [...new Set(type.split(","))];

  if (
    !types.every((type) => ["temtem", "saipark", "landmark"].includes(type))
  ) {
    return badRequest(ctx, "type");
  }

  return ctx.json(
    [
      {
        id: 1,
      },
    ],
    200
  );
});

app.notFound((ctx) => {
  return notFound(ctx, "route");
});

app.onError((error, ctx) => {
  console.error(error);

  return internalServerError(ctx);
});

export default app;
