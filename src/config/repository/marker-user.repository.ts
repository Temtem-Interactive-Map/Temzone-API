import { getSqliteDatabase } from "config/repository/database/kysely.database";
import { MarkerUserRepository } from "repository/marker-user/marker-user.repository";
import { MarkerUserSqliteRepository } from "repository/marker-user/marker-user.sqlite.repository";

export function getMarkerUserRepository(): MarkerUserRepository {
  const db = getSqliteDatabase();
  const markerUserSqliteRepository = new MarkerUserSqliteRepository(db);

  return markerUserSqliteRepository;
}
