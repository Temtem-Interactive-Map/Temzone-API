import { Context, MiddlewareHandler } from "hono";
import { Toucan } from "toucan-js";

export function sentry(): MiddlewareHandler {
  return async (ctx, next) => {
    const sentry = new Toucan({
      dsn: ctx.env.SENTRY_DSN,
      request: ctx.req.raw,
      context: ctx.executionCtx,
    });

    ctx.set("sentry", sentry);

    await next();
  };
}

export function getSentry(ctx: Context): Toucan {
  return ctx.get("sentry");
}
