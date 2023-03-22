import { SaiparkJsonRepository } from "repository/saipark/saipark.json.repository";
import { SaiparkRepository } from "repository/saipark/saipark.repository";

export function getSaiparkRepository(): SaiparkRepository {
  const saiparkJsonRepository = new SaiparkJsonRepository();

  return saiparkJsonRepository;
}
