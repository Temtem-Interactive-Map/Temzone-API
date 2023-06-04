import { initSqliteDatabase } from "config/repository/database/kysely.database";
import { getMarkerRepository } from "config/repository/marker.repository";
import { getSaiparkRepository } from "config/repository/saipark.repository";
import { getSearchRepository } from "config/repository/search.repository";
import { getSpawnRepository } from "config/repository/spawn.repository";
import { getTemtemRepository } from "config/repository/temtem.repository";
import { Context } from "hono";
import { MarkerService } from "service/marker/marker.service";
import { MarkerServiceImpl } from "service/marker/marker.service.impl";

export function getMarkerService(ctx: Context): MarkerService {
  initSqliteDatabase(ctx.env?.DB);

  const markerRepository = getMarkerRepository();
  const spawnRepository = getSpawnRepository();
  const saiparkRepository = getSaiparkRepository();
  const searchRepository = getSearchRepository(ctx.env?.CACHE);
  const temtemRepository = getTemtemRepository();
  const markerService = new MarkerServiceImpl(
    markerRepository,
    spawnRepository,
    saiparkRepository,
    searchRepository,
    temtemRepository
  );

  return markerService;
}
