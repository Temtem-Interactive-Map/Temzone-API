import { Page } from "model/page";
import { Marker } from "service/marker/model/marker";
import { SaiparkMarker } from "service/marker/model/saipark.marker";
import { SaiparkMarkerDetails } from "service/marker/model/saipark.marker.details";
import { SpawnMarker } from "service/marker/model/spawn.marker";
import { SpawnMarkerDetails } from "service/marker/model/spawn.marker.details";

export interface MarkerService {
  insertMarkers(markers: Marker[]): Promise<Marker[]>;
  getSpawnMarker(id: string, baseUrl: string): Promise<SpawnMarkerDetails>;
  updateSpawnMarker(id: string, spawn: SpawnMarker): Promise<void>;
  getSaiparkMarker(id: string, baseUrl: string): Promise<SaiparkMarkerDetails>;
  updateSaiparkMarker(id: string, saipark: SaiparkMarker): Promise<void>;
  getMarkers(limit: number, offset: number): Promise<Page<Marker>>;
  searchMarkers(
    query: string,
    limit: number,
    offset: number
  ): Promise<Page<Marker>>;
}
