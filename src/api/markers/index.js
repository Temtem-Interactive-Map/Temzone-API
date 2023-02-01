import { badRequest, noContent, ok } from "api/responses";
import { Hono } from "hono";

export const markers = new Hono();

markers.get("/", (ctx) => {
  const type = ctx.req.query("type");

  if (typeof type !== "string") {
    return badRequest(ctx, "type");
  }

  const types = [...new Set(type.split(","))];
  const validTypes = ["temtem", "saipark", "landmark"];

  if (!types.every((type) => validTypes.includes(type))) {
    return badRequest(ctx, "type");
  }

  return ok(ctx, {
    items: types.map((type) => {
      return {
        id: 1,
        type,
        title: "Temtem 1",
        subtitle: "Subtitle 1",
        coordinates: {
          x: 0,
          y: 0,
        },
      };
    }),
  });
});

markers.put("/:id{[0-9]+}/temtem", (ctx) => {
  const id = ctx.req.param("id");

  return noContent(ctx);
});
