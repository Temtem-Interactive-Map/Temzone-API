import { SpawnRepository } from "repository/spawn/spawn.repository";
import { SpawnRepositoryJson } from "repository/spawn/spawn.repository.json";

export function getSpawnRepository(): SpawnRepository {
  const spawnRepositoryJson = new SpawnRepositoryJson();

  return spawnRepositoryJson;
}
