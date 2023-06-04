import { getSqliteDatabase } from "config/repository/database/kysely.database";
import { MarkerUserRepository } from "repository/marker-user/marker-user.repository";
import { MarkerUserRepositorySqlite } from "repository/marker-user/marker-user.repository.sqlite";

export function getMarkerUserRepository(): MarkerUserRepository {
  const db = getSqliteDatabase();
  const markerUserRepositorySqlite = new MarkerUserRepositorySqlite(db);

  return markerUserRepositorySqlite;
}
