import { getUserService } from "config/service/user.service";
import { limit, offset } from "controller/validation";
import { Hono } from "hono";
import { auth, getUser } from "middleware/auth.middleware";
import { validator } from "middleware/validator.middleware";
import { z } from "zod";

export const route = new Hono();

route.get(
  "/markers",
  auth(),
  validator("query", z.object({ limit, offset })),
  async (ctx) => {
    const userService = getUserService(ctx);
    const { limit, offset } = ctx.req.valid("query");
    const user = getUser(ctx);
    const result = await userService.getMarkers(user.id, limit, offset);

    return ctx.json(result, 200);
  },
);

route.put("/temtem/:id", auth(), async (ctx) => {
  const userService = getUserService(ctx);
  const { id } = ctx.req.param();
  const user = getUser(ctx);
  await userService.setTemtemObtained(user.id, parseInt(id));

  return ctx.newResponse(null, 204);
});
