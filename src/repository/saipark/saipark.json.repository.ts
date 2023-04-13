import saiparkJson from "database/saipark.json";
import { SaiparkEntity } from "repository/saipark/model/saipark.entity";
import { SaiparkRepository } from "repository/saipark/saipark.repository";

export class SaiparkJsonRepository implements SaiparkRepository {
  findById(id: string): SaiparkEntity {
    const saipark = (saiparkJson as Record<string, unknown>)[id];

    if (!saipark) {
      throw new Error("Saipark with id " + id + " not found");
    }

    return { id, ...saipark } as SaiparkEntity;
  }
}
