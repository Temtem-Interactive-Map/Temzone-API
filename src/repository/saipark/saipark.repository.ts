import { SaiparkEntity } from "repository/saipark/model/saipark.entity";

export interface SaiparkRepository {
  findById(id: string): SaiparkEntity;
}
