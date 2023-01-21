import { Hono } from "hono";

const app = new Hono();

app.get("/markers", (ctx) =>
  ctx.json([
    {
      id: 1,
    },
  ])
);

export default app;
