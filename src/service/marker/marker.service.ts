import { Page } from "model/page";
import { Marker } from "service/marker/model/marker";
import { MarkerSaipark } from "service/marker/model/marker.saipark";
import { MarkerSaiparkDetails } from "service/marker/model/marker.saipark.details";
import { MarkerSpawn } from "service/marker/model/marker.spawn";
import { MarkerSpawnDetails } from "service/marker/model/marker.spawn.details";

export interface MarkerService {
  insertMarkers(markers: Marker[]): Promise<Marker[]>;
  getMarkers(limit: number, offset: number): Promise<Page<Marker>>;
  search(query: string, limit: number, offset: number): Promise<Page<Marker>>;
  getSpawn(id: string, baseUrl: string): Promise<MarkerSpawnDetails>;
  updateSpawn(id: string, spawn: MarkerSpawn): Promise<void>;
  getSaipark(id: string, baseUrl: string): Promise<MarkerSaiparkDetails>;
  updateSaipark(id: string, saipark: MarkerSaipark): Promise<void>;
}
