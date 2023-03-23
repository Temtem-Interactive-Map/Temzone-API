import { Context, MiddlewareHandler } from "hono";
import { t } from "locales";
import { User } from "model/user";

export function auth(admin = false): MiddlewareHandler {
  return async (ctx, next) => {
    try {
      const authorization = ctx.req.headers.get("Authorization") as string;
      const token = authorization.replace(/Bearer\s+/i, "");
      const b64Url = token.split(".")[1];
      const b64 = b64Url.replace(/_|-/g, (m) => ({ _: "/", "-": "+" }[m] ?? m));
      const binary = atob(b64);
      const bytes = new Uint8Array(new ArrayBuffer(binary.length));
      const half = binary.length / 2;

      for (let i = 0, j = binary.length - 1; i <= half; i++, j--) {
        bytes[i] = binary.charCodeAt(i);
        bytes[j] = binary.charCodeAt(j);
      }

      const utf8Decoder = new TextDecoder();
      const payload = JSON.parse(utf8Decoder.decode(bytes));

      if (admin && !payload.admin) {
        return ctx.json(
          {
            status: 403,
            message: t("403"),
          },
          403
        );
      }

      ctx.set("user", {
        id: payload.user_id,
        admin: payload.admin ?? false,
      });

      await next();
    } catch (error) {
      return ctx.json(
        {
          status: 401,
          message: t("401"),
        },
        401
      );
    }
  };
}

export function getUser(ctx: Context): User {
  return ctx.get("user");
}
