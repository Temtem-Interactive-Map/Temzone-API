import { MarkerEntity } from "repository/marker/model/marker.entity";

export interface MarkerRepository {
  insertMany(markers: MarkerEntity[]): Promise<MarkerEntity[]>;
  updateSpawn(
    id: string,
    subtitle: string,
    condition: string | null,
    x: number,
    y: number
  ): Promise<MarkerEntity>;
  updateSaipark(id: string, x: number, y: number): Promise<MarkerEntity>;
  findById(id: string): Promise<MarkerEntity>;
  findByTypes(types: string[]): Promise<MarkerEntity[]>;
}
