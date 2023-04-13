import { Coordinates } from "model/coordinates";

export interface Subtitle {
  current: string;
  original: string;
}

export interface Marker {
  id: string;
  type: string;
  title: string;
  subtitle: Subtitle | string;
  coordinates: Coordinates | null;
}
