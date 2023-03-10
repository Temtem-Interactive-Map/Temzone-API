import { decodeProtectedHeader, importX509, jwtVerify } from "jose";
import { forbidden, unauthorized } from "responses";

export function auth(admin = false) {
  return async (ctx, next) => {
    try {
      const authorization = ctx.req.headers.get("Authorization");
      const token = authorization.replace(/Bearer\s+/i, "");
      const data = await getPublicKeys(ctx);
      const header = decodeProtectedHeader(token);
      const certificate = data[header.kid];
      const publicKey = await importX509(certificate, "RS256");
      const { payload } = await jwtVerify(token, publicKey, {
        issuer: "https://securetoken.google.com/" + ctx.env.FIREBASE_PROJECT_ID,
        audience: ctx.env.FIREBASE_PROJECT_ID,
      });

      if (admin && !payload.admin) {
        return forbidden(ctx);
      }

      ctx.user = {
        id: payload.user_id,
        admin: payload.admin ?? false,
      };

      await next();
    } catch (error) {
      return unauthorized(ctx);
    }
  };
}

async function getPublicKeys(ctx) {
  const data = await ctx.env.CACHE.get("firebase-public-key", "json");

  if (data === null) {
    const { data, maxAge } = await fetchPublicKeys();

    await ctx.env.CACHE.put("firebase-public-key", JSON.stringify(data), {
      expirationTtl: maxAge,
    });

    return data;
  } else {
    return data;
  }
}

async function fetchPublicKeys() {
  const response = await fetch(
    "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
  );
  const data = await response.json();
  const cacheControl = response.headers.get("Cache-Control");
  const maxAge = parseInt(
    cacheControl
      .split(",")
      .find((part) => {
        const subParts = part.trim().split("=");

        return subParts[0] === "max-age";
      })
      .split("=")[1]
  );

  return { data, maxAge };
}
