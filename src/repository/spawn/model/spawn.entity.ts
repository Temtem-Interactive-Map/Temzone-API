interface Level {
  min: number;
  max: number;
}

export interface SpawnEntity {
  id: string;
  title: string;
  subtitle: string;
  rate: number[];
  level: Level;
  image: string;
  temtemId: string;
}
