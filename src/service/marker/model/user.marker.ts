import { Marker } from "service/marker/model/marker";

export interface UserMarker extends Marker {
  obtained: boolean;
}
