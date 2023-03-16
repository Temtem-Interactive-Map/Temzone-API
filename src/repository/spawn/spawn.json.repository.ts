import spawns from "database/spawns.json";
import { SpawnEntity } from "repository/spawn/model/spawn.entity";
import { SpawnRepository } from "repository/spawn/spawn.repository";

export class SpawnJsonRepository implements SpawnRepository {
  findById(id: string): SpawnEntity {
    const marker = (spawns as Record<string, SpawnEntity>)[id];

    if (!marker) {
      throw new Error("Spawn with id " + id + " not found");
    }

    return marker;
  }
}
