export interface SaiparkEntity {
  id: string;
  title: string;
  subtitle: string;
  areas: {
    area: string;
    rate: number;
    lumaRate: number;
    minSVs: number;
    eggMoves: number;
    temtemId: string;
  }[];
}
