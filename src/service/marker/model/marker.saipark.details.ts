import { Image } from "model/image";
import { Type } from "model/type";

export interface MarkerSaiparkDetails {
  id: string;
  areas: {
    name: string;
    rate: number;
    lumaRate: number;
    minSVs: number;
    eggMoves: number;
    temtem: {
      id: number;
      name: string;
      types: Type[];
      image: Image;
    };
  }[];
}
