import { Page } from "model/page";
import { Marker } from "service/marker/model/marker";
import { SaiparkMarker } from "service/marker/model/saipark.marker";
import { SpawnMarker } from "service/marker/model/spawn.marker";

export interface MarkerService {
  insertMany(markers: Marker[]): Promise<Marker[]>;
  updateSpawnMarker(id: string, spawn: SpawnMarker): Promise<void>;
  updateSaiparkMarker(id: string, saipark: SaiparkMarker): Promise<void>;
  search(query: string, limit: number, offset: number): Promise<Page<Marker>>;
  getAll(limit: number, offset: number): Promise<Page<Marker>>;
}
