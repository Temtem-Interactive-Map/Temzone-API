import { Hono } from "hono";

const app = new Hono();

app.get("/", (ctx) => {
  ctx.json({ message: "Hello World!" });
});
