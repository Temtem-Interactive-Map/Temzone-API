import { initSqliteDatabase } from "config/repository/database/kysely.database";
import { getMarkerUserRepository } from "config/repository/marker-user.repository";
import { getMarkerRepository } from "config/repository/marker.repository";
import { getSpawnRepository } from "config/repository/spawn.repository";
import { Context } from "hono";
import { UserImplService } from "service/user/user.impl.service";
import { UserService } from "service/user/user.service";

export function getUserService(ctx: Context): UserService {
  initSqliteDatabase(ctx.env?.DB);

  const markerRepository = getMarkerRepository();
  const markerUserRepository = getMarkerUserRepository();
  const spawnRepository = getSpawnRepository();

  return new UserImplService(
    markerRepository,
    markerUserRepository,
    spawnRepository
  );
}
