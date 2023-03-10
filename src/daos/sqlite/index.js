import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

export function getDBClient(ctx) {
  return new Kysely({
    dialect: new D1Dialect({
      database: ctx.env.DB,
    }),
  });
}
