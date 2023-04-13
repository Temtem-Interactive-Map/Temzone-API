import { Level } from "model/level";

export interface SpawnEntity {
  id: string;
  title: string;
  subtitle: string;
  rate: number[];
  level: Level;
  image: string;
  temtemId: string;
}
