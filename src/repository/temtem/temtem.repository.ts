import { TemtemEntity } from "repository/temtem/model/temtem.entity";

export interface TemtemRepository {
  findById(id: string): TemtemEntity;
  getByTempediaId(id: number): TemtemEntity[];
}
