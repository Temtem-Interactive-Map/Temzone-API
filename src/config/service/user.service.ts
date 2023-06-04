import { initSqliteDatabase } from "config/repository/database/kysely.database";
import { getMarkerUserRepository } from "config/repository/marker-user.repository";
import { getMarkerRepository } from "config/repository/marker.repository";
import { getSpawnRepository } from "config/repository/spawn.repository";
import { Context } from "hono";
import { UserService } from "service/user/user.service";
import { UserServiceImpl } from "service/user/user.service.impl";

export function getUserService(ctx: Context): UserService {
  initSqliteDatabase(ctx.env?.DB);

  const markerRepository = getMarkerRepository();
  const markerUserRepository = getMarkerUserRepository();
  const spawnRepository = getSpawnRepository();
  const userService = new UserServiceImpl(
    markerRepository,
    markerUserRepository,
    spawnRepository
  );

  return userService;
}
