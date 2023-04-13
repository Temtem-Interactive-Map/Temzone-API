import { Coordinates } from "model/coordinates";

export interface UserMarker {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  coordinates: Coordinates;
  obtained: boolean;
}
