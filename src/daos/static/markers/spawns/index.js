import spawns from "database/spawns.json";

export class StaticSpawnMarkerDAO {
  static findById(id) {
    return spawns[id];
  }
}
