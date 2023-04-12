export interface TemtemEntity {
  id: string;
  tempediaId: number;
  name: string;
  description: string;
  types: {
    name: string;
    image: string;
  }[];
  images: {
    png: string;
    gif: string;
  };
  traits: {
    name: string;
    description: string;
  }[];
  details: {
    gender: {
      male: number;
      female: number;
    } | null;
    catchRate: number;
    height: {
      cm: number;
      inches: number;
    };
    weight: {
      kg: number;
      lbs: number;
    };
  };
  stats: {
    hp: number;
    sta: number;
    spd: number;
    atk: number;
    def: number;
    spatk: number;
    spdef: number;
    total: number;
  };
  tvs: {
    hp: number;
    sta: number;
    spd: number;
    atk: number;
    def: number;
    spatk: number;
    spdef: number;
  };
  evolutions: {
    condition: string;
    traits: string[];
  }[];
}
