import { Type } from "model/type";

export interface SaiparkMarkerDetails {
  id: string;
  areas: {
    area: string;
    rate: number;
    lumaRate: number;
    minSVs: number;
    eggTech: number;
    temtem: {
      id: number;
      name: string;
      types: Type[];
      image: string;
    };
  }[];
}
