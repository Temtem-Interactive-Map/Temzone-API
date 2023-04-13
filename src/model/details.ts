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

export interface Details {
  gender: Gender | null;
  catchRate: number;
  height: Height;
  weight: Weight;
}
