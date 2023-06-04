import { Marker } from "service/marker/model/marker";

export interface MarkerSpawn extends Marker {
  condition: string | null;
}
