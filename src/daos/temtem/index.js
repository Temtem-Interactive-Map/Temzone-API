import temtem from "database/temtem.json";

export class SaiparkDao {
  findById(id) {
    return temtem[id];
  }
}
