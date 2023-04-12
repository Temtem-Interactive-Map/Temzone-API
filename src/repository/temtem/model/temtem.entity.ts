interface Type {
  name: string;
  image: string;
}

interface Trait {
  name: string;
  description: string;
}

interface Gender {
  male: number;
  female: number;
}

interface Height {
  cm: number;
  inches: number;
}

interface Weight {
  kg: number;
  lbs: number;
}

interface Stats {
  hp: number;
  sta: number;
  spd: number;
  atk: number;
  def: number;
  spatk: number;
  spdef: number;
  total: number;
}

interface TVs {
  hp: number;
  sta: number;
  spd: number;
  atk: number;
  def: number;
  spatk: number;
  spdef: number;
}

interface Evolution {
  condition: string;
  traits: string[];
}

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
  details: {
    gender: Gender | null;
    catchRate: number;
    height: Height;
    weight: Weight;
  };
  stats: Stats;
  tvs: TVs;
  evolutions: Evolution[];
}
