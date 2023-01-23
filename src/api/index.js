import { badRequest, internalServerError, notFound } from "api/errors";
import { Hono } from "hono";

const app = new Hono();
const validTypes = ["temtem", "saipark", "landmark"];

app.get("/markers", (ctx) => {
  const type = ctx.req.query("type");

  if (typeof type !== "string") {
    return badRequest(ctx, "type");
  }

  const types = [...new Set(type.split(","))];

  if (!types.every((type) => validTypes.includes(type))) {
    return badRequest(ctx, "type");
  }

  return ctx.json(
    {
      items: [
        {
          id: 1,
        },
      ],
    },
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
