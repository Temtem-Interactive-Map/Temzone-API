import { Details } from "model/details";
import { Level } from "model/level";
import { Stats } from "model/stats";
import { Trait } from "model/trait";
import { Type } from "model/type";

export interface MarkerSpawnDetails {
  id: string;
  rate: number[];
  level: Level;
  condition: string | null;
  image: string;
  temtem: {
    id: number;
    name: string;
    description: string;
    types: Type[];
    images: {
      png: string;
      gif: string;
    };
    traits: Trait[];
    details: Details;
    stats: Stats;
    tvs: Stats;
    evolutions: {
      name: string;
      traits: string[];
      condition: string;
      image: string;
    }[];
  };
}
