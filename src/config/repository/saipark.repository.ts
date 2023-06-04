import { SaiparkRepository } from "repository/saipark/saipark.repository";
import { SaiparkRepositoryJson } from "repository/saipark/saipark.repository.json";

export function getSaiparkRepository(): SaiparkRepository {
  const saiparkRepositoryJson = new SaiparkRepositoryJson();

  return saiparkRepositoryJson;
}
