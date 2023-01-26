import { t } from "locales";

export function ok(ctx, data) {
  ctx.status(200);

  return ctx.json(data);
}

export function noContent(ctx) {
  ctx.status(204);

  return ctx.json();
}

export function badRequest(ctx, param) {
  ctx.status(400);

  return ctx.json({
    status: 400,
    message: t("400", { param }),
  });
}

export function unauthorized(ctx) {
  ctx.status(401);

  return ctx.json({
    status: 401,
    message: t("401"),
  });
}

export function forbidden(ctx) {
  ctx.status(403);

  return ctx.json({
    status: 403,
    message: t("403"),
  });
}

export function notFound(ctx, request) {
  ctx.status(404);

  return ctx.json({
    status: 404,
    message: t("404", { request }),
  });
}

export function internalServerError(ctx) {
  ctx.status(500);

  return ctx.json({
    status: 500,
    message: t("500"),
  });
}
