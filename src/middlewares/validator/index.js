import { validator } from "hono/validator";
import { badRequest } from "responses";

export function zValidator(target, zObject) {
  return validator(target, (value, ctx) => {
    try {
      return zObject.parse(value);
    } catch (error) {
      const param = error.issues[0].path[0];

      return badRequest(ctx, param);
    }
  });
}
