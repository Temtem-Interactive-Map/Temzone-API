import temtem from "database/temtem.json";

export class StaticTemtemDAO {
  static findById(id) {
    return temtem[id];
  }
}
