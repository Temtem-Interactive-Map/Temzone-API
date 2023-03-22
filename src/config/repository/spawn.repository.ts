import { SpawnJsonRepository } from "repository/spawn/spawn.json.repository";
import { SpawnRepository } from "repository/spawn/spawn.repository";

export function getSpawnRepository(): SpawnRepository {
  const spawnJsonRepository = new SpawnJsonRepository();

  return spawnJsonRepository;
}
