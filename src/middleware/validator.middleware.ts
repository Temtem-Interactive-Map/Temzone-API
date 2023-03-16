import { MiddlewareHandler } from "hono";
import { t } from "locales";
import { ZodError, ZodSchema } from "zod";

export function validator(
  target: "query" | "json",
  schema: ZodSchema
): MiddlewareHandler {
  return async (ctx, next) => {
    let value;

    switch (target) {
      case "query":
        value = ctx.req.query();
        break;
      case "json":
        try {
          value = await ctx.req.raw.json();
        } catch {
          return ctx.json(
            {
              status: 400,
              message: t("400", { param: "body" }),
            },
            400
          );
        }
        break;
    }

    try {
      const response = schema.parse(value);

      ctx.req.addValidatedData(target, response);

      await next();
    } catch (error) {
      const message = (error as ZodError).issues[0].message;

      return ctx.json(
        {
          status: 400,
          message: t("400", { param: message }),
        },
        400
      );
    }
  };
}
