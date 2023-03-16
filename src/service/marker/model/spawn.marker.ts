import { Marker } from "service/marker/model/marker";

export interface SpawnMarker extends Marker {
  condition: string | null;
}
