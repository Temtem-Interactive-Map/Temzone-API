import { initSqliteDatabase } from "config/repository/database/kysely.database";
import { getMarkerUserRepository } from "config/repository/marker-user.repository";
import { getMarkerRepository } from "config/repository/marker.repository";
import { getSaiparkRepository } from "config/repository/saipark.repository";
import { getSearchRepository } from "config/repository/search.repository";
import { getSpawnRepository } from "config/repository/spawn.repository";
import { getTemtemRepository } from "config/repository/temtem.repository";
import { Context } from "hono";
import { MarkerImplService } from "service/marker/marker.impl.service";
import { MarkerService } from "service/marker/marker.service";

export function getMarkerService(ctx: Context): MarkerService {
  initSqliteDatabase(ctx.env?.DB);

  const markerRepository = getMarkerRepository();
  const markerUserRepository = getMarkerUserRepository();
  const spawnRepository = getSpawnRepository();
  const saiparkRepository = getSaiparkRepository();
  const searchRepository = getSearchRepository(ctx.env?.CACHE);
  const temtemRepository = getTemtemRepository();

  return new MarkerImplService(
    markerRepository,
    markerUserRepository,
    spawnRepository,
    saiparkRepository,
    searchRepository,
    temtemRepository
  );
}
