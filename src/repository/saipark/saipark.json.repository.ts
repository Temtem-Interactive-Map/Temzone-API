import saipark from "database/saipark.json";
import { SaiparkEntity } from "repository/saipark/model/saipark.entity";
import { SaiparkRepository } from "repository/saipark/saipark.repository";

export class SaiparkJsonRepository implements SaiparkRepository {
  findById(id: string): SaiparkEntity {
    const marker = (saipark as Record<string, SaiparkEntity>)[id];

    if (!marker) {
      throw new Error("Saipark with id " + id + " not found");
    }

    return marker;
  }
}
