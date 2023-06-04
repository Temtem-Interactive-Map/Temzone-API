import spawnsJson from "database/spawns.json";
import { SpawnEntity } from "repository/spawn/model/spawn.entity";
import { SpawnRepository } from "repository/spawn/spawn.repository";

export class SpawnRepositoryJson implements SpawnRepository {
  findById(id: string): SpawnEntity {
    const spawn = (spawnsJson as Record<string, unknown>)[id];

    if (!spawn) {
      throw new Error("Spawn with id " + id + " not found");
    }

    return { id, ...spawn } as SpawnEntity;
  }

  getByTemtemId(temtemId: string): SpawnEntity[] {
    return Object.entries(spawnsJson)
      .filter(([, spawn]) => spawn.temtemId === temtemId)
      .map(([id, spawn]) => ({ id, ...spawn } as SpawnEntity));
  }
}
