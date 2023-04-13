interface Area {
  area: string;
  rate: number;
  lumaRate: number;
  minSVs: number;
  eggTech: number;
  temtemId: string;
}

export interface SaiparkEntity {
  id: string;
  title: string;
  subtitle: string;
  areas: Area[];
}
