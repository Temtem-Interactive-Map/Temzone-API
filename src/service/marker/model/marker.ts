export interface Subtitle {
  current: string;
  original: string;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Marker {
  id: string;
  type: string;
  title: string;
  subtitle: Subtitle | string;
  coordinates: Coordinates | null;
}
