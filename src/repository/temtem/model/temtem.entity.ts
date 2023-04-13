import { Details } from "model/details";
import { Stats } from "model/stats";
import { Trait } from "model/trait";
import { Type } from "model/type";

export interface TemtemEntity {
  id: string;
  tempediaId: number;
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
}
