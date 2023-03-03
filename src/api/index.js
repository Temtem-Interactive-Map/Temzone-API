import {
  badRequest,
  internalServerError,
  noContent,
  notFound,
  ok,
  unauthorized,
} from "api/responses";
import { Hono } from "hono";
import { cache } from "hono/cache";
import { serveStatic } from "hono/cloudflare-workers";
import { cors } from "hono/cors";
import { decodeProtectedHeader, importX509, jwtVerify } from "jose";

// const markerDao = new MarkerDao();
// const spawnDao = new SpawnDao();
// const saiparkDao = new SaiparkDao();
// const markersService = new MarkersService(markerDao, spawnDao, saiparkDao);
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
      userId: payload.user_id,
      admin: payload.admin ?? false,
    };

    await next();
  } catch (error) {
    return unauthorized(ctx);
  }
});

// app.use("*", async (ctx, next) => {
//   const conn = connect({
//     host: ctx.env.MYSQL_HOST,
//     username: ctx.env.MYSQL_USERNAME,
//     password: ctx.env.MYSQL_PASSWORD,
//   });

//   markersService.configure(conn);

//   await next();
// });

app.get(
  "*",
  cache({
    cacheName: "temzone",
    cacheControl: "max-age=3600",
  })
);

app.get("/static/*", serveStatic({ root: "./" }));

app.get("/markers", async (ctx) => {
  const type = ctx.req.query("type");

  if (typeof type !== "string") {
    return badRequest(ctx, "type");
  }

  const types = [...new Set(type.split(/%2C/))];
  const validMarkerTypes = ["spawn", "saipark"];

  if (!types.every((type) => validMarkerTypes.includes(type))) {
    return badRequest(ctx, "type");
  }

  // const markers = await markersService.getMarkers(types);

  return ok(ctx, {
    items: [],
  });
});

app.put("/markers/:id", (ctx) => {
  const id = ctx.req.param("id");

  return noContent(ctx);
});

app.notFound((ctx) => {
  return notFound(ctx, "route");
});

app.onError((error, ctx) => {
  console.error(error);

  return internalServerError(ctx);
});

export default app;
