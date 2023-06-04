import { getSqliteDatabase } from "config/repository/database/kysely.database";
import { MarkerRepository } from "repository/marker/marker.repository";
import { MarkerRepositorySqlite } from "repository/marker/marker.repository.sqlite";

export function getMarkerRepository(): MarkerRepository {
  const db = getSqliteDatabase();
  const markerRepositorySqlite = new MarkerRepositorySqlite(db);

  return markerRepositorySqlite;
}
