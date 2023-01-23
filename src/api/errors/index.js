import { t } from "locales";

export function badRequest(ctx, param) {
  return ctx.json(
    {
      status: 400,
      message: t("400", { param }),
    },
    400
  );
}

export function unauthorized(ctx) {
  return ctx.json(
    {
      status: 401,
      message: t("401"),
    },
    401
  );
}

export function forbidden(ctx) {
  return ctx.json(
    {
      status: 403,
      message: t("403"),
    },
    403
  );
}

export function notFound(ctx, request) {
  return ctx.json(
    {
      status: 404,
      message: t("404", { request }),
    },
    404
  );
}

export function internalServerError(ctx) {
  return ctx.json(
    {
      status: 500,
      message: t("500"),
    },
    500
  );
}
