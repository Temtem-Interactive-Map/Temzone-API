import { MiddlewareHandler } from "hono";
import { decodeProtectedHeader, importX509, jwtVerify } from "jose";
import { t } from "locales";

export function auth(admin = false): MiddlewareHandler {
  return async (ctx, next) => {
    try {
      const authorization = ctx.req.headers.get("Authorization") as string;
      const token = authorization.replace(/Bearer\s+/i, "");
      const header = decodeProtectedHeader(token);
      let data = await ctx.env.CACHE.get("firebase-public-key", "json");

      if (data === null) {
        const response = await fetch(
          "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
        );
        const cacheControl = response.headers.get("Cache-Control") as string;
        const maxAge = cacheControl
          .split(",")
          .find((part) => part.trim().split("=")[0] === "max-age") as string;
        data = await response.json();

        await ctx.env.CACHE.put("firebase-public-key", JSON.stringify(data), {
          expirationTtl: parseInt(maxAge.split("=")[1]),
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const certificate = data[header.kid!];
      const publicKey = await importX509(certificate, "RS256");
      const { payload } = await jwtVerify(token, publicKey, {
        issuer: "https://securetoken.google.com/" + ctx.env.FIREBASE_PROJECT_ID,
        audience: ctx.env.FIREBASE_PROJECT_ID,
      });

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
