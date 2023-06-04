import { Gender } from "model/gender";
import { Height } from "model/height";
import { Image } from "model/image";
import { Level } from "model/level";
import { Stats } from "model/stats";
import { Trait } from "model/trait";
import { Type } from "model/type";
import { Weight } from "model/weight";

export interface MarkerSpawnDetails {
  id: string;
  rate: number[];
  level: Level;
  condition: string | null;
  temtem: {
    id: number;
    name: string;
    description: string;
    types: Type[];
    traits: Trait[];
    gender: Gender | null;
    stats: Stats;
    tvs: Stats;
    catch_rate: number;
    height: Height;
    weight: Weight;
    evolutions: {
      name: string;
      traits: string[];
      condition: string;
      image: Image;
    }[];
    image: Image;
  };
  image: Image;
}
