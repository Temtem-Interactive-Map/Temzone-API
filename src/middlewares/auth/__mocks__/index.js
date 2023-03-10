import { forbidden, unauthorized } from "responses";

export function auth(admin = false) {
  return async (ctx, next) => {
    try {
      const authorization = ctx.req.headers.get("Authorization");
      const token = authorization.replace(/Bearer\s+/i, "");
      const b64Url = token.split(".")[1];
      const b64 = b64Url.replace(/_|-/g, (m) => ({ _: "/", "-": "+" }[m] ?? m));
      const decoded = decodeBase64(b64);
      const utf8Decoder = new TextDecoder();
      const payload = JSON.parse(utf8Decoder.decode(decoded));

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
