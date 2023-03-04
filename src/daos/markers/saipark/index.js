import saipark from "database/saipark.json";

export class SaiparkDao {
  findById(id) {
    return saipark[id];
  }
}
