import {
  badRequest,
  internalServerError,
  notFound,
  unauthorized,
} from "api/errors";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { decodeProtectedHeader, importX509, jwtVerify } from "jose";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Authorization"],
    allowMethods: ["POST", "GET", "UPDATE", "DELETE"],
    exposeHeaders: ["Content-Type"],
    maxAge: 600,
  })
);

app.use("*", async (ctx, next) => {
  try {
    const token = ctx.req.header("Authorization").split(" ")[1];
    const response = await fetch(
      "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
    );
    const data = await response.json();
    const header = decodeProtectedHeader(token);
    const certificate = data[header.kid];
    const publicKey = await importX509(certificate, "RS256");
    const { payload } = await jwtVerify(token, publicKey, {
      issuer: "https://securetoken.google.com/" + ctx.env.FIREBASE_PROJECT_ID,
      audience: ctx.env.FIREBASE_PROJECT_ID,
    });

    ctx.user = {
      uid: payload.user_id,
      admin: payload.admin ?? false,
    };

    await next();
  } catch (error) {
    return unauthorized(ctx);
  }
});

app.get("/markers", (ctx) => {
  const type = ctx.req.query("type");

  if (typeof type !== "string") {
    return badRequest(ctx, "type");
  }

  const types = [...new Set(type.split(","))];
  const validTypes = ["temtem", "saipark", "landmark"];

  if (!types.every((type) => validTypes.includes(type))) {
    return badRequest(ctx, "type");
  }

  return ctx.json(
    {
      items: [
        {
          id: 1,
          user: ctx.user.uid,
          admin: ctx.user.admin,
        },
      ],
    },
    200
  );
});

app.notFound((ctx) => {
  return notFound(ctx, "route");
});

app.onError((error, ctx) => {
  console.error(error);

  return internalServerError(ctx);
});

export default app;
