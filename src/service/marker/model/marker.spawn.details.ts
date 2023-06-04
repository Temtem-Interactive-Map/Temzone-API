import { Details } from "model/details";
import { Image } from "model/image";
import { Level } from "model/level";
import { Stats } from "model/stats";
import { Trait } from "model/trait";
import { Type } from "model/type";

export interface MarkerSpawnDetails {
  id: string;
  rate: number[];
  level: Level;
  condition: string | null;
  image: Image;
  temtem: {
    id: number;
    name: string;
    description: string;
    types: Type[];
    traits: Trait[];
    details: Details;
    stats: Stats;
    tvs: Stats;
    image: Image;
    evolutions: {
      name: string;
      traits: string[];
      condition: string;
      image: Image;
    }[];
  };
}
