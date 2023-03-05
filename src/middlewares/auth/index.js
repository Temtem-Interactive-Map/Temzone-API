import { forbidden, unauthorized } from "api/responses";
import { decodeProtectedHeader, importX509, jwtVerify } from "jose";

export function auth(admin = false) {
  return async (ctx, next) => {
    try {
      const authorization = ctx.req.headers.get("Authorization");
      const token = authorization.replace(/Bearer\s+/i, "");
      const payload = await getPayload(token, ctx.env);

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

async function getPayload(token, env) {
  if (env.FIREBASE_EMULATOR) {
    const b64Url = token.split(".")[1];
    const b64 = b64Url.replace(/_|-/g, (m) => ({ _: "/", "-": "+" }[m] ?? m));
    const decoded = decodeBase64(b64);
    const utf8Decoder = new TextDecoder();
    const payload = JSON.parse(utf8Decoder.decode(decoded));

    return payload;
  } else {
    const data = await getPublicKeys(env.cache);
    const header = decodeProtectedHeader(token);
    const certificate = data[header.kid];
    const publicKey = await importX509(certificate, "RS256");
    const { payload } = await jwtVerify(token, publicKey, {
      issuer: "https://securetoken.google.com/" + env.FIREBASE_PROJECT_ID,
      audience: env.FIREBASE_PROJECT_ID,
    });

    return payload;
  }
}

function decodeBase64(str) {
  const binary = atob(str);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  const half = binary.length / 2;

  for (let i = 0, j = binary.length - 1; i <= half; i++, j--) {
    bytes[i] = binary.charCodeAt(i);
    bytes[j] = binary.charCodeAt(j);
  }

  return bytes;
}

async function getPublicKeys(cache) {
  const data = await cache.get("firebase-public-key", "json");

  if (data === null) {
    const { data, maxAge } = await fetchPublicKeys();

    await cache.put("firebase-public-key", JSON.stringify(data), {
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
