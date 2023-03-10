import saipark from "database/saipark.json";

export class StaticSaiparkMarkerDAO {
  static findById(id) {
    return saipark[id];
  }
}
