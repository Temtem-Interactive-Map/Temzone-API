import { Page } from "model/page";
import { Marker } from "service/marker/model/marker";
import { MarkerSaipark } from "service/marker/model/marker.saipark";
import { MarkerSaiparkDetails } from "service/marker/model/marker.saipark.details";
import { MarkerSpawn } from "service/marker/model/marker.spawn";
import { MarkerSpawnDetails } from "service/marker/model/marker.spawn.details";

export interface MarkerService {
  insertMarkers(markers: Marker[]): Promise<Marker[]>;
  getSpawnMarker(id: string, baseUrl: string): Promise<MarkerSpawnDetails>;
  updateSpawnMarker(id: string, spawn: MarkerSpawn): Promise<void>;
  getSaiparkMarker(id: string, baseUrl: string): Promise<MarkerSaiparkDetails>;
  updateSaiparkMarker(id: string, saipark: MarkerSaipark): Promise<void>;
  getMarkers(limit: number, offset: number): Promise<Page<Marker>>;
  searchMarkers(
    query: string,
    limit: number,
    offset: number
  ): Promise<Page<Marker>>;
}
