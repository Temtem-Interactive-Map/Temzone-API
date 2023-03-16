import { SpawnEntity } from "repository/spawn/model/spawn.entity";

export interface SpawnRepository {
  findById(id: string): SpawnEntity;
}
