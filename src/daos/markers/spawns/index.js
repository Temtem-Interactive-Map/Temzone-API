import spawns from "database/spawns.json";

export class SpawnDao {
  findById(id) {
    return spawns[id];
  }
}
