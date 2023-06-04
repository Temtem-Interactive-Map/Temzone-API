import { Gender } from "model/gender";
import { Height } from "model/height";
import { Stats } from "model/stats";
import { Trait } from "model/trait";
import { Type } from "model/type";
import { Weight } from "model/weight";

export interface TemtemEntity {
  id: string;
  tempediaId: number;
  name: string;
  description: string;
  types: Type[];
  traits: Trait[];
  gender: Gender | null;
  stats: Stats;
  tvs: Stats;
  catchRate: number;
  height: Height;
  weight: Weight;
  evolutions: {
    name: string;
    traits: string[];
    condition: string;
    image: string;
  }[];
  image: string;
}
