import {
  getSqliteDatabase,
  initSqliteDatabase,
} from "config/repository/database/kysely.database";
import { MarkerRepository } from "repository/marker/marker.repository";
import { MarkerSqliteRepository } from "repository/marker/marker.sqlite.repository";

export function getMarkerRepository(database: D1Database): MarkerRepository {
  initSqliteDatabase(database);

  const db = getSqliteDatabase();
  const markerSqliteRepository = new MarkerSqliteRepository(db);

  return markerSqliteRepository;
}
